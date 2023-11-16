import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    root: './packages',
    globals: true,
    reporters: 'dot',
  },
})
