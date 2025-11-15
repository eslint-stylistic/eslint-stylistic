import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './no-whitespace-before-property'

run<RuleOptions, MessageIds>({
  name: 'no-whitespace-before-property',
  rule,
  valid: [
    `type Foo = A.B`,
    `type Foo = import(A).B`,
  ],

  invalid: [
    {
      code: `type Foo = A .B`,
      output: `type Foo = A.B`,
      errors: [{ messageId: 'unexpectedWhitespace', data: { propName: 'B' } }],
    },
    {
      code: `type Foo = import(A) .B`,
      output: `type Foo = import(A).B`,
      errors: [{ messageId: 'unexpectedWhitespace', data: { propName: 'B' } }],
    },
  ],
})
