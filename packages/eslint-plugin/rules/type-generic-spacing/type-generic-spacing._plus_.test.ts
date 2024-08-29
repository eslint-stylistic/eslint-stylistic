import rule from './type-generic-spacing._plus_'
import { $, run } from '#test'

run({
  name: 'type-generic-spacing',
  rule,
  valid: [
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
    ['type Foo<T=true> = T', 'type Foo<T = true> = T'],
    ['type Foo<T=(true)> = T', 'type Foo<T = (true)> = T'],
    ['type Foo<T extends (true)=(true)> = T', 'type Foo<T extends (true) = (true)> = T'],
    ['type Foo<T,K> = T', 'type Foo<T, K> = T'],
    ['type Foo<T=false,K=1|2> = T', 'type Foo<T = false, K = 1|2> = T', 3],
    ['function foo <T>() {}', 'function foo<T>() {}'],
    [`interface Log {
    foo <T>(name: T): void
  }`, `interface Log {
    foo<T>(name: T): void
  }`],
  ] as const).map(i => ({
    code: i[0],
    output: i[1],
    errors: Array.from({ length: i[2] || 1 }, () => ({ messageId: 'genericSpacingMismatch' })),
  })),
})
