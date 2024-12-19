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
      // your configs
    },
  },
];
