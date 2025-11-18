import { readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { env } from 'node:process'
import { codecovRollupPlugin } from '@codecov/rollup-plugin'
import fg from 'fast-glob'
import { defineConfig } from 'tsdown'

export function createConfig(cwd: string) {
  const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'))

  const rulesEntry = fg.sync(
    'rules/**/*.ts',
    {
      cwd,
      onlyFiles: true,
      ignore: [
        'rules/index.ts',
        '**/*._*_.ts',
        '**/*.d.ts',
        '**/*.test.ts',
      ],
    },
  )

  return defineConfig([
    {
      cwd,
      entry: './src/index.ts',
      dts: false,
      hash: false,
      minify: 'dce-only',
      fixedExtension: false,
      outputOptions: {
        advancedChunks: {
          groups: [
            {
              name: 'vendor',
              test: 'node_modules',
            },
            {
              name: 'utils',
              test: 'utils',
            },
            ...rulesEntry.map(file => ({
              name: `rules/${basename(dirname(file))}`,
              test: new RegExp(`rules[\\/]${basename(dirname(file))}[\\/]`),
            })),
            {
              name: 'configs',
              test: 'configs',
            },
          ],
        },
      },
      plugins: [
        ...pkg.name.includes('metadata')
          ? []
          : [
              codecovRollupPlugin({
                enableBundleAnalysis: env.CODECOV_TOKEN !== undefined,
                bundleName: pkg.name,
                uploadToken: env.CODECOV_TOKEN,
                gitService: 'github',
              }),
            ],
      ],
    },
    {
      cwd,
      entry: [
        './dts/index.d.ts',
        './dts/define-config-support.d.ts',
        './dts/rule-options.d.ts',
      ],
      tsconfig: 'tsconfig.dts.json',
      dts: {
        dtsInput: true,
      },
      hash: false,
      outDir: 'dist/dts',
      plugins: [
        {
          name: 'strip-comments',
          renderChunk(code) {
            return code
              .replace(/\/\* .*? \*\//g, '')
              .replace(/\n{3,}/g, '\n\n')
          },
        },
      ],
    },
  ])
}
