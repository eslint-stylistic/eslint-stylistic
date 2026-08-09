---
description: Require consistent spacing around type annotations.
related_rules:
  - key-spacing
---

# type-annotation-spacing

Spacing around type annotations improves the readability of the code. Although the most commonly used style guideline for type annotations in TypeScript prescribes adding a space after the colon, but not before it, it is subjective to the preferences of a project. For example:

```ts
// with space after, but not before (default if no option is specified)
let foo: string = "bar";

// with no spaces
let foo:string = "bar";

// with space before and after
let foo : string = "bar";

// with space before, but not after
let foo :string = "bar";
```

## Examples

This rule aims to enforce specific spacing patterns around type annotations and function types in type literals.

<!--tabs-->

::: incorrect

```ts
/* eslint @stylistic/type-annotation-spacing: "error" */

let foo:string = "bar";
let foo :string = "bar";
let foo : string = "bar";

function foo():string {}
function foo() :string {}
function foo() : string {}

class Foo {
    name:string;
}

class Foo {
    name :string;
}

class Foo {
    name : string;
}
```

:::

::: correct

```ts
/* eslint @stylistic/type-annotation-spacing: "error" */

let foo: string = "bar";

function foo(): string {}

class Foo {
    name: string;
}
```

:::

## Options

### after

Examples of **incorrect** code for this rule with the `{ "before": false, "after": true }` option:

<!--tabs-->

::: incorrect

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": false, "after": true }] */

let foo:string = "bar";
let foo :string = "bar";
let foo : string = "bar";

function foo():string {}
function foo() :string {}
function foo() : string {}

class Foo {
    name:string;
}

class Foo {
    name :string;
}

class Foo {
    name : string;
}
```

:::

Examples of **correct** code for this rule with the `{ "before": false, "after": true }` option:

::: correct

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": false, "after": true }] */

let foo: string = "bar";

function foo(): string {}

class Foo {
    name: string;
}
```

:::

### before

Examples of **incorrect** code for this rule with the `{ "before": true, "after": true }` option:

<!--tabs-->

::: incorrect

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": true, "after": true }] */

let foo: string = "bar";
let foo:string = "bar";
let foo :string = "bar";

function foo(): string {}
function foo():string {}
function foo() :string {}

class Foo {
    name: string;
}

class Foo {
    name:string;
}

class Foo {
    name :string;
}
```

:::

Examples of **correct** code for this rule with the `{ "before": true, "after": true }` option:

::: correct

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": true, "after": true }] */

let foo : string = "bar";

function foo() : string {}

class Foo {
    name : string;
}
```

:::

### overrides

> [!TIP]
>
> Because for the [key-spacing](key-spacing) rule some alignment options require multiple spaces in properties of object literals and import attributes. You can set `property` to `"ignore"` to avoid the conflict.

Spacing overrides can be customized using the options listed below. Most options accept an object format, `{ before: true, after: false }`, to set precise formatting rules. The configuration can also be set to `"ignore"` to bypass rule enforcement, with the exception of the `colon` option.

- `colon` (no support `"ignore"` value)
- `variable`
- `parameter`
- `property`
- `returnType`
- `questionMark`

#### colon

Examples of **incorrect** code for this rule with the `{ "before": false, "after": false, "overrides": { "colon": { "before": true, "after": true } } }` option:

::: incorrect

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": false, "after": false, "overrides": { "colon": { "before": true, "after": true } } }] */

let foo: string = "bar";
let foo:string = "bar";
let foo :string = "bar";

function foo(): string {}
function foo():string {}
function foo() :string {}

class Foo {
    name: string;
}

class Foo {
    name:string;
}

class Foo {
    name :string;
}
```

:::

Examples of **correct** code for this rule with the `{ "before": false, "after": false, "overrides": { "colon": { "before": true, "after": true } } }` option:

::: correct

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": false, "after": false, "overrides": { "colon": { "before": true, "after": true } } }] */

let foo : string = "bar";

function foo() : string {}

class Foo {
    name : string;
}

type Foo = {
    name: (name : string)=>string;
}
```

:::

#### property

Examples of **incorrect** code for this rule with the `{ "before": false, "after": false, "overrides": { "property": { "before": true, "after": true } } }` option:

::: incorrect

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": false, "after": false, "overrides": { "property": { "before": true, "after": true } } }] */
class Foo {
    bar: string;
    baz:string;
    bat :string;
}

interface Foo {
    bar: string;
    baz:string;
    bat :string;
}
```

:::

Examples of **correct** code for this rule with the `{ "before": false, "after": false, "overrides": { "property": { "before": true, "after": true } } }` option:

::: correct

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": false, "after": false, "overrides": { "property": { "before": true, "after": true } } }] */

class Foo {
    name : string;
}

interface Foo {
    name : string;
}

type Foo = {
    name : (name:string)=>string;
}
```

:::

Examples of **correct** code for this rule with the `{ "before": false, "after": false, "overrides": { "property": "ignore" } }` option. Where no property type spacing is changed so it won't conflict with `key-spacing` or any spacing rule:

::: correct

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "before": false, "after": false, "overrides": { "property": "ignore" } }] */
class Foo {
    bar: string;
    baz:string;
    bat :string;
}

interface Foo {
    bar: string;
    baz:string;
    bat :string;
}
```

:::

#### questionMark

Controls spacing around the `?` token of an optional type annotation. The `before` option sets the space before `?`, and the `after` option sets the space between `?` and `:`. If unset, the existing `before`/`after` defaults are kept and a space between `?` and `:` is disallowed.

Examples of **correct** code for this rule with the `{ "overrides": { "questionMark": { "before": true, "after": true } } }` option:

::: correct

```ts
/* eslint @stylistic/type-annotation-spacing: ["error", { "overrides": { "questionMark": { "before": true, "after": true } } }] */

interface Example {
    type ? : string;
}

function example(type ? : string): void {}
```

:::

## When Not To Use It

If you don't want to enforce spacing for your type annotations, you can safely turn this rule off.

## Further Reading

- [TypeScript Type System](https://basarat.gitbooks.io/typescript/docs/types/type-system.html)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
