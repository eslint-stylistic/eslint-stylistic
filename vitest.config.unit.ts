import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    root: './packages',
    globals: true,
    reporters: 'dot',
    coverage: {
      cleanOnRerun: false,
      include: ['**/rules/**'],
      exclude: [
        '**/rules/index.ts',
        '**/fixtures/**',
        '**/*.d.ts',
        '**?*.test.*',
      ],
    },
  },
})
