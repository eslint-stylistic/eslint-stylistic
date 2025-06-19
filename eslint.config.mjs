/* eslint perfectionist/sort-objects: "error" */
// @ts-check

import antfu from '@antfu/eslint-config'
import stylistic from './stub.mjs'

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
    pnpm: true,
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
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-new-array': 'off',
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
    files: [
      '**/no-mixed-spaces-and-tabs/README.md',
    ],
    name: 'local/no-mixed-spaces-and-tabs/readme',
    rules: {
      'style/no-mixed-spaces-and-tabs': 'off',
    },
  },
  {
    files: [
      '**/no-trailing-spaces/README.md',
    ],
    name: 'local/no-trailing-spaces/readme',
    rules: {
      'format/prettier': 'off',
      'style/no-trailing-spaces': 'off',
    },
  },
  {
    files: [
      'packages/eslint-plugin/{rules,utils}/**/*.ts',
      'packages/shared/utils/**/*.ts',
    ],
    ignores: ['**/*.test.ts'],
    name: 'local/restrict-types',
    rules: {
      'ts/no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@typescript-eslint/utils', '@typescript-eslint/utils/*', '@typescript-eslint/types'],
            importNames: [
              'TSESTree',
              'TSESLint',
              'JSONSchema',
              'RuleWithMetaAndName',
              'EcmaVersion',
              'ReportDescriptor',
              'ReportFixFunction',
              'RuleContext',
              'RuleFixer',
              'RuleFunction',
              'RuleListener',
              'RuleModule',
              'Scope',
              'SourceCode',
            ],
            message: 'Import from "#types" instead',
          },
          {
            group: ['#test', '#test/*'],
            message: 'Should not import test utilities',
          },
        ],
      }],
      'ts/no-restricted-types': ['error', {
        types: {
          'Tree.Node': {
            fixWith: 'ASTNode',
            message: 'Import ASTNode from "#types" instead.',
          },
          'Tree.Token': {
            fixWith: 'Token',
            message: 'Import Token from "#types" instead.',
          },
        },
      }],
    },
  },
  {
    files: [
      'packages/eslint-plugin/rules/**/*.ts',
      'packages/shared/types/**/*.ts',
    ],
    name: 'local/restrict-utils',
    rules: {
      'ts/no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@typescript-eslint/utils', '@typescript-eslint/types'],
            importNames: ['AST_NODE_TYPES', 'AST_TOKEN_TYPES', 'ASTUtils'],
            message: 'Import from "#utils/ast" instead',
          },
          {
            group: ['@typescript-eslint/utils/ast-utils'],
            message: 'Import from "#utils/ast" instead',
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
      'antfu/curly': 'error',
      'antfu/if-newline': 'error',
      'antfu/top-level-function': 'error',
    },
  })
