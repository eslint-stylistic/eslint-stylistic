import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { Linter } from 'eslint'
import { promises as fsp } from 'node:fs'
import { join, resolve } from 'node:path'
import { execa } from 'execa'
import { afterAll, beforeAll, it } from 'vitest'
import { fixturesDir, runFixtureTest } from './_utils'

const targetDir = '_fixtures_eslint'

beforeAll(async () => {
  await fsp.rm(targetDir, { recursive: true, force: true })
})
afterAll(async () => {
  await fsp.rm(targetDir, { recursive: true, force: true })
})

runWithConfig('default', {})
runWithConfig('tab-quotes-semi', {
  indent: 'tab',
  quotes: 'double',
  semi: true,
})

runWithConfig('all', 'all')

function runWithConfig(name: string, configs: StylisticCustomizeOptions | string, ...items: Linter[]) {
  it.concurrent(name, async ({ expect }) => {
    const from = resolve(fixturesDir, 'input')
    const output = resolve(fixturesDir, 'output', name)
    const target = resolve(targetDir, name)

    await runFixtureTest(expect, {
      from,
      output,
      target,
      ignoreFiles: ['eslint.config.js'],
      configWriter: async (target) => {
        await fsp.writeFile(join(target, 'eslint.config.js'), `
// @eslint-disable
import stylistic from '@stylistic/eslint-plugin'
import parserTs from '@typescript-eslint/parser'
import parserVue from 'vue-eslint-parser'

export default [
  {
    files: ['**/*.?([cm])js'],
  },
  {
    files: ['**/*.?([cm])jsx', '**/*.?([cm])tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    }
  },
  {
    files: ['**/*.?([cm])ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        sourceType: 'module',
      }
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: ['.vue'],
        parser: parserTs,
        sourceType: 'module',
      },
    }
  },
  ${
    typeof configs === 'string'
      ? `stylistic.configs['${configs}']`
      : `stylistic.configs.customize(${JSON.stringify(configs)})`
  },
  ...${JSON.stringify(items) ?? []},
  ]
  `)
      },
      lintRunner: async (target) => {
        await execa('npx', ['eslint', '.', '--fix'], {
          cwd: target,
          stdio: 'pipe',
        })
      },
    })
  }, 30_000)
}
