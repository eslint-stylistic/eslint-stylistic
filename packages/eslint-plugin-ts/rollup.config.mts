import fs from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

const pkg = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      manualChunks(id) {
        if (id.includes('util'))
          return 'utils'
        if (id.includes('rules')) {
          const name = basename(dirname(id))
          if (name !== 'rules')
            return name
        }
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
})
