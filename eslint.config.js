/* eslint perfectionist/sort-objects: "error" */
import antfu from '@antfu/eslint-config'
import stylistic from './stub.js'

const stylisticConfig = stylistic.configs.customize()

export default antfu(
  {
    formatters: true,
    ignores: [
      '**/fixtures/**',
      '**/playground/**',
      'packages/metadata/src/metadata.ts',
    ],
    jsx: true,
    markdown: false,
    typescript: true,
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
    name: 'local/test',
    rules: {
      'antfu/indent-unindent': 'error',
      'node/prefer-global/process': 'off',
    },
  },
  {
    files: [
      '**/*.md',
    ],
    name: 'local/markdown',
    rules: {
      'style/no-tabs': 'off',
    },
  },
  {
    files: ['packages/eslint-plugin-{js,jsx,ts}/{rules,utils}/**/*.ts'],
    name: 'local/restricted-imports',
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          {
            message: 'Import from "@shared/types" instead',
            name: '@typescript-eslint/utils/json-schema',
          },
        ],
        patterns: [
          {
            group: ['@typescript-eslint/utils', '@typescript-eslint/utils/*'],
            importNames: [
              'TSESTree',
              'RuleFunction',
              'RuleListener',
              'SourceCode',
              'RuleFixer',
              'ReportFixFunction',
              'RuleContext',
              'EcmaVersion',
              'ReportDescriptor',
              'Scope',
            ],
            message: 'Import from "@shared/types" instead',
          },
        ],
      }],
    },
  },
)
  .override('antfu/stylistic/rules', {
    ...stylisticConfig,
    rules: {
      ...stylisticConfig.rules,
      'antfu/consistent-list-newline': 'error',
      'antfu/if-newline': 'error',
      'antfu/top-level-function': 'error',
      'curly': ['error', 'multi-or-nest', 'consistent'],
    },
  })
