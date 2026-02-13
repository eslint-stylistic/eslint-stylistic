/* eslint-disable style/no-tabs */
import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './no-trailing-spaces'

run<RuleOptions, MessageIds>({
  lang: 'json',
  name: 'no-trailing-spaces',
  rule,
  valid: [
    {
      code: $`
        { "key": "value" }
      `,
    },
  ],
  invalid: [
    {
      code: $`
        {
          "key": "value", 
          "anotherKey": "anotherValue"	
        }
      `,
      output: $`
        {
          "key": "value",
          "anotherKey": "anotherValue"
        }
      `,
      errors: [
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 18,
        },
        {
          messageId: 'trailingSpace',
          line: 3,
          column: 31,
        },
      ],
    },
  ],
})
