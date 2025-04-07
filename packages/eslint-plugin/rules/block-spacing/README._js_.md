---
title: block-spacing
rule_type: layout
related_rules:
  - space-before-blocks
  - brace-style
---

# js/block-spacing

## Rule Details

This rule enforces consistent spacing inside an open block token and the next token on the same line. This rule also enforces consistent spacing inside a close block token and previous token on the same line.

## Options

This rule has a string option:

- `"always"` (default) requires one or more spaces
- `"never"` disallows spaces

This rule has an object option:

- `"ignoredNodes"` can be used to disable spacing checking for the AST node. It can be used to resolve conflicts with [`object-curly-spacing`](../ts/object-curly-spacing).

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

:::incorrect

```js
/*eslint block-spacing: "error"*/

function foo() {return true;}
if (foo) { bar = 0;}
function baz() {let i = 0;
    return i;
}

class C {
    static {this.bar = 0;}
}
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

:::correct

```js
/*eslint block-spacing: "error"*/

function foo() { return true; }
if (foo) { bar = 0; }

class C {
    static { this.bar = 0; }
}
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

:::incorrect

```js
/*eslint block-spacing: ["error", "never"]*/

function foo() { return true; }
if (foo) { bar = 0;}

class C {
    static { this.bar = 0; }
}
```

:::

Examples of **correct** code for this rule with the `"never"` option:

:::correct

```js
/*eslint block-spacing: ["error", "never"]*/

function foo() {return true;}
if (foo) {bar = 0;}

class C {
    static {this.bar = 0;}
}
```

:::

### ignoredNodes

The "ignoredNodes" object property is optional (default: []).

Examples of **correct** code for this rule with sample `{ "ignoredNodes": ["TSTypeLiteral"] }` options:

::: correct

```js
/*eslint block-spacing: ["error", "always", { "ignoredNodes": ["TSTypeLiteral"] }]*/
function foo(bar: Array<{a: number; b: number;}>) { return bar; }
```

:::

## When Not To Use It

If you don't want to be notified about spacing style inside of blocks, you can safely disable this rule.
