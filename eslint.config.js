/* eslint perfectionist/sort-objects: "error" */

import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/*.md',
      '**/fixtures/**',
      '**/playground/**',
      'packages/metadata/src/metadata.ts',
    ],
    markdown: false,
    vue: false,
  },
  {
    rules: {
      'eslint-comments/no-unused-enable': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/no-types': 'off',
      'jsdoc/require-returns-description': 'off',
      'no-cond-assign': 'off',
      'no-template-curly-in-string': 'off',
      'no-void': 'off',
      'style/max-statements-per-line': 'off',
      'style/multiline-ternary': 'off',
      'style/no-mixed-operators': 'off',
      'ts/no-require-import': 'off',
      'ts/no-require-imports': 'off',
      'ts/no-var-requires': 'off',
      'unicorn/prefer-number-properties': 'off',
    },
  },
  {
    files: [
      '**/*.test.{js,ts}',
    ],
    rules: {
      'antfu/consistent-list-newline': 'off',
      'node/prefer-global/process': 'off',
    },
  },
  {
    files: [
      'packages/eslint-plugin-js/rules/**/*.ts',
      'packages/eslint-plugin-jsx/rules/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          {
            message: 'Import from "../../utils/types" instead',
            name: '@typescript-eslint/utils',
          },
          {
            message: 'Import from "../../utils/types" instead',
            name: '@typescript-eslint/utils/json-schema',
          },
        ],
      }],
    },
  },
)
