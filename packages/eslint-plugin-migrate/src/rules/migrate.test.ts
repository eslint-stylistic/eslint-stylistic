import rule from './migrate'
import { runCases } from '#test'

const valids = [
  {
    rules: {
      'foo': 'error',
      '@stylistic/indent': 'error',
    },
  },
].flatMap(json => [
  {
    code: `module.exports = ${JSON.stringify(json, null, 2)}`,
    filename: '.eslintrc.js',
  },
  {
    code: `${JSON.stringify(json, null, 2)}`,
    filename: '.eslintrc.json',
  },
  {
    code: `export default ${JSON.stringify(json, null, 2)}`,
    filename: 'eslint.config.js',
  },
])

const invalids = [
  [
    {
      rules: {
        indent: 'error',
      },
    },
    {
      rules: {
        '@stylistic/indent': 'error',
      },
    },
  ],
  [
    {
      rules: {
        '@typescript-eslint/indent': 'error',
      },
    },
    {
      rules: {
        '@stylistic/indent': 'error',
      },
    },
  ],
  [
    {
      rules: {
        '@typescript-eslint/indent': 'error',
      },
    },
    {
      rules: {
        'style/indent': 'error',
      },
    },
    {
      namespaceTo: 'style',
    },
  ],
  [
    {
      rules: {
        '@typescript-eslint/indent': 'error',
      },
    },
    {
      rules: {
        indent: 'error',
      },
    },
    {
      namespaceTo: '',
    },
  ],
].flatMap(([from, to, options = {}]) => [
  {
    code: `module.exports = ${JSON.stringify(from, null, 2)}`,
    output: `module.exports = ${JSON.stringify(to, null, 2)}`,
    filename: '.eslintrc.js',
    errors: [{ messageId: 'migrate' }],
    options: [options] as any,
  },
  {
    code: `${JSON.stringify(from, null, 2)}`,
    output: `${JSON.stringify(to, null, 2)}`,
    filename: '.eslintrc.json',
    errors: [{ messageId: 'migrate' }],
    options: [options] as any,
    parser: require.resolve('jsonc-eslint-parser'),
  },
  {
    code: `export default ${JSON.stringify(from, null, 2)}`,
    output: `export default ${JSON.stringify(to, null, 2)}`,
    filename: 'eslint.config.js',
    errors: [{ messageId: 'migrate' }],
    options: [options] as any,
  },
])

runCases({
  name: 'migrate',
  rule,
  valid: valids,
  invalid: invalids,
})
