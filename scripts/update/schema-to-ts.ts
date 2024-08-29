import { existsSync, promises as fs } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import fg from 'fast-glob'
import { compile } from 'json-schema-to-typescript-lite'
import type { JSONSchema4 } from 'json-schema'
import { format } from 'prettier'
import { hash } from 'ohash'
import { GEN_HEADER, ROOT } from './meta'

const VERSION = 'v1'

export async function generateDtsFromSchema() {
  const files = await fg('packages/eslint-plugin-{js,ts,jsx,plus}/rules/**/*.ts', {
    onlyFiles: true,
    absolute: true,
    ignore: [
      '**/index.ts',
      '**/*.d.ts',
      '**/*.test.ts',
    ],
  })

  for (const file of files) {
    let name = basename(file, '.ts')
    let suffix = ''
    const suffixMatch = name.match(/\.(_\w+_)$/) // For special markers `._js_`
    if (suffixMatch) {
      suffix = suffixMatch[1]
      name = name.slice(0, -suffix.length)
    }
    const dtsFile = resolve(file, '..', `types${suffix}.d.ts`)

    const meta = await import(file).then(r => r.default.meta)
    const checksum = hash({ meta, VERSION })

    const lastChecksum = existsSync(dtsFile) ? (await fs.readFile(dtsFile, 'utf-8'))
      .match(/@checksum:\s(\S*)\s/)?.[1] : ''

    if (lastChecksum === checksum) {
      continue
    }

    const messageIds = Object.keys(meta.messages ?? {})
    let schemas = meta.schema as JSONSchema4[] ?? []
    if (!Array.isArray(schemas))
      schemas = [schemas]

    const options = await Promise.all(schemas.map(async (schema, index) => {
      schema = JSON.parse(JSON.stringify(schema).replace(/#\/items\/0\/\$defs\//g, '#/$defs/'))

      try {
        const compiled = await compile(schema, `Schema${index}`, {})
        return compiled
      }
      catch {
        console.warn(`Failed to compile schema Schema${index} for rule ${name}. Falling back to unknown.`)
        return `export type Schema${index} = unknown\n`
      }
    }))

    const optionTypes = options.map((_, index) => `Schema${index}?`)
    const ruleOptionTypeValue = Array.isArray(meta.schema)
      ? `[${optionTypes.join(', ')}]`
      : meta.schema
        ? 'Schema0'
        : '[]'

    const lines = [
      GEN_HEADER,
      `/* @checksum: ${checksum} */`,
      '',
      ...options,
      `export type RuleOptions = ${ruleOptionTypeValue}`,
      `export type MessageIds = ${messageIds.map(i => `'${i}'`).join(' | ') || 'never'}`,
      '',
    ]

    const formatted = await format(lines.join('\n'), {
      parser: 'typescript',
      printWidth: 60,
      singleQuote: true,
      semi: false,
    })

    await fs.writeFile(dtsFile, formatted, 'utf-8')
    if (suffix) {
      const pkg = suffix.slice(2, -1)
      await fs.writeFile(join(ROOT, 'packages', `eslint-plugin-${pkg}`, name, 'type.d.ts'), formatted, 'utf-8')
    }
  }
}
