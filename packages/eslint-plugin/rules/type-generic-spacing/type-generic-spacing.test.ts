import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './type-generic-spacing'

run<RuleOptions, MessageIds>({
  name: 'type-generic-spacing',
  rule,
  valid: [
    // handled by `space-infix-ops`
    'const foo: Array<number> = []',
    'const foo: Array<number>= []',
    'type Foo<T = true> = T',
    'type Foo<T = true>= T',
    'type Foo<T extends true = true> = T',
    // handled by `keyword-spacing`
    'type Foo = new <T>(name: T) => void',
    'type Foo = new<T>(name: T) => void',
    $`
      type Foo<
        T = true,
        K = false
      > = T
    `,
    $`
      function foo<
        T
      >() {}
    `,
    $`
      interface Log {
        foo<T>(name: T): void
      }
    `,
    $`
      interface Log {
        <T>(name: T): void
      }
    `,
    $`
      interface Foo {
        foo?: <T>(name: T) => void
      }
    `,
    `const toSortedImplementation = Array.prototype.toSorted || function <T>(name: T): void {}`,
    `type Foo = import('foo')<T>['Foo']`,
    `type Foo = import('foo')<T> ['Foo']`,
    `const foo = class <T> { value: T; }`,
    `const foo = class<T>{ value: T; }`,
    `class Foo<T>{ value: T; }`,
    `class Foo<T> { value: T; }`,
    'const foo = <T>() => 1',
    'const foo =<T>() => 1',
    'const foo = function <T> () {}',
    'const foo = function<T>() {}',
    'function foo<T>() {}',
    'declare function foo<T>(): void',
    'declare function foo<T> (): void',
  ],
  invalid: ([
    ['const val: Set< string> = new Set()', 'const val: Set<string> = new Set()'],
    ['const val: Array<  number > = []', 'const val: Array<number> = []', 2],
    ['const val = callback< string  >(() => \'foo\')', 'const val = callback<string>(() => \'foo\')', 2],
    ['type Foo< T> = T', 'type Foo<T> = T'],
    ['type Foo<T > = T', 'type Foo<T> = T'],
    ['type Foo< T > = T', 'type Foo<T> = T', 2],
    ['function foo< T >() {}', 'function foo<T>() {}', 2],
    ['type Foo< T = true    > = T', 'type Foo<T = true> = T', 2],
    ['type Foo< T, K   > = T', 'type Foo<T, K> = T', 2],
    ['function foo <T>() {}', 'function foo<T>() {}'],
    ['function foo< T >() {}', 'function foo<T>() {}', 2],
    [
      $`
        interface Log<T> {
          foo <T>(name: T): void
          bar: <T> () => void
          baz: new <T> () => void
        }
      `,
      $`
        interface Log<T> {
          foo<T>(name: T): void
          bar: <T>() => void
          baz: new <T>() => void
        }
      `,
      3,
    ],
    [
      $`
        interface Log {
          foo<  T >(name: T): void
        }
      `,
      $`
        interface Log {
          foo<T>(name: T): void
        }
      `,
      2,
    ],
    [
      'const toSortedImplementation = Array.prototype.toSorted || function <    T >(name: T): void {}',
      'const toSortedImplementation = Array.prototype.toSorted || function <T>(name: T): void {}',
      2,
    ],
  ] satisfies [string, string, number?][]).map(([code, output, errorLen = 1]) => ({
    code,
    output,
    errors: Array.from({ length: errorLen }, () => ({ messageId: 'genericSpacingMismatch' })),
  })),
})

run<RuleOptions, MessageIds>({
  name: 'type-generic-spacing',
  rule,
  valid: [
    { code: 'function foo <T>() {}', options: [{ before: true }] },
    { code: 'type Foo <T> = T', options: [{ before: true }] },
    { code: 'class Foo <T> {}', options: [{ before: true }] },
    { code: 'const val = callback<string> (() => \'foo\')', options: [{ after: true }] },
    { code: 'interface Foo { foo<T> (name: T): void }', options: [{ after: true }] },
  ],
  invalid: [
    {
      code: 'function foo<T>() {}',
      output: 'function foo <T>() {}',
      options: [{ before: true }],
      errors: [{ messageId: 'genericSpacingMismatch' }],
    },
    {
      code: 'type Foo<T> = T',
      output: 'type Foo <T> = T',
      options: [{ before: true }],
      errors: [{ messageId: 'genericSpacingMismatch' }],
    },
    {
      code: 'class Foo<T> {}',
      output: 'class Foo <T> {}',
      options: [{ before: true }],
      errors: [{ messageId: 'genericSpacingMismatch' }],
    },
    {
      code: 'const val = foo<string>()',
      output: 'const val = foo <string> ()',
      options: [{ before: true, after: true }],
      errors: [
        { messageId: 'genericSpacingMismatch' },
        { messageId: 'genericSpacingMismatch' },
      ],
    },
    {
      code: 'interface Foo { foo<T>(name: T): void }',
      output: 'interface Foo { foo <T> (name: T): void }',
      options: [{ before: true, after: true }],
      errors: [
        { messageId: 'genericSpacingMismatch' },
        { messageId: 'genericSpacingMismatch' },
      ],
    },
  ],
})
