import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './no-trailing-spaces'

run<RuleOptions, MessageIds>({
  lang: 'css',
  name: 'no-trailing-spaces',
  rule,
  valid: [
    {
      code: 'a { color: red; }\n.b { margin: 0; }\n',
    },
  ],
  invalid: [
    {
      code: 'a { color: red; }   \n.b { margin: 0; }\t\n',
      output: 'a { color: red; }\n.b { margin: 0; }\n',
      errors: [
        {
          messageId: 'trailingSpace',
          line: 1,
          column: 17,
        },
        {
          messageId: 'trailingSpace',
          line: 2,
          column: 17,
        },
      ],
    },
  ],
})
