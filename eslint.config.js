/* eslint perfectionist/sort-objects: "error" */
import antfu from '@antfu/eslint-config'
import stylistic from './stub.js'

const configs = await antfu(
  {
    formatters: true,
    ignores: [
      '**/fixtures/**',
      '**/playground/**',
      'packages/metadata/src/metadata.ts',
    ],
    jsx: true,
    markdown: false,
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
      'node/prefer-global/process': 'off',
    },
  },
  {
    files: [
      '**/*.md',
    ],
    rules: {
      'style/no-tabs': 'off',
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

const config = configs.find(i => i.name === 'antfu:stylistic')
Object.assign(config, stylistic.configs.customize({
  pluginName: 'style',
}))

// Additional rules from @antfu/eslint-config
Object.assign(config.rules, {
  'antfu/consistent-list-newline': 'error',
  'antfu/if-newline': 'error',
  'antfu/top-level-function': 'error',
  'curly': ['error', 'multi-or-nest', 'consistent'],
})

export default configs
