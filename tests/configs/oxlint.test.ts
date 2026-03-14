import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import { promises as fsp } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import plugin from '@stylistic/eslint-plugin'
import { execa } from 'execa'
import { afterAll, beforeAll, it } from 'vitest'
import { runFixtureTest } from '../_utils'

const fixturesDir = fileURLToPath(new URL('fixtures', import.meta.url))
const targetDir = '_fixtures_oxlint'

const MAX_FIX_PASSES = 5

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

function runWithConfig(name: string, configs: StylisticCustomizeOptions | string) {
  it.concurrent(name, async ({ expect }) => {
    const from = resolve(fixturesDir, 'input')
    const output = resolve(fixturesDir, 'output_oxlint', name)
    const target = resolve(targetDir, name)

    const rules = typeof configs === 'string'
      ? plugin.configs[configs as Exclude<keyof typeof plugin.configs, 'customize'>]?.rules
      : plugin.configs.customize(configs)?.rules

    await runFixtureTest(expect, {
      from,
      output,
      target,
      ignoreFiles: ['.oxlintrc.json'],
      copyFilter: src => !src.endsWith('.vue'),
      configWriter: async (target) => {
        await fsp.writeFile(join(target, '.oxlintrc.json'), JSON.stringify({
          plugins: [],
          categories: {
            correctness: 'off',
            nursery: 'off',
            pedantic: 'off',
            perf: 'off',
            restriction: 'off',
            style: 'off',
            suspicious: 'off',
          },
          jsPlugins: ['@stylistic/eslint-plugin'],
          rules,
        }, null, 2))
      },
      lintRunner: async (target) => {
        for (let i = 0; i < MAX_FIX_PASSES; i++) {
          const { stdout } = await execa('npx', ['oxlint', '--fix'], {
            cwd: target,
            stdio: 'pipe',
            reject: false,
          })
          if (stdout.includes('0 fixed'))
            break
        }
      },
    })
  }, 30_000)
}
