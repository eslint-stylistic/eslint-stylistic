import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@stylistic/eslint-plugin': fileURLToPath(new URL('./packages/eslint-plugin/src/index.ts', import.meta.url)),
      '@stylistic/eslint-plugin-js': fileURLToPath(new URL('./packages/eslint-plugin-js/src/index.js', import.meta.url)),
      '@stylistic/eslint-plugin-jsx': fileURLToPath(new URL('./packages/eslint-plugin-jsx/src/index.js', import.meta.url)),
      '@stylistic/eslint-plugin-ts': fileURLToPath(new URL('./packages/eslint-plugin-ts/src/index.ts', import.meta.url)),
      '@eslint-stylistic/metadata': fileURLToPath(new URL('./packages/metadata/src/index.ts', import.meta.url)),
    },
  },
  test: {
    globals: true,
    reporters: 'dot',
  },
})
