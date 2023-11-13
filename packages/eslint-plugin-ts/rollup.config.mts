import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import fg from 'fast-glob'

// import dts from 'rollup-plugin-dts'

const cwd = fileURLToPath(new URL('.', import.meta.url))
const pkg = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf-8'))

const rulesEntry = await fg('rules/**/*.ts', {
  cwd,
  onlyFiles: true,
  ignore: [
    '**/index.ts',
    '**/*.d.ts',
    '**/*.test.ts',
  ],
})

const input = [
  'src/index.ts',
  ...rulesEntry,
]

export default defineConfig([
  {
    input,
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        manualChunks(id) {
          if (id.includes('configs'))
            return 'configs'
          if (id.includes('/utils/'))
            return 'utils'
        },
        chunkFileNames: '[name].js',
      },
    ],
    plugins: [
      esbuild(),
      commonjs(),
    ],
    external: [
      ...Object.keys(pkg.dependencies || []),
      ...Object.keys(pkg.peerDependencies || []),
      'eslint/package.json',
      '@typescript-eslint/utils/ast-utils',
    ],
  },
  // TODO: fix types to enable dts build for sub-packages
  // {
  //   input,
  //   output: [
  //     {
  //       dir: 'dist',
  //     },
  //   ],
  //   plugins: [
  //     dts(),
  //   ],
  // },
])
