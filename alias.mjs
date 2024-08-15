import { fileURLToPath } from 'node:url'

export const aliasVirtual = {
  '#test': fileURLToPath(new URL('./packages/shared/test-utils', import.meta.url)),
  '#types': fileURLToPath(new URL('./packages/shared/types', import.meta.url)),
  '#utils': fileURLToPath(new URL('./packages/shared/utils', import.meta.url)),
}

export const alias = {
  '@stylistic/eslint-plugin': fileURLToPath(new URL('./packages/eslint-plugin/src/index.ts', import.meta.url)),
  '@stylistic/eslint-plugin-js': fileURLToPath(new URL('./packages/eslint-plugin-js/src/index.ts', import.meta.url)),
  '@stylistic/eslint-plugin-jsx': fileURLToPath(new URL('./packages/eslint-plugin-jsx/src/index.ts', import.meta.url)),
  '@stylistic/eslint-plugin-ts': fileURLToPath(new URL('./packages/eslint-plugin-ts/src/index.ts', import.meta.url)),
  '@stylistic/eslint-plugin-plus': fileURLToPath(new URL('./packages/eslint-plugin-plus/src/index.ts', import.meta.url)),
  '@eslint-stylistic/metadata': fileURLToPath(new URL('./packages/metadata/src/index.ts', import.meta.url)),
  ...aliasVirtual,
}
