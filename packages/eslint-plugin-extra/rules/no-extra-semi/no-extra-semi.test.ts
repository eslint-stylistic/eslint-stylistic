// this rule tests semis, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import { RuleTester } from '@typescript-eslint/rule-tester'

import rule from './no-extra-semi'

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
})

ruleTester.run('no-extra-semi', rule, {
  valid: [
    '',
  ],
  invalid: [

  ],
})
