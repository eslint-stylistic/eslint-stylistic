import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    markdown: false,
    ignores: [
      '**/*.md',
      '**/fixtures/**',
      '**/playground/**',
      'packages/metadata/src/metadata.ts',
    ],
  },
  {
    rules: {
      'no-void': 'off',
      'no-template-curly-in-string': 'off',
      'style/no-mixed-operators': 'off',
      'style/max-statements-per-line': 'off',
      'no-cond-assign': 'off',

      'eslint-comments/no-unused-enable': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/no-types': 'off',
      'unicorn/prefer-number-properties': 'off',

      'style/multiline-ternary': 'off',

      'ts/no-require-import': 'off',
      'ts/no-var-requires': 'off',
      'ts/no-require-imports': 'off',
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
)
