import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    ignores: [
      '**/*.md',
      '**/fixtures/**',
      'packages/metadata/src/metadata.ts',
    ],
  },
  {
    rules: {
      'no-void': 'off',
      'no-template-curly-in-string': 'off',
      'no-mixed-operators': 'off',
      'max-statements-per-line': 'off',
      'no-cond-assign': 'off',

      'eslint-comments/no-unused-enable': 'off',
      'jsdoc/check-param-names': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/no-types': 'off',
      'unicorn/prefer-number-properties': 'off',

      'ts/no-require-import': 'off',
      'ts/no-var-requires': 'off',
      'ts/no-require-imports': 'off',
    },
  },
  {
    files: [
      '**/*.test.js',
    ],
    rules: {
      'antfu/consistent-list-newline': 'off',
    },
  },
)
