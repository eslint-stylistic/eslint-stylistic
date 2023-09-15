import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import { basename, join } from 'node:path'
import fg from 'fast-glob'

const root = fileURLToPath(new URL('../../eslint', import.meta.url))
const target = fileURLToPath(new URL('../packages/eslint-plugin-stylistic-js/rules', import.meta.url))

// based on https://github.com/eslint/eslint/issues/17522#issuecomment-1712158461
const names = [
  'array-bracket-newline',
  'array-bracket-spacing',
  'array-element-newline',
  'arrow-spacing',
  'block-spacing',
  'comma-spacing',
  'computed-property-spacing',
  'func-call-spacing',
  'function-call-argument-newline',
  'function-paren-newline',
  'generator-star-spacing',
  'implicit-arrow-linebreak',
  'indent',
  // 'indent-legacy',
  'key-spacing',
  'keyword-spacing',
  'linebreak-style',
  'lines-around-comment',
  'lines-around-directive',
  'lines-between-class-members',
  'multiline-ternary',
  'newline-after-var',
  'newline-before-return',
  'newline-per-chained-call',
  'no-mixed-spaces-and-tabs',
  'no-multiple-empty-lines',
  'no-multi-spaces',
  'no-spaced-func',
  'no-trailing-spaces',
  'no-whitespace-before-property',
  'object-curly-newline',
  'object-curly-spacing',
  'object-property-newline',
  'operator-linebreak',
  'padded-blocks',
  'padding-line-between-statements',
  'rest-spread-spacing',
  'semi-spacing',
  'space-before-blocks',
  'space-before-function-paren',
  'spaced-comment',
  'space-infix-ops',
  'space-in-parens',
  'space-unary-ops',
  'switch-colon-spacing',
  'template-curly-spacing',
  'template-tag-spacing',
  'yield-star-spacing',
]

async function run() {
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
      if (!names.includes(name))
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

run()
