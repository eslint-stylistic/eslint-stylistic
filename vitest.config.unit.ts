import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    root: './packages',
    globals: true,
    reporters: 'dot',
    coverage: {
      cleanOnRerun: false,
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/dts/**',
        '**/test-utils/**',
        '**/*.test.*',
        '**/*.d.ts',
        '**/types.ts',
        '**/src/index.ts',
        '**/src/plugin.ts',
        '**/rules/index.ts',
        '**/fixtures/**',
        '**/configs/**',
        '**/metadata/**',
      ],
    },
  },
})
