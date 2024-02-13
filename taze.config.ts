import { defineConfig } from 'taze'

export default defineConfig({
  exclude: [
    // v5 is ESM only
    'escape-string-regexp',
    // v10 breaks v18, we need to wait for ESLint v9
    'espree',
  ],
})
