import fs from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'

const pkg = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig({
  input: 'src/index.js',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      manualChunks(id) {
        if (id.includes('utils'))
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
    commonjs(),
  ],
  external: [
    ...Object.keys(pkg.dependencies || []),
    ...Object.keys(pkg.peerDependencies || []),
    'node:process',
  ],
})
