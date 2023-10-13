import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@stylistic/eslint-plugin-js': fileURLToPath(new URL('./packages/eslint-plugin-js/src/index.js', import.meta.url)),
      '@stylistic/eslint-plugin-ts': fileURLToPath(new URL('./packages/eslint-plugin-ts/src/index.ts', import.meta.url)),
    },
  },
  test: {
    globals: true,
    reporters: 'dot',
  },
})
