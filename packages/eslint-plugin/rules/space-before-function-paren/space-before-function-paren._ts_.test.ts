// this rule tests the spacing, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './space-before-function-paren'

run<RuleOptions, MessageIds>({
  name: 'space-before-function-paren',
  rule,
  valid: [
    'type TransformFunction = (el: ASTElement, code: string) => string;',
    'var f = function <T> () {};',
    'function foo<T extends () => {}> () {}',
    'async <T extends () => {}> () => {}',
    'async <T>() => {}',
    {
      code: 'function foo<T extends Record<string, () => {}>>() {}',
      options: ['never'],
    },

    'abstract class Foo { constructor () {} abstract method () }',
    {
      code: 'abstract class Foo { constructor() {} abstract method() }',
      options: ['never'],
    },
    {
      code: 'abstract class Foo { constructor() {} abstract method() }',
      options: [{ anonymous: 'always', named: 'never' }],
    },
    'function foo ();',
    {
      code: 'function foo();',
      options: ['never'],
    },
    {
      code: 'function foo();',
      options: [{ anonymous: 'always', named: 'never' }],
    },
  ],

  invalid: [
    {
      code: 'function foo<T extends () => {}>() {}',
      output: 'function foo<T extends () => {}> () {}',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 33,
        },
      ],
    },
  ],
})
