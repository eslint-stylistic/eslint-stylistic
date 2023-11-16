/* eslint perfectionist/sort-objects: "error" */
import process from 'node:process'
import antfu from '@antfu/eslint-config'
import stylistic from '@stylistic/eslint-plugin'

const isInEditor = !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE) && !process.env.CI)
const overrideConfig = !isInEditor

const configs = antfu(
  {
    ignores: [
      '**/*.md',
      '**/fixtures/**',
      '**/playground/**',
      'packages/metadata/src/metadata.ts',
    ],
    jsx: true,
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

if (overrideConfig) {
  const config = configs.find(i => i.name === 'antfu:stylistic')
  Object.assign(config, stylistic.configs.customize({
    pluginName: 'style',
  }))
  Object.assign(config.rules, {
    // Additional rules from @antfu/eslint-config
    'antfu/consistent-list-newline': 'error',
    'antfu/if-newline': 'error',
    'antfu/indent-binary-ops': ['error', { indent: 2 }],
    'antfu/top-level-function': 'error',
    'curly': ['error', 'multi-or-nest', 'consistent'],
  })
}

export default configs
