# type-generic-spacing

Enforces consistent spacing inside TypeScript type generics.

## Rule Details

This rule enforces consistent spacing inside TypeScript type generics.

## Options

This rule has no options.

Examples of **incorrect** code for this rule:

:::incorrect

```ts
/* eslint @stylistic/type-generic-spacing: ["error"] */

type Foo<T,K> = T

interface Log {
  foo <T>(name: T): void
}
```

:::

Examples of **correct** code for this rule:

:::correct

```ts
/* eslint @stylistic/type-generic-spacing: ["error"] */

type Foo<T, K> = T

interface Log {
  foo<T>(name: T): void
}
```

:::
