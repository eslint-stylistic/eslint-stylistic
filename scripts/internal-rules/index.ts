import type { Linter } from 'eslint'
import indentUnindent from './indent-unindent'

export const plugin = {
  rules: {
    'indent-unindent': indentUnindent,
  },
}

export function config(): Linter.FlatConfig[] {
  return [
    {
      name: 'internal/setup',
      plugins: {
        internal: plugin as any,
      },
    },
    {
      name: 'internal/tests',
      files: ['**/*.test.ts'],
      rules: {
        'internal/indent-unindent': 'error',
      },
    },
  ]
}
