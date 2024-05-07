import rule from './migrate-jsx'
import { runCases } from '#test'

const valids = [
  {
    rules: {
      'foo': 'error',
      '@stylistic/indent': 'error',
    },
  },
  {
    rules: {
      '@typescript-eslint/indent': 'error',
    },
  },
].map(json => `module.exports = ${JSON.stringify(json, null, 2)}`)

const invalids = [
  [
    {
      rules: {
        'react/jsx-indent': 'error',
      },
    },
    {
      rules: {
        '@stylistic/jsx/jsx-indent': 'error',
      },
    },
  ],
].map(([from, to]) => ({
  code: `module.exports = ${JSON.stringify(from, null, 2)}`,
  output: `module.exports = ${JSON.stringify(to, null, 2)}`,
  errors: [{ messageId: 'migrate' }],
}))

runCases({
  name: 'migrate-jsx',
  rule,
  valid: valids,
  invalid: invalids,
})
