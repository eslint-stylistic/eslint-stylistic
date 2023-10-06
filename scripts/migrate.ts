/**
 * This script migrates rules from the ESLint and typescript-eslint to this repo.
 *
 * You need to
 *
 * ```sh
 * git clone https://github.com/eslint/eslint ../eslint
 * git clone https://github.com/typescript-eslint/typescript-eslint ../typescript-eslint
 * ```
 *
 * And then run this script:
 *
 * ```sh
 * esno scripts/migrate.ts
 * pnpm run lint --fix
 * ```
 */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, join } from 'node:path'
import fs from 'fs-extra'
import fg from 'fast-glob'

// Rules that are common in both ESLint and typescript-eslint (TS overrides them)
const commonRules = [
  'block-spacing',
  'brace-style',
  'comma-spacing',
  'func-call-spacing',
  'indent',
  'key-spacing',
  'keyword-spacing',
  'lines-around-comment',
  'lines-between-class-members',
  'object-curly-spacing',
  'padding-line-between-statements',
  'space-before-blocks',
  'space-before-function-paren',
  'space-infix-ops',
  'comma-dangle',
  'quotes',
  'semi',
]

// based on https://github.com/eslint/eslint/issues/17522#issuecomment-1712158461
const jsRules = [
  ...commonRules,
  'array-bracket-newline',
  'array-bracket-spacing',
  'array-element-newline',
  'arrow-spacing',
  'comma-style',
  'computed-property-spacing',
  'dot-location',
  'eol-last',
  'function-call-argument-newline',
  'function-paren-newline',
  'generator-star-spacing',
  'implicit-arrow-linebreak',
  'jsx-quotes',
  'linebreak-style',
  'lines-around-directive',
  'max-len',
  'max-statements-per-line',
  'multiline-ternary',
  'new-parens',
  'newline-after-var',
  'newline-before-return',
  'newline-per-chained-call',
  'no-confusing-arrow',
  'no-extra-parens',
  'no-extra-semi',
  'no-floating-decimal',
  'no-mixed-operators',
  'no-mixed-spaces-and-tabs',
  'no-multi-spaces',
  'no-multiple-empty-lines',
  'no-spaced-func',
  'no-tabs',
  'no-trailing-spaces',
  'no-whitespace-before-property',
  'nonblock-statement-body-position',
  'object-curly-newline',
  'object-property-newline',
  'one-var-declaration-per-line',
  'operator-linebreak',
  'padded-blocks',
  'quote-props',
  'rest-spread-spacing',
  'semi-spacing',
  'semi-style',
  'space-in-parens',
  'space-unary-ops',
  'spaced-comment',
  'switch-colon-spacing',
  'template-curly-spacing',
  'template-tag-spacing',
  'wrap-iife',
  'wrap-regex',
  'yield-star-spacing',
]

// Wait for the official deprecation list
// Currently listing the rules that marked as 'type: layout' in the TypeScript ESLint repo
const tsRules = [
  ...commonRules,
  'member-delimiter-style',
  'type-annotation-spacing',
]

async function migrateJS() {
  const root = fileURLToPath(new URL('../../eslint', import.meta.url))
  const target = fileURLToPath(new URL('../packages/eslint-plugin-js/rules', import.meta.url))

  if (!existsSync(root))
    throw new Error(`ESLint repo ${root} does not exist`)

  const rules = await fg('lib/rules/*.js', {
    cwd: root,
    onlyFiles: true,
    absolute: true,
  })

  await Promise.all(
    rules.map(async (rule) => {
      const name = basename(rule, '.js')
      if (!jsRules.includes(name))
        return

      console.log(`Migrating ${name}`)
      await fs.mkdir(join(target, name), { recursive: true })

      let js = await fs.readFile(rule, 'utf-8')
      js = js
        .replaceAll(
          'require("./utils/ast-utils")',
          'require("../../utils/ast-utils")',
        )
        .replaceAll(
          'https://eslint.org/docs/latest/rules/',
          'https://eslint.style/rules/js/',
        )
        .replaceAll(
          'import(\'../shared/types\').Rule',
          'import(\'eslint\').Rule.RuleModule',
        )
        .replaceAll(
          '../shared/string-utils',
          '../../utils/string-utils',
        )
        .replaceAll(
          'require("./utils/keywords")',
          'require("../../utils/keywords")',
        )
      // js = `// @ts-check\n${js}`
      await fs.writeFile(join(target, name, `${name}.js`), js, 'utf-8')

      const md = await fs.readFile(join(root, 'docs/src/rules', `${name}.md`), 'utf-8')
      await fs.writeFile(join(target, name, 'README.md'), md, 'utf-8')

      let test = await fs.readFile(join(root, 'tests/lib/rules', `${name}.js`), 'utf-8')
      test = test
        .replaceAll(
          'require("../../../lib/rule-tester")',
          'require("eslint")',
        )
        .replaceAll(
          'require("../../../lib/rules/',
          'require("./',
        )
        .replaceAll(
          '../../fixtures/rules/indent',
          './fixtures',
        )
        .replaceAll(
          'require("../../_utils")',
          'require("../../utils/test-utils")',
        )
        .replaceAll(
          'require("./utils/keywords")',
          'require("../../utils/keywords")',
        )
      await fs.writeFile(join(target, name, `${name}.test.js`), test, 'utf-8')
    }),
  )
}

