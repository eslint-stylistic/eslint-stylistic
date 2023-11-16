import process from 'node:process'
import antfu from '@antfu/eslint-config'
import stylistic from '@stylistic/eslint-plugin'

const isInEditor = !!((process.env.VSCODE_PID || process.env.JETBRAINS_IDE) && !process.env.CI)
const overrideConfig = !isInEditor

export default antfu(
  {
    vue: false,
    markdown: false,
    stylistic: !overrideConfig,
    ignores: [
      '**/*.md',
      '**/fixtures/**',
      '**/playground/**',
      'packages/metadata/src/metadata.ts',
    ],
  },
  ...(overrideConfig
    ? [
        stylistic.configs.customize({ pluginName: 'style' }),
        {
          // Additional rules from @antfu/eslint-config
          rules: {
            'antfu/consistent-list-newline': 'error',
            'antfu/if-newline': 'error',
            'antfu/indent-binary-ops': ['error', { indent: 2 }],
            'antfu/top-level-function': 'error',
            'curly': ['error', 'multi-or-nest', 'consistent'],
          },
        },
      ]
    : []),
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
  {
    files: [
      'packages/eslint-plugin-js/rules/**/*.ts',
    ],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          {
            name: '@typescript-eslint/utils',
            message: 'Import from "../../utils/types" instead',
          },
          {
            name: '@typescript-eslint/utils/json-schema',
            message: 'Import from "../../utils/types" instead',
          },
        ],
      }],
    },
  },
)
