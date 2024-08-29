// @ts-check

import { basename, dirname, join } from 'node:path'
import fs from 'node:fs'
import alias from '@rollup/plugin-alias'
import { defineConfig } from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import fg from 'fast-glob'
import resolve from '@rollup/plugin-node-resolve'
import dts from 'rollup-plugin-dts'
import { aliasVirtual } from './alias.mjs'

export function aliasPlugin() {
  return alias({
    customResolver: (source) => {
      if (!source.endsWith('.ts'))
        return `${source}.ts`
    },
    entries: aliasVirtual,
  })
}

/**
 * @param {string} cwd
 */
export function createConfig(cwd) {
  const pkg = JSON.parse(fs.readFileSync(join(cwd, 'package.json'), 'utf-8'))

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
      input: [
        'src/index.ts',
        ...rulesEntry,
      ],
      output: [
        {
          dir: 'dist',
          format: 'cjs',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // eslint-disable-next-line no-console
              console.log('vendor', id)
              return 'vendor'
            }
            if (id.includes('util'))
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
        commonjs(),
        esbuild(),
        resolve(),
        aliasPlugin(),
      ],
      external: [
        ...[
          'eslint',
          ...Object.keys(pkg.dependencies || []),
          ...Object.keys(pkg.peerDependencies || []),
        ].flatMap(dep => [
          dep,
          new RegExp(`^${dep}/`),
        ]),
        'node:process',
      ],
    },
    {
      input: [
        './dts/index.d.ts',
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
        {
          name: 'strip-comments',
          renderChunk(code) {
            return code
              .replace(/\/\* .*? \*\//g, '')
              .replace(/\n{3,}/g, '\n\n')
          },
        },
      ],
      external: [
        ...Object.keys(pkg.dependencies || []),
        ...Object.keys(pkg.peerDependencies || []),
      ],
    },
  ])
}