async function migrateTS() {
  const root = fileURLToPath(new URL('../../typescript-eslint', import.meta.url))
  const targetRoot = fileURLToPath(new URL('../packages/eslint-plugin-ts', import.meta.url))
  const target = join(targetRoot, 'rules')

  if (!existsSync(root))
    throw new Error(`ESLint repo ${root} does not exist`)

  // await fs.copy(join(root, 'packages/eslint-plugin/src/util'), join(targetRoot, 'util'), { overwrite: true })

  const rules = await fg('packages/eslint-plugin/src/rules/*.ts', {
    cwd: root,
    onlyFiles: true,
    absolute: true,
  })

  const filteredRules = rules.filter((rule) => {
    const name = basename(rule, '.ts')
    return (tsRules.includes(name))
  })

  await Promise.all(
    filteredRules.map(async (rule) => {
      const name = basename(rule, '.ts')

      console.log(`Migrating ${name}`)
      await fs.mkdir(join(target, name), { recursive: true })

      let js = await fs.readFile(rule, 'utf-8')
      const utils: string[] = []
      js = js
        .replaceAll(
          '\'../util',
          '\'../../util',
        )
        // find all `util.xxx` and collect them
        .replaceAll(/util\.(\w+)/g, (_, name) => {
          utils.push(name)
          return name
        })
        // rewrite namespace import to named import
        .replace(
          'import * as util from \'../../util\'',
          `import { ${utils.join(', ')} } from '../../util'`,
        )
        .replace(
          /eslint-disable-next-line eslint-plugin\/.*/g,
          '',
        )
        .replaceAll(
          'eslint-disable-next-line deprecation/deprecation',
          '',
        )
        .replaceAll(
          ' @typescript-eslint/',
          ' ts/',
        )
      // js = `// @ts-check\n${js}`
      await fs.writeFile(join(target, name, `${name}.ts`), js, 'utf-8')

      const md = await fs.readFile(join(root, 'packages/eslint-plugin/docs/rules', `${name}.md`), 'utf-8')
      await fs.writeFile(join(target, name, 'README.md'), md, 'utf-8')

      const testPath = join(root, 'packages/eslint-plugin/tests/rules', `${name}.test.ts`)
      if (existsSync(testPath)) {
        let test = await fs.readFile(testPath, 'utf-8')
        test = test
          .replaceAll(
            '\'../../src/rules/',
            '\'./',
          )
          .replaceAll(
            '\'../../src/util',
            '\'../../util',
          )
          .replaceAll(
            'eslint "@typescript-eslint/internal',
            '',
          )
          .replaceAll(
            './indent/utils',
            '../indent/utils',
          )
        await fs.writeFile(join(target, name, `${name}.test.ts`), test, 'utf-8')
      }
    }),
  )

  const ruleTypes = filteredRules.map((rule) => {
    const name = basename(rule, '.ts')
    return `'@stylistic/ts/${name}': []`
  }, '')

  await fs.writeFile(
    join(targetRoot, 'src', 'eslint-define-config-support.d.ts'),
    `declare module 'eslint-define-config' {
  export interface CustomRuleOptions {
    ${ruleTypes.join('\n    ')}
  }
}

export {}
`,
    'utf-8',
  )
}

;(async () => {
  await migrateTS()
  await migrateJS()
})()
