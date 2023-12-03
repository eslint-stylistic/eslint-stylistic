import { defineConfig } from 'taze'

export default defineConfig({
  exclude: [
    // v5 is ESM only
    'escape-string-regexp',
  ],
})
