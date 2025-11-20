---
---

# new-parens

JavaScript allows the omission of parentheses when invoking a function via the `new` keyword and the constructor has no arguments. However, some coders believe that omitting the parentheses is inconsistent with the rest of the language and thus makes code less clear.

```js
var person = new Person;
```

## Rule Details

This rule can enforce or disallow parentheses when invoking a constructor with no arguments using the `new` keyword.

## Options

This rule has a mixed option

A string describing whether to enforce parenthesis after a new constructor with no arguments

- `"always"` enforces parenthesis after a new constructor with no arguments (default)
- `"never"` enforces no parenthesis after a new constructor with no arguments

An object

- `"overrides"`
- - `"anonymousClasses"` (default: `"always"` or `"never"`, depending on the value of the first option)
    a string (`"always"`, `"never"` or `"ignore"`) overriding the behaviour for new anonymous classes

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

### Anonymous Classes

Examples of **incorrect** code for this rule with the `"always", { "overrides": { "anonymousClasses": "never" } }` options

::: incorrect

```js
/* eslint @stylistic/new-parens: ["error", "always", { "overrides": { "anonymousClasses": "never" } }] */

var thing = new class {});
var thing = new class extends Base {}();
var thing = new class Derived extends Base {}();
```

:::

Examples of **correct** code for this rule with the `"always", { "overrides": { "anonymousClasses": "never" } }` options

::: correct

```js
/* eslint @stylistic/new-parens: ["error", "always", { "overrides": { "anonymousClasses": "never" } }] */

var thing = new class {};
var thing = new class extends Base {};
var thing = new class Derived extends Base {};
```

:::
