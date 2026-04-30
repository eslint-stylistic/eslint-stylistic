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
    'class Foo { method<T> () {} static cast<T> () {} }',
    {
      code: 'class Foo { method<T>() {} static cast<T>() {} }',
      options: ['never'],
    },
    {
      code: 'abstract class Foo { abstract method<T> (): void; }',
    },
    {
      code: 'abstract class Foo { abstract method<T>(): void; }',
      options: ['never'],
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
    {
      code: 'class Foo { method<T>() {} }',
      output: 'class Foo { method<T> () {} }',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 22,
        },
      ],
    },
    {
      code: 'class Foo { static cast<T>(_candidate: T | undefined) { return []; } }',
      output: 'class Foo { static cast<T> (_candidate: T | undefined) { return []; } }',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 27,
        },
      ],
    },
    {
      code: 'class Foo { method<T> () {} }',
      output: 'class Foo { method<T>() {} }',
      options: ['never'],
      errors: [
        {
          messageId: 'unexpectedSpace',
          line: 1,
          column: 22,
        },
      ],
    },
    {
      code: 'abstract class Foo { abstract method<T>(): void; }',
      output: 'abstract class Foo { abstract method<T> (): void; }',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 40,
        },
      ],
    },
    {
      code: 'const obj = { method<T>() {} };',
      output: 'const obj = { method<T> () {} };',
      errors: [
        {
          messageId: 'missingSpace',
          line: 1,
          column: 24,
        },
      ],
    },
  ],
})
