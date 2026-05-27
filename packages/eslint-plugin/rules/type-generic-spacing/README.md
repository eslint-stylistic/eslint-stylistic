---
related_rules:
  - type-annotation-spacing
  - space-infix-ops
  - space-before-function-paren
---

# type-generic-spacing

Enforces consistent spacing inside TypeScript type generics.

## Rule Details

This rule enforces consistent spacing inside TypeScript type generics.

## Options

This rule takes an object argument with `before` and `after` properties, each with a Boolean value.

The default configuration is `{ "before": false, "after": false }`.

`true` means there should be one or more spaces and false means no spaces.

Examples of **incorrect** code for this rule:

:::incorrect

```ts
/* eslint @stylistic/type-generic-spacing: ["error"] */

type Foo <T = true> = T

const foo: Array <number> = []

function foo <T> () {}

const value = callback <string> ()

const set = new Set <string> ()

const tagged = tag <string> `value`

interface Log {
  new <T> (): Log
  foo <T> (name: T): void
  call: <T> () => void
  construct: new <T> () => Log
}
```

:::

Examples of **correct** code for this rule:

:::correct

```ts
/* eslint @stylistic/type-generic-spacing: ["error"] */

type Foo<T = true> = T

const foo: Array<number> = []

function foo<T>() {}

const value = callback<string>()

const set = new Set<string>()

const tagged = tag<string>`value`

interface Log {
  new <T>(): Log
  foo<T>(name: T): void
  call: <T>() => void
  construct: new <T>() => Log
}
```

:::
