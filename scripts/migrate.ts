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
import { pascalCase } from 'change-case'
import fs from 'fs-extra'
import fg from 'fast-glob'
import type { JSONSchema4 } from 'json-schema'
import { compile } from 'json-schema-to-typescript'

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

// Manually picked
const jsxRules = [
  'jsx-child-element-spacing',
  'jsx-closing-bracket-location',
  'jsx-closing-tag-location',
  'jsx-curly-brace-presence',
  'jsx-curly-newline',
  'jsx-curly-spacing',
  'jsx-equals-spacing',
  'jsx-first-prop-new-line',
  'jsx-indent-props',
  'jsx-indent',
  'jsx-max-props-per-line',
  'jsx-newline',
  'jsx-one-expression-per-line',
  'jsx-props-no-multi-spaces',
  // 'jsx-props-no-spreading',
  // 'jsx-sort-default-props',
  'jsx-sort-props',
  'jsx-tag-spacing',
  'jsx-wrap-multilines',
]

async function migrateJS() {
  const root = fileURLToPath(new URL('../../eslint', import.meta.url))
  const targetRoot = fileURLToPath(new URL('../packages/eslint-plugin-js', import.meta.url))
  const target = join(targetRoot, 'rules')

  if (!existsSync(root))
    throw new Error(`ESLint repo ${root} does not exist`)

  const rules = await fg('lib/rules/*.js', {
    cwd: root,
    onlyFiles: true,
    absolute: true,
  })

  const filteredRules = rules.filter((rule) => {
    const name = basename(rule, '.js')
    return (jsRules.includes(name))
  })

  // Copy over the js file
  await Promise.all(
    filteredRules.map(async (rule) => {
      const name = basename(rule, '.js')

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

  // Write types.d.ts files for eslint-define-config support
  await generateDTS('@stylistic/js', filteredRules, root, target, targetRoot)
}

async function generateDTS(
  prefix: string,
  rules: string[],
  root: string,
  target: string,
  targetRoot: string,
  rulesPath = ['lib', 'rules'],
) {
  await Promise.all(rules.map(async (rule) => {
    const name = basename(rule).replace(/\.\w+$/, '')
    const module = await import(join(root, ...rulesPath, `${name}`))
    const meta = module.default.meta

    let schemas = meta.schema as JSONSchema4[] ?? []

    if (!Array.isArray(schemas))
      schemas = [schemas]

    const options = await Promise.all(schemas.map(async (schema, index) => {
      schema = JSON.parse(JSON.stringify(schema).replace(/\#\/items\/0\/\$defs\//g, '#/$defs/'))

      try {
        return await compile(schema, `Schema${index}`, {
          bannerComment: '',
          style: {
            semi: false,
            singleQuote: true,
          },
        })
      }
      catch (error) {
        console.warn(`Failed to compile schema Schema${index} for rule ${name}. Falling back to unknown.`)
        return `export type Schema${index} = unknown\n`
      }
    }))

    await fs.writeFile(
      join(target, name, 'types.d.ts'),
`${options.join('\n')}
export type RuleOptions = [${options.map((_, index) => `Schema${index}?`).join(', ')}]
`,
'utf-8',
    )
  }))

  // Write eslint-define-config support file
  const ruleOptionsImports = rules.map((rule) => {
    const name = basename(rule).replace(/\.\w+$/, '')
    return `import type { RuleOptions as ${pascalCase(name)}RuleOptions } from '../rules/${name}/types'`
  })

  await fs.writeFile(
    join(targetRoot, 'dts', 'rule-options.d.ts'),
`${ruleOptionsImports.join('\n')}

export interface RuleOptions {
  ${rules.map((rule) => {
const name = basename(rule).replace(/\.\w+$/, '')
return `'${prefix}/${name}': ${pascalCase(name)}RuleOptions`
}).join('\n    ')}
}

export interface UnprefixedRuleOptions {
  ${rules.map((rule) => {
const name = basename(rule).replace(/\.\w+$/, '')
return `'${name}': ${pascalCase(name)}RuleOptions`
}).join('\n    ')}
}
`,
'utf-8',
  )

  await fs.writeFile(
    join(targetRoot, 'dts', 'define-config-support.d.ts'),
`import type { RuleOptions } from './rule-options'

declare module 'eslint-define-config' {
  export interface CustomRuleOptions extends RuleOptions {}
}

export {}
`,
'utf-8',
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

  // Copy over the js file
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

  // Write types.d.ts files for eslint-define-config support
  await generateDTS(
    '@stylistic/ts',
    filteredRules,
    root,
    target,
    targetRoot,
    ['packages', 'eslint-plugin', 'src', 'rules'],
  )
}

async function migrateJSX() {
  const root = fileURLToPath(new URL('../../eslint-plugin-react', import.meta.url))
  const target = fileURLToPath(new URL('../packages/eslint-plugin-jsx/rules', import.meta.url))
  const targetRoot = fileURLToPath(new URL('../packages/eslint-plugin-jsx', import.meta.url))

  if (!existsSync(root))
    throw new Error(`eslint-plugin-react repo ${root} does not exist`)

  const rules = await fg('lib/rules/*.js', {
    cwd: root,
    onlyFiles: true,
    absolute: true,
  })

  const filteredRules = rules.filter((rule) => {
    const name = basename(rule, '.js')
    return (jsxRules.includes(name))
  })

  await Promise.all(
    filteredRules.map(async (rule) => {
      const name = basename(rule, '.js')
      if (!jsxRules.includes(name))
        return

      console.log(`Migrating ${name}`)
      await fs.mkdir(join(target, name), { recursive: true })

      let js = await fs.readFile(rule, 'utf-8')
      js = js
        .replaceAll(
          'require(\'../util',
          'require(\'../../util',
        )
        .replaceAll(
          'require(\'object.hasown/polyfill\')()',
          `(obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)`,
        )
        .replaceAll(
          'require(\'array-includes\')',
          '(arr, value) => arr.includes(value)',
        )
        .replaceAll(
          'require(\'array.prototype.tosorted\')',
          '(arr, compareFn) => [...arr].sort(compareFn)',
        )
        .replaceAll(
          'require(\'string.prototype.matchall\')',
          '(s, v) => s.matchAll(v)',
        )
      // js = `// @ts-check\n${js}`
      await fs.writeFile(join(target, name, `${name}.js`), js, 'utf-8')

      const docsUrl = join(root, 'docs/rules', `${name}.md`)
      if (fs.existsSync(docsUrl)) {
        let md = await fs.readFile(docsUrl, 'utf-8')
        md = md.replaceAll(
          'react/jsx-',
          '@stylistic/jsx/jsx-',
        )
        await fs.writeFile(join(target, name, 'README.md'), md, 'utf-8')
      }

      let test = await fs.readFile(join(root, 'tests/lib/rules', `${name}.js`), 'utf-8')
      test = test
        .replaceAll(
          'require(\'../../../lib/rules',
          'require(\'.',
        )
        .replaceAll(
          'require(\'../../helpers',
          'require(\'../../tests/helpers',
        )
      await fs.writeFile(join(target, name, `${name}.test.js`), test, 'utf-8')
    }),
  )

  // Write types.d.ts files for eslint-define-config support
  await generateDTS('@stylistic/jsx', filteredRules, root, target, targetRoot)
}

;(async () => {
  await migrateTS()
  await migrateJS()
  await migrateJSX()
})()
