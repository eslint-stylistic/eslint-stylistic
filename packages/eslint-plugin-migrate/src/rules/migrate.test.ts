import { RuleTester } from '@typescript-eslint/rule-tester'
import rule from './migrate'

const valids = [
  {
    rules: {
      'foo': 'error',
      '@stylistic/indent': 'error',
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
].map(([from, to, options]) => ({
  code: `module.exports = ${JSON.stringify(from, null, 2)}`,
  output: `module.exports = ${JSON.stringify(to, null, 2)}`,
  errors: [{ messageId: 'migrate' }],
  options: [options] as any,
}))

const ruleTester: RuleTester = new RuleTester()

ruleTester.run('migrate', rule as any, {
  valid: valids,
  invalid: invalids,
})
