/**
 * @fileoverview Scripts to update metadata and types.
 */

import { basename, dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import fs from 'fs-extra'
import fg from 'fast-glob'
import { pascalCase } from 'change-case'
import type { JSONSchema4 } from 'json-schema'
import { compile as compileSchema } from 'json-schema-to-typescript'

// @ts-expect-error https://github.com/privatenumber/tsx/issues/38
import config from '../packages/eslint-plugin/configs/customize'
import type { PackageInfo, RuleInfo } from '../packages/metadata/src/types'

const rulesInSharedConfig = new Set<string>(Object.keys(config.customize().rules))

const header = `
/* GENERATED, DO NOT EDIT DIRECTLY */
`.trimStart()

const cwd = process.cwd()

// Alias / Source
const aliases: Record<string, string> = {
  'func-call-spacing': 'function-call-spacing',
}

const originalIdMap: Record<string, string> = {
  'function-call-spacing': 'func-call-spacing',
  '@typescript-eslint/function-call-spacing': '@typescript-eslint/func-call-spacing',
}

async function writeRulesIndex(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  const ruleDir = join(pkg.path, 'rules')

  await fs.mkdir(ruleDir, { recursive: true })

  const noCheck = (pkg.shortId === 'js' || pkg.shortId === 'jsx')

  const index = [
    header,
    noCheck ? '\n// TODO: remove this once every rule is migrated to TypeScript\n// eslint-disable-next-line ts/ban-ts-comment\n// @ts-nocheck\n' : '',
    'import type { Rules } from \'../dts\'',
    '',
    ...pkg.rules
      .filter(i => !(i.name in aliases))
      .map(i => `import ${camelCase(i.name)} from './${i.name}/${i.name}'`),
    '',
    'export default {',
    ...pkg.rules.map(i => `  '${i.name}': ${camelCase(resolveAlias(i.name))},`),
    '} as unknown as Rules',
    '',
  ].join('\n')

  await fs.writeFile(join(ruleDir, `index.ts`), index, 'utf-8')
}

async function updateExports(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  const pkgJson = JSON.parse(await fs.readFile(join(pkg.path, 'package.json'), 'utf-8'))
  pkgJson.exports = {
    '.': {
      types: './dts/index.d.ts',
      require: './dist/index.js',
      default: './dist/index.js',
    },
    './define-config-support': {
      types: './dts/define-config-support.d.ts',
    },
    './rule-options': {
      types: './dts/rule-options.d.ts',
    },
    ...Object.fromEntries(
      pkg.rules.map(i => [`./rules/${i.name}`, `./dist/${i.name}.js`]),
    ),
  }
  await fs.writeFile(join(pkg.path, 'package.json'), `${JSON.stringify(pkgJson, null, 2)}\n`, 'utf-8')
}

async function writeREADME(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  const description = (i: RuleInfo) => {
    const desc = i.meta?.docs?.description || ''

    if (i.name !== resolveAlias(i.name))
      return `${desc}. Alias of \`${resolveAlias(i.name)}\`.`

    return desc
  }

  const lines = [
    '<!--',
    header.trim(),
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

async function generateConfigs(pkg: PackageInfo) {
  if (!pkg.rules.length)
    return

  if (['js', 'ts', 'jsx'].includes(pkg.shortId)) {
    await fs.ensureDir(join(pkg.path, 'configs'))

    const disabledRules = Object.fromEntries(pkg.rules.map(i => [i.originalId, 0] as const))

    await fs.writeFile(
      join(pkg.path, 'configs', 'disable-legacy.ts'),
      [
        header,
        'import type { Linter } from \'eslint\'',
        `const config: Linter.Config = ${JSON.stringify({ rules: disabledRules }, null, 2)}`,
        'export default config',
        '',
      ].join('\n'),
      'utf-8',
    )
  }
}

function camelCase(str: string) {
  return str
    .replace(/[^\w-]+/, '')
    .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function resolveAlias(name: string): string {
  if (aliases[name])
    return aliases[name]
  return name
}

const RULES_DIR = './packages/eslint-plugin/rules/'
const PACKAGES = [
  'ts',
  'js',
  'jsx',
  'plus',
]

const ruleDirs = await fg('*', {
  cwd: RULES_DIR,
  onlyDirectories: true,
  absolute: true,
})

const rulesMeta = await Promise.all(ruleDirs.map(async (path) => {
  const name = basename(path)

  const packages = PACKAGES.filter(pkg => existsSync(join(path, `${name}._${pkg}_.ts`)))

  return {
    path,
    name,
    packages,
  }
}))

function createPackageInfo(
  name: string,
  rules: typeof rulesMeta,
): PackageInfo {
  const pkgId = name
    ? `@stylistic/eslint-plugin-${name}`
    : '@stylistic/eslint-plugin'
  const shortId = name || 'default'
  const path = `packages/eslint-plugin${name ? `-${name}` : ''}`

  return {
    name: pkgId,
    shortId,
    pkgId,
    path,
    rules: rules
      .map(i => ({
        name: i.name,
        ruleId: name ? `${pkgId}/${i.name}` : i.name,
        entry: join(RULES_DIR, i.name, name ? `${i.name}._${shortId}_.ts` : 'index.ts'),
        docsEntry: join(RULES_DIR, i.name, name ? `README._${shortId}_.md` : 'README.md'),
      })),
  }
}

const mainPackage = createPackageInfo('', rulesMeta)
const subPackages = PACKAGES.map(pkg => createPackageInfo(pkg, rulesMeta.filter(i => i.packages.includes(pkg))))
const packages = [
  mainPackage,
  ...subPackages,
]

for (const pkg of subPackages) {
  await writeRulesIndex(pkg)
  await writeREADME(pkg)
  await updateExports(pkg)
  await generateConfigs(pkg)
}

console.log(packages)
