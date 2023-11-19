---
description: 'Enforce consistent spacing before blocks.'
---


This rule extends the base [`space-before-blocks`](/rules/js/space-before-blocks) rule.
It adds support for interfaces and enums.

<!-- tabs -->

::: incorrect

```ts
enum Breakpoint{
  Large, Medium;
}

interface State{
  currentBreakpoint: Breakpoint;
}
```

::: correct

```ts
enum Breakpoint {
  Large, Medium;
}

interface State {
  currentBreakpoint: Breakpoint;
}
```

## Options

In case a more specific options object is passed these blocks will follow `classes` configuration option.
