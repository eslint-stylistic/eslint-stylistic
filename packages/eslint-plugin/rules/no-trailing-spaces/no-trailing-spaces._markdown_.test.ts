import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './no-trailing-spaces'

run<RuleOptions, MessageIds>({
  lang: 'markdown',
  name: 'no-trailing-spaces',
  rule,
  valid: [
    {
      code: 'Some text\nSome text\n',
    },
  ],
  invalid: [
    {
      code: 'Some text   \nSome text\t\n',
      output: 'Some text\nSome text\n',
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 9,
        },
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 9,
        },
      ],
    },
  ],
})
