import fs from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import resolve from '@rollup/plugin-node-resolve'
import { aliasPlugin } from '../../rollup.config.base.mts'

const pkg = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      manualChunks(id) {
        if (id.includes('utils'))
          return 'utils'
        if (id.includes('configs'))
          return 'configs'
        if (id.includes('rules')) {
          const name = basename(dirname(id)).replace(/\._\w+_$/, '')
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
    resolve(),
    aliasPlugin(),
  ],
  external: [
    ...Object.keys(pkg.dependencies || []),
    ...Object.keys(pkg.peerDependencies || []),
  ],
})
