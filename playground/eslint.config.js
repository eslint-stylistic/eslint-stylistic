// @ts-check

import stylistic from '@stylistic/eslint-plugin'

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
]
