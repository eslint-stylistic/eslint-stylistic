// @ts-check
import stylistic from '../stub.mjs';
import tsParser from '@typescript-eslint/parser';

/** @type {import('./playground-types').TypedFlatConfig[]} */
export default [
  {
    plugins: {
      '@stylistic': stylistic,
    },
    files: ['*.[jt]s'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/padding-line-between-statements':  [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'ExpressionStatement[expression.callee.name=\'bar\']',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'FunctionDeclaration[id.name=\'bar\']',
        },
      ],
      // your configs
    },
  },
];
