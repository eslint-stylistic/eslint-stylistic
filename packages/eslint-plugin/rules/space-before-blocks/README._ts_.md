---
description: Enforce consistent spacing before blocks.
---

# ts/space-before-blocks

This rule extends the base [`space-before-blocks`](/rules/js/space-before-blocks) rule.
It adds support for interfaces and enums.

<!-- tabs -->

::: incorrect

```ts
/*eslint @stylistic/ts/space-before-blocks: "error"*/

enum Breakpoint{
  Large, Medium;
}

interface State{
  currentBreakpoint: Breakpoint;
}
```

::: correct

```ts
/*eslint @stylistic/ts/space-before-blocks: "error"*/

enum Breakpoint {
  Large, Medium;
}

interface State {
  currentBreakpoint: Breakpoint;
}
```

## Options

In case a more specific options object is passed these blocks will follow `classes` configuration option.
