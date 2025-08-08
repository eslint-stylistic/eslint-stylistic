import { fileURLToPath } from 'node:url'

export const aliasVirtual = {
  '#test': fileURLToPath(new URL('./shared/test-utils', import.meta.url)),
  '#types': fileURLToPath(new URL('./shared/types', import.meta.url)),
  '#utils': fileURLToPath(new URL('./shared/utils', import.meta.url)),
}

export const alias = {
  '@stylistic/eslint-plugin': fileURLToPath(new URL('./packages/eslint-plugin/src/index.ts', import.meta.url)),
  '@eslint-stylistic/metadata': fileURLToPath(new URL('./packages/metadata/src/index.ts', import.meta.url)),
  ...aliasVirtual,
}
