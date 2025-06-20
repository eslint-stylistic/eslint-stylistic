---
title: new-parens
rule_type: layout
---

# new-parens

JavaScript allows the omission of parentheses when invoking a function via the `new` keyword and the constructor has no arguments. However, some coders believe that omitting the parentheses is inconsistent with the rest of the language and thus makes code less clear.

```js
var person = new Person;
```

## Rule Details

This rule can enforce or disallow parentheses when invoking a constructor with no arguments using the `new` keyword.

## Options

This rule takes one option.

- `"always"` enforces parenthesis after a new constructor with no arguments (default)
- `"never"` enforces no parenthesis after a new constructor with no arguments

### always

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/* eslint @stylistic/new-parens: "error" */

var person = new Person;
var person = new (Person);
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/* eslint @stylistic/new-parens: "error" */

var person = new Person();
var person = new (Person)();
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/* eslint @stylistic/new-parens: ["error", "never"] */

var person = new Person();
var person = new (Person)();
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/* eslint @stylistic/new-parens: ["error", "never"] */

var person = new Person;
var person = (new Person);
var person = new Person("Name");
```

:::
