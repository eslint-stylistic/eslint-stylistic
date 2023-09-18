/**
 * This script migrates rules from the TypeScript ESLint repo to this repo.
 *
 * Before running this script, you need to clone the TypeScript ESLint repo to ../typescript-eslint.
 *
 * ```sh
 * esno scripts/migrate-ts-eslint.ts
 * pnpm run lint --fix
 * ```
 */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { basename, join } from 'node:path'
import fs from 'fs-extra'
import fg from 'fast-glob'

const root = fileURLToPath(new URL('../../typescript-eslint', import.meta.url))
const targetRoot = fileURLToPath(new URL('../packages/eslint-plugin-ts', import.meta.url))
const target = join(targetRoot, 'rules')

// Wait for the official deprecation list
// Currently listing the rules that marked as 'type: layout' in the TypeScript ESLint repo
const names = [
  'block-spacing',
  'brace-style',
  'comma-dangle',
  'comma-spacing',
  'func-call-spacing',
  'indent',
  'key-spacing',
  'keyword-spacing',
  'lines-around-comment',
  'lines-between-class-members',
  'member-delimiter-style',
  'no-extra-parens',
  'padding-line-between-statements',
  'quotes',
  'semi',
  'space-before-blocks',
  'space-before-function-paren',
  'space-infix-ops',
  'type-annotation-spacing',
]

async function run() {
  if (!existsSync(root))
    throw new Error(`ESLint repo ${root} does not exist`)

  await fs.copy(join(root, 'packages/eslint-plugin/src/util'), join(targetRoot, 'util'), { overwrite: true })

  const rules = await fg('packages/eslint-plugin/src/rules/*.ts', {
    cwd: root,
    onlyFiles: true,
    absolute: true,
  })

  await Promise.all(
    rules.map(async (rule) => {
      const name = basename(rule, '.ts')
      if (!names.includes(name))
        return

      console.log(`Migrating ${name}`)
      await fs.mkdir(join(target, name), { recursive: true })

      let js = await fs.readFile(rule, 'utf-8')
      js = js
        .replaceAll(
          '\'../util',
          '\'../../util',
        )
        .replaceAll(
          'eslint-disable-next-line deprecation/deprecation',
          '',
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
}

run()
