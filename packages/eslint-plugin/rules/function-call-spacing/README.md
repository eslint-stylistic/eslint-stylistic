---
title: function-call-spacing
rule_type: layout
related_rules:
  - no-spaced-func
---

# function-call-spacing

When calling a function, developers may insert optional whitespace between the function's name and the parentheses that invoke it. The following pairs of function calls are equivalent:

```js
alert('Hello');
alert ('Hello');

console.log(42);
console.log (42);

new Date();
new Date ();
```

## Rule Details

This rule requires or disallows spaces between the function name and the opening parenthesis that calls it.

## Options

This rule has a string option:

- `"never"` (default) disallows space between the function name and the opening parenthesis.
- `"always"` requires space between the function name and the opening parenthesis.

Further, in `"always"` mode, a second object option is available that contains a single boolean `allowNewlines` property.

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

::: incorrect

```js
/* eslint @stylistic/function-call-spacing: ["error", "never"] */

fn ();

fn
();
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

::: correct

```js
/* eslint @stylistic/function-call-spacing: ["error", "never"] */

fn();
```

:::

### always

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/* eslint @stylistic/function-call-spacing: ["error", "always"] */

fn();

fn
();
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/* eslint @stylistic/function-call-spacing: ["error", "always"] */

fn ();
```

:::

#### allowNewlines

By default, `"always"` does not allow newlines. To permit newlines when in `"always"` mode, set the `allowNewlines` option to `true`. Newlines are never required.

Examples of **incorrect** code for this rule with `allowNewlines` option enabled:

::: incorrect

```js
/* eslint @stylistic/function-call-spacing: ["error", "always", { "allowNewlines": true }] */

fn();
```

:::

Examples of **correct** code for this rule with the `allowNewlines` option enabled:

::: correct

```js
/* eslint @stylistic/function-call-spacing: ["error", "always", { "allowNewlines": true }] */

fn (); // Newlines are never required.

fn
();
```

:::

## When Not To Use It

This rule can safely be turned off if your project does not care about enforcing a consistent style for spacing within function calls.

## Compatibility

- **JSCS**: [disallowSpacesInCallExpression](https://jscs-dev.github.io/rule/disallowSpacesInCallExpression)
- **JSCS**: [requireSpacesInCallExpression](https://jscs-dev.github.io/rule/requireSpacesInCallExpression)
