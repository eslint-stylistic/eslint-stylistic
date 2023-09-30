import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './migrate-ts'

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

const ruleTester: RuleTester = new RuleTester()

ruleTester.run('migrate-ts', rule as any, {
  valid: valids,
  invalid: invalids,
})
