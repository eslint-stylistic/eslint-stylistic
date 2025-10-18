// this rule tests the spacing, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './comma-spacing'

run<RuleOptions, MessageIds>({
  name: 'comma-spacing',
  rule,
  valid: [
    'const Foo = <T,>(foo: T) => {}',
    'function foo<T,>() {}',
    'class Foo<T, T1> {}',
    'interface Foo<T, T1,>{}',
    'let foo,',
    'const foo = new Foo<T, T1>',
  ],

  invalid: [
    {
      code: 'function Foo<T,T1>() {}',
      output: 'function Foo<T, T1>() {}',
      errors: [
        {
          messageId: 'missing',
          column: 15,
          line: 1,
          data: { loc: 'after' },
        },
      ],
    },
    {
      code: 'function Foo<T , T1>() {}',
      output: 'function Foo<T, T1>() {}',
      errors: [
        {
          messageId: 'unexpected',
          column: 16,
          line: 1,
          data: { loc: 'before' },
        },
      ],
    },
    {
      code: 'function Foo<T ,T1>() {}',
      output: 'function Foo<T, T1>() {}',
      errors: [
        {
          messageId: 'unexpected',
          column: 16,
          line: 1,
          data: { loc: 'before' },
        },
        {
          messageId: 'missing',
          column: 16,
          line: 1,
          data: { loc: 'after' },
        },
      ],
    },
    {
      code: 'function Foo<T, T1>() {}',
      output: 'function Foo<T,T1>() {}',
      options: [{ before: false, after: false }],
      errors: [
        {
          messageId: 'unexpected',
          column: 15,
          line: 1,
          data: { loc: 'after' },
        },
      ],
    },
    {
      code: 'function Foo<T,T1>() {}',
      output: 'function Foo<T ,T1>() {}',
      options: [{ before: true, after: false }],
      errors: [
        {
          messageId: 'missing',
          column: 15,
          line: 1,
          data: { loc: 'before' },
        },
      ],
    },
    {
      code: 'let foo ,',
      output: 'let foo,',
      errors: [
        {
          messageId: 'unexpected',
          column: 9,
          line: 1,
          data: { loc: 'before' },
        },
      ],
    },
    {
      code: 'const foo = new Foo<T , T1>',
      output: 'const foo = new Foo<T, T1>',
      errors: [
        { messageId: 'unexpected', column: 23, line: 1, data: { loc: 'before' } },
      ],
    },
  ],
})
