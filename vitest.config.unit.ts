import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default defineConfig({
  ...viteConfig,
  test: {
    root: './packages',
    globals: true,
    reporters: 'dot',
    coverage: {
      cleanOnRerun: false,
      include: ['**/rules/**'],
      exclude: [
        '**/rules/index.ts',
        '**/rules/*/index.ts',
        '**/fixtures/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/*.test.*',
      ],
    },
  },
})
