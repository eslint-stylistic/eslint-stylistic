import fs from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { aliasPlugin } from '../../rollup.config.base.mts'

const pkg = JSON.parse(await fs.readFile(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig([
  {
    input: [
      'src/index.ts',
    ],
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        manualChunks(id) {
          if (id.includes('rules')) {
            const name = basename(dirname(id))
            if (name !== 'rules')
              return name
          }
          if (id.includes('configs'))
            return 'configs'
        },
        chunkFileNames: '[name].js',
      },
    ],
    plugins: [
      esbuild(),
      commonjs(),
      aliasPlugin(),
    ],
    external: [
      ...Object.keys(pkg.dependencies || []),
      ...Object.keys(pkg.peerDependencies || []),
      'eslint/package.json',
      '@typescript-eslint/utils/ast-utils',
    ],
  },
  {
    input: [
      './dts/index.ts',
      './dts/define-config-support.d.ts',
      './dts/rule-options.d.ts',
    ],
    output: {
      dir: 'dist',
      format: 'es',
    },
    plugins: [
      dts({
        respectExternal: true,
        tsconfig: 'tsconfig.dts.json',
      }),
    ],
    external: [
      ...Object.keys(pkg.dependencies || []),
      ...Object.keys(pkg.peerDependencies || []),
    ],
  },
])
