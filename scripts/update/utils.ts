import type { PackageInfo, RuleInfo } from '../../packages/metadata/src/types'
import fs from 'node:fs/promises'
import { basename, join, posix, relative, resolve, win32 } from 'node:path'
import { pathToFileURL } from 'node:url'
import { pascalCase } from 'change-case'
import fg from 'fast-glob'
import { customize } from '../../packages/eslint-plugin/configs/customize'
import { GEN_HEADER, ROOT } from './meta'

export const rulesInSharedConfig = new Set<string>(Object.keys(customize().rules!))

export async function readPackage(path: string): Promise<PackageInfo> {
  const dir = relative(join(ROOT, 'packages'), path)
  const pkgId = `@stylistic/${dir.replace('eslint-plugin-', '')}`
  const shortId = pkgId.replace('@stylistic/', '')
  const pkgJSON = JSON.parse(await fs.readFile(join(path, 'package.json'), 'utf-8'))
  console.log(`Preparing ${path}`)
  const rulesDir = (await fg('rules/*', {
    cwd: path,
    onlyDirectories: true,
  })).sort()

  const rules = await Promise.all(
    rulesDir.map(async (ruleDir) => {
      const name = basename(ruleDir)

      const docsDir = ruleDir

      const entry = join(path, ruleDir, `${name}.ts`).replace(/\\/g, '/')
      const url = pathToFileURL(entry).href
      const mod = await import(url)
      const meta = mod.default?.meta

      const rule: RuleInfo = {
        name,
        ruleId: `${pkgId}/${name}`,
        entry: relative(ROOT, entry).replace(/\\/g, '/'),
        // TODO: check if entry exists
        docsEntry: relative(ROOT, resolve(path, docsDir, 'README.md')).replace(/\\/g, '/'),
        meta: {
          fixable: meta?.fixable,
          docs: {
            ...meta.docs,
            recommended: rulesInSharedConfig.has(`@stylistic/${name}`),
          },
        },
      }
      return rule
    }),
  )

  rules.sort((a, b) => a.name.localeCompare(b.name))

  return {
    name: pkgJSON.name,
    shortId,
    pkgId,
    path: relative(ROOT, path),
    rules,
  }
}

export async function writeRulesIndex(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  const ruleDir = join(pkg.path, 'rules')

  await fs.mkdir(ruleDir, { recursive: true })

  const index = [
    GEN_HEADER,
    'import type { Rules } from \'../dts\'',
    '',
    ...pkg.rules
      .map(i => `import ${camelCase(i.name)} from './${i.name}/${i.name}'`),
    '',
    'export default {',
    ...pkg.rules.map(i => `  '${i.name}': ${camelCase(i.name)},`),
    '} as unknown as Rules',
    '',
  ].join('\n')

  await fs.writeFile(join(ruleDir, `index.ts`), index, 'utf-8')
}

export async function writePackageDTS(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  const lines = [
    GEN_HEADER,
    ...pkg.rules
      .map((rule) => {
        const path = `../rules/${rule.name}/types`
        return `import type { ${pascalCase(rule.name)}RuleOptions } from '${path}'`
      }),
    '',
    'export interface RuleOptions {',
    ...pkg.rules.flatMap((rule) => {
      return [
        '  /**',
        `   * ${rule.meta?.docs?.description || ''}`,
        `   * @see https://eslint.style/rules/${rule.name}`,
        '   */',
        `  '${pkg.name.replace(/eslint-plugin-|\/eslint-plugin$/, '')}/${rule.name}': ${pascalCase(rule.name)}RuleOptions`,
      ]
    }),
    '}',
    '',
    'export interface UnprefixedRuleOptions {',
    ...pkg.rules.flatMap((rule) => {
      return [
        '  /**',
        `   * ${rule.meta?.docs?.description || ''}`,
        `   * @see https://eslint.style/rules/${rule.name}`,
        '   */',
        `  '${rule.name}': ${pascalCase(rule.name)}RuleOptions`,
      ]
    }),
    '}',
    '',
  ]

  await fs.writeFile(
    join(pkg.path, 'dts', 'rule-options.d.ts'),
    lines.join('\n'),
    'utf-8',
  )

  await fs.writeFile(
    join(pkg.path, 'dts', 'define-config-support.d.ts'),
    `${GEN_HEADER}
import type { RuleOptions } from './rule-options'

declare module 'eslint-define-config' {
  export interface CustomRuleOptions extends RuleOptions {}
}

export {}
`,
    'utf-8',
  )
}

export async function updateExports(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  const pkgJson = JSON.parse(await fs.readFile(join(pkg.path, 'package.json'), 'utf-8'))
  pkgJson.exports = {
    '.': {
      types: './dist/dts/index.d.ts',
      import: './dist/index.js',
      default: './dist/index.js',
    },
    './define-config-support': {
      types: './dist/dts/define-config-support.d.ts',
    },
    './rule-options': {
      types: './dist/dts/rule-options.d.ts',
    },
    ...Object.fromEntries(
      pkg.rules.map(i => [`./rules/${i.name}`, `./dist/rules/${i.name}.js`]),
    ),
  }
  pkgJson.types = './dist/dts/index.d.ts'
  pkgJson.main = './dist/index.js'
  pkgJson.files = ['dist']
  await fs.writeFile(join(pkg.path, 'package.json'), `${JSON.stringify(pkgJson, null, 2)}\n`, 'utf-8')
}

export async function writeREADME(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  const description = (i: RuleInfo) => i.meta?.docs?.description || ''

  const lines = [
    '<!--',
    GEN_HEADER.trim(),
    '-->',
    '',
    `# ${pkg.name}`,
    '',
    '| Rule ID | Description | Fixable | Recommended |',
    '| --- | --- | --- | --- |',
    ...pkg.rules.map(i => `| [\`${i.ruleId}\`](./rules/${i.name}) | ${description(i)} | ${i.meta?.fixable ? '✅' : ''} | ${i.meta?.docs?.recommended ? '✅' : ''} |`),
  ]

  await fs.writeFile(join(pkg.path, 'rules.md'), lines.join('\n'), 'utf-8')
}

export function camelCase(str: string) {
  return str
    .replace(/[^\w-]+/, '')
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export async function generateMetadata(packages: PackageInfo[]) {
  await fs.writeFile(
    join(ROOT, 'packages', 'metadata', 'src', 'metadata.ts'),
    `${GEN_HEADER}
import type { PackageInfo, RuleInfo } from './types'

export const packages: Readonly<PackageInfo[]> = Object.freeze(${JSON.stringify(packages, null, 2)})

export const rules: Readonly<RuleInfo[]> = Object.freeze(packages.flatMap(p => p.rules))
`.trimStart(),
    'utf-8',
  )
}

export function normalizePath(id: string) {
  return posix.normalize(id).replaceAll(win32.sep, posix.sep)
}
