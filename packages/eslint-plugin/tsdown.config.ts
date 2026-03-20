import { basename, dirname } from 'node:path'
import { env } from 'node:process'
import { codecovRollupPlugin } from '@codecov/rollup-plugin'
import fg from 'fast-glob'
import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const rulesEntry = fg.sync(
  'rules/**/*.ts',
  {
    onlyFiles: true,
    ignore: [
      'rules/index.ts',
      '**/*._*_.ts',
      '**/*.d.ts',
      '**/*.test.ts',
    ],
  },
)

export default defineConfig([
  {
    entry: './src/index.ts',
    dts: false,
    hash: false,
    minify: 'dce-only',
    fixedExtension: false,
    exports: {
      customExports: exports => ({
        ...exports,
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
        './rules/*': './dist/rules/*',
      }),
    },
    deps: {
      onlyBundle: [
        // https://github.com/eslint-stylistic/eslint-stylistic/pull/838
        '@typescript-eslint/utils',
        'escape-string-regexp',
      ],
    },
    outputOptions: {
      comments: false,
      codeSplitting: {
        groups: [
          {
            name: 'vendor',
            test: /node_modules/,
          },
          {
            name: 'utils',
            test: /utils/,
          },
          ...rulesEntry.map(file => ({
            name: `rules/${basename(dirname(file))}`,
            test: new RegExp(`rules[\\/]${basename(dirname(file))}[\\/]`),
          })),
          {
            name: 'configs',
            test: /configs/,
          },
        ],
      },
    },
    plugins: [
      codecovRollupPlugin({
        enableBundleAnalysis: env.CODECOV_TOKEN !== undefined,
        bundleName: pkg.name,
        uploadToken: env.CODECOV_TOKEN,
        gitService: 'github',
      }),
    ],
  },
  {
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
