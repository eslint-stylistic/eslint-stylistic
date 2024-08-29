import { existsSync, promises as fs } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import fg from 'fast-glob'
import { compile } from 'json-schema-to-typescript-lite'
import type { JSONSchema4 } from 'json-schema'
import { format } from 'prettier'
import { hash } from 'ohash'
import { pascalCase } from 'change-case'
import { GEN_HEADER } from './meta'

const VERSION = 'v1'

const PACKAGES = [
  'ts',
  'jsx',
  'plus',
  'js',
]

export async function generateDtsFromSchema() {
  const dirs = await fg('packages/eslint-plugin/rules/*', {
    onlyDirectories: true,
    absolute: true,
  })

  for (const dir of dirs) {
    const name = basename(dir)

    const pkgs = PACKAGES.filter(i => existsSync(join(dir, `${name}._${i}_.ts`)))
    const formatted = await Promise.all(pkgs.map(async (pkg) => {
      const file = join(dir, `${name}._${pkg}_.ts`)
      const formatted = await getDts(
        file,
        name,
      )
      return [pkg, formatted] as const
    }))

    if (new Set(formatted.map(i => i[1])).size === 1) {
      await fs.writeFile(resolve(dir, `types.d.ts`), formatted[0][1], 'utf-8')
    }
    else {
      for (const [pkg, dts] of formatted) {
        await fs.writeFile(resolve(dir, `types._${pkg}_.d.ts`), dts, 'utf-8')
      }
      await fs.writeFile(resolve(dir, `types.d.ts`), formatted[0][1], 'utf-8')
    }
  }
}

async function getDts(ruleFile: string, name: string) {
  const meta = await import(ruleFile).then(r => r.default.meta)
  const checksum = hash({
    messages: meta.messages,
    schema: meta.schema,
    VERSION,
  })

  const messageIds = Object.keys(meta.messages ?? {})
  let schemas = meta.schema as JSONSchema4[] ?? []
  if (!Array.isArray(schemas))
    schemas = [schemas]

  const prefix = pascalCase(name)

  const options = await Promise.all(schemas.map(async (schema, index) => {
    schema = JSON.parse(JSON.stringify(schema).replace(/#\/items\/0\/\$defs\//g, '#/$defs/'))

    try {
      const compiled = await compile(schema, `${prefix}Schema${index}`, {})
      return compiled
    }
    catch {
      console.warn(`Failed to compile schema Schema${index} for rule ${name}. Falling back to unknown.`)
      return `export type ${prefix}Schema${index} = unknown\n`
    }
  }))

  const optionTypes = options.map((_, index) => `${prefix}Schema${index}?`)
  const ruleOptionTypeValue = Array.isArray(meta.schema)
    ? `[${optionTypes.join(', ')}]`
    : meta.schema
      ? `${prefix}Schema0`
      : '[]'

  const lines = [
    GEN_HEADER,
    `/* @checksum: ${checksum} */`,
    '',
    ...options,
    `export type ${prefix}RuleOptions = ${ruleOptionTypeValue}`,
    '',
    `export type RuleOptions = ${prefix}RuleOptions`,
    `export type MessageIds = ${messageIds.map(i => `'${i}'`).join(' | ') || 'never'}`,
    '',
  ]

  const formatted = await format(lines.join('\n'), {
    parser: 'typescript',
    printWidth: 60,
    singleQuote: true,
    semi: false,
  })

  return formatted
}
