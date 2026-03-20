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
    'type Foo<T, P,> = Bar<T, P>',
    'interface Foo<T, T1,>{}',
    'let foo,',
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
      code: 'type Foo<T,P,> = Bar<T,P>',
      output: 'type Foo<T, P,> = Bar<T, P>',
      errors: [
        { messageId: 'missing', column: 11, line: 1, data: { loc: 'after' } },
        { messageId: 'missing', column: 23, line: 1, data: { loc: 'after' } },
      ],
    },
  ],
})
