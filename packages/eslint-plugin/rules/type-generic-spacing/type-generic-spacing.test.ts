import { $, run } from '#test'
import rule from './type-generic-spacing'

run({
  name: 'type-generic-spacing',
  rule,
  valid: [
    'const foo: Array<number> = []',
    'type Foo<T = true> = T',
    'type Foo<T extends true = true> = T',
    'type Foo<T = (true)> = T',
    'type Foo<T extends (true) = (true)> = T',
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
    `type Foo<\r\nT = true,\r\nK = false,\r\n> = T`,
    `const toSortedImplementation = Array.prototype.toSorted || function <T>(name: T): void {}`,
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
    ['type Foo<T,K> = T', 'type Foo<T, K> = T'],
    ['type Foo< T,K   > = T', 'type Foo<T, K> = T', 3],
    ['type Foo<T=false,K=1|2> = T', 'type Foo<T = false, K = 1|2> = T', 3],
    ['function foo <T>() {}', 'function foo<T>() {}'],
    ['function foo< T >() {}', 'function foo<T>() {}', 2],
    [`interface Log {
    foo <T>(name: T): void
  }`, `interface Log {
    foo<T>(name: T): void
  }`],
    [`interface Log {
    foo<  T >(name: T): void
  }`, `interface Log {
    foo<T>(name: T): void
  }`, 2],
    [
      'const toSortedImplementation = Array.prototype.toSorted || function <    T >(name: T): void {}',
      'const toSortedImplementation = Array.prototype.toSorted || function <T>(name: T): void {}',
      2,
    ],
  ] as const)
    .map(i => ({
      code: i[0],
      output: i[1],
      errors: Array.from({ length: i[2] || 1 }, () => ({ messageId: 'genericSpacingMismatch' })),
    })),
})
