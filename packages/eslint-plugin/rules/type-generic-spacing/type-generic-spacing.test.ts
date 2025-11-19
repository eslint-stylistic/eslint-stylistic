import type { MessageIds, RuleOptions } from './types'
import { $, run } from '#test'
import rule from './type-generic-spacing'

run<RuleOptions, MessageIds>({
  name: 'type-generic-spacing',
  rule,
  valid: [
    'const foo: Array<number> = []',
    'type Foo<T = true> = T',
    'type Foo<T extends true = true> = T',
    'type Foo<T = (true)> = T',
    'type Foo<T extends (true) = (true)> = T',
    'type Foo = new <T>(name: T) => void',
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
    'const foo = <T>(name: T) => name',
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
    $`
      type Foo<
        T = true,
        K = false,
      > = T
    `,
    `const toSortedImplementation = Array.prototype.toSorted || function <T>(name: T): void {}`,
    `const foo = class <T> { value: T; }`,
    '<T>() => 1',
    `type Foo = import('foo')<T> ['Foo']`,
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
    ['type Foo<T=true> = T', 'type Foo<T = true> = T'],
    ['type Foo<T=(true)> = T', 'type Foo<T = (true)> = T'],
    ['type Foo<T extends (true)=(true)> = T', 'type Foo<T extends (true) = (true)> = T'],
    ['type Foo< T, K   > = T', 'type Foo<T, K> = T', 2],
    ['type Foo<T=false, K=1|2> = T', 'type Foo<T = false, K = 1|2> = T', 2],
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
