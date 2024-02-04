import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default defineConfig({
  ...viteConfig,
  test: {
    root: './tests',
    globals: true,
    reporters: 'dot',
    testTimeout: 10000000,
  },
})
