import rule from './migrate-ts'
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
      indent: 'error',
    },
  },
].map(json => `module.exports = ${JSON.stringify(json, null, 2)}`)

const invalids = [
  [
    {
      rules: {
        '@typescript-eslint/indent': 'error',
      },
    },
    {
      rules: {
        '@stylistic/ts/indent': 'error',
      },
    },
  ],
].map(([from, to]) => ({
  code: `module.exports = ${JSON.stringify(from, null, 2)}`,
  output: `module.exports = ${JSON.stringify(to, null, 2)}`,
  errors: [{ messageId: 'migrate' }],
}))

runCases({
  name: 'migrate-ts',
  rule,
  valid: valids,
  invalid: invalids,
})
