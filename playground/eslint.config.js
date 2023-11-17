// @ts-check
import stylistic from '../stub.js';

/** @type {import('../playground-types').TypedFlatConfig[]} */
export default [
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      // your configs
    },
  },
];
