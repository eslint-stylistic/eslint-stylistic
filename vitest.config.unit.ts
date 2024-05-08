import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    reporters: 'dot',
    coverage: {
      cleanOnRerun: false,
      include: ['**/rules/**', '**/internal-rules/**'],
      exclude: [
        '**/rules/index.ts',
        '**/fixtures/**',
        '**/*.d.ts',
        '**?*.test.*',
      ],
    },
  },
})
