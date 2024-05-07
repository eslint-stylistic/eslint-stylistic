import rule from './migrate-js'
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
        indent: 'error',
      },
    },
    {
      rules: {
        '@stylistic/js/indent': 'error',
      },
    },
  ],
].map(([from, to]) => ({
  code: `module.exports = ${JSON.stringify(from, null, 2)}`,
  output: `module.exports = ${JSON.stringify(to, null, 2)}`,
  errors: [{ messageId: 'migrate' }],
}))

runCases({
  name: 'migrate-js',
  rule,
  valid: valids,
  invalid: invalids,
})
