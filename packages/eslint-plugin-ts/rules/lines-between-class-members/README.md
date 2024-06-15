---
description: Require or disallow an empty line between class members.
---

# ts/lines-between-class-members

This rule extends the base [`lines-between-class-members`](/rules/js/lines-between-class-members) rule.
It adds support for ignoring overload methods in a class.

## Options

In addition to the options supported by the `js/lines-between-class-members` rule, the rule adds the following options:

- Object option:

  - `"exceptAfterOverload": true` (default) - Skip checking empty lines after overload class members
  - `"exceptAfterOverload": false` - **do not** skip checking empty lines after overload class members

- [See the other options allowed](https://github.com/eslint/eslint/blob/main/docs/src/rules/lines-between-class-members.md#options)

### `exceptAfterOverload: true`

Examples of **correct** code for the `{ "exceptAfterOverload": true }` option:

```ts
/*eslint @typescript-eslint/lines-between-class-members: ["error", "always", { "exceptAfterOverload": true }]*/

class foo {
  bar(a: string): void;
  bar(a: string, b: string): void;
  bar(a: string, b: string) {}

  baz() {}

  qux() {}
}
```

### `exceptAfterOverload: false`

Examples of **correct** code for the `{ "exceptAfterOverload": false }` option:

```ts
/*eslint @typescript-eslint/lines-between-class-members: ["error", "always", { "exceptAfterOverload": false }]*/

class foo {
  bar(a: string): void;

  bar(a: string, b: string): void;

  bar(a: string, b: string) {}

  baz() {}

  qux() {}
}
```
