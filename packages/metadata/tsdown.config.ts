import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'cjs',
  exports: true,
  dts: true,
})
