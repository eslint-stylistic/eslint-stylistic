---
related_rules:
  - array-bracket-spacing
  - comma-spacing
  - computed-property-spacing
  - space-in-parens
---

# object-curly-spacing

While formatting preferences are very personal, a number of style guides require
or disallow spaces between curly braces in the following situations:

```js
// simple object literals
var obj = { foo: "bar" };

// nested object literals
var obj = { foo: { zoo: "bar" } };

// destructuring assignment (EcmaScript 6)
var { x, y } = y;

// import/export declarations (EcmaScript 6)
import { foo } from "bar";
export { foo };

// type literals
type Foo = { bar: string };

// interface
interface Foo { bar: string };

// enum
enum Foo { Bar };
```

## Rule Details

This rule enforces consistent spacing inside braces of object literals, destructuring assignments, and import/export specifiers.

## Options

This rule has two options, a string option and an object option.

String option:

- `"never"` (default) disallows spacing inside of braces
- `"always"` requires spacing inside of braces (except `{}`)

Object option:

- `"arraysInObjects": true` requires spacing inside of braces of objects beginning and/or ending with an array element (applies when the first option is set to `never`)
- `"arraysInObjects": false` disallows spacing inside of braces of objects beginning and/or ending with an array element (applies when the first option is set to `always`)
- `"objectsInObjects": true` requires spacing inside of braces of objects beginning and/or ending with an object element (applies when the first option is set to `never`)
- `"objectsInObjects": false` disallows spacing inside of braces of objects beginning and/or ending with an object element (applies when the first option is set to `always`)
- `"overrides"` allows overriding spacing style for specified nodes:
  - `ObjectPattern` - object patterns of destructuring assignments
  - `ObjectExpression` - object literals
  - `ImportDeclaration` - named imports
  - `ImportAttributes` - import/export attributes
  - `ExportNamedDeclaration` - named exports
  - `ExportAllDeclaration` - re-export declarations
  - `TSMappedType` - mapped types
  - `TSTypeLiteral` - type literals
  - `TSInterfaceBody` - interface declaration bodies
  - `TSEnumBody` - enum declaration bodies
- `"emptyObject"` allows you to control the space in empty object.
  - `"spaceInEmptyArray": "ignore"`(default) ignores the spaces in empty object.
  - `"emptyObject": "always"` require one space in empty object.
  - `"emptyObject": "never"` disallow space in empty object.

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

::: incorrect

```js
/* eslint @stylistic/object-curly-spacing: ["error", "never"] */

var obj = { 'foo': 'bar' };
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux'}, bar};
var {x } = y;
import { foo } from 'bar';
export { foo };
type Foo = { bar: string };
interface Foo { bar: string };
enum Foo { Bar };
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "never"] */

var obj = {'foo': 'bar'};
var obj = {'foo': {'bar': 'baz'}, 'qux': 'quxx'};
var obj = {
  'foo': 'bar'
};
var obj = {'foo': 'bar'
};
var obj = {
  'foo':'bar'};
var obj = {};
var {x} = y;
import {foo} from 'bar';
export {foo};
type Foo = {bar: string};
interface Foo {bar: string};
enum Foo {Bar};
```

:::

### always

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/* eslint @stylistic/object-curly-spacing: ["error", "always"] */

var obj = {'foo': 'bar'};
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux' }, bar};
var obj = {'foo': 'bar'
};
var obj = {
  'foo':'bar'};
var {x} = y;
import {foo } from 'bar';
export {foo };
type Foo = {bar: string };
interface Foo {bar: string };
enum Foo {Bar };
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "always"] */

var obj = {};
var obj = { 'foo': 'bar' };
var obj = { 'foo': { 'bar': 'baz' }, 'qux': 'quxx' };
var obj = {
  'foo': 'bar'
};
var { x } = y;
import { foo } from 'bar';
export { foo };
type Foo = { bar: string };
interface Foo { bar: string };
enum Foo { Bar };
```

:::

#### arraysInObjects

Examples of additional **correct** code for this rule with the `"never", { "arraysInObjects": true }` options:

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "never", { "arraysInObjects": true }] */

var obj = {"foo": [ 1, 2 ] };
var obj = {"foo": [ "baz", "bar" ] };
```

:::

Examples of additional **correct** code for this rule with the `"always", { "arraysInObjects": false }` options:

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "always", { "arraysInObjects": false }] */

var obj = { "foo": [ 1, 2 ]};
var obj = { "foo": [ "baz", "bar" ]};
```

:::

#### objectsInObjects

Examples of additional **correct** code for this rule with the `"never", { "objectsInObjects": true }` options:

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "never", { "objectsInObjects": true }] */

var obj = {"foo": {"baz": 1, "bar": 2} };
```

:::

Examples of additional **correct** code for this rule with the `"always", { "objectsInObjects": false }` options:

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "always", { "objectsInObjects": false }] */

var obj = { "foo": { "baz": 1, "bar": 2 }};
```

:::

#### overrides

Examples of additional **correct** code for this rule with the `"always", { "overrides": { ImportAttributes: "never" } }` options:

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "always", { "overrides": { ImportAttributes: "never" } }] */

import { name, version } from 'package.json' with {type: 'json'}
```

:::

#### emptyObject

Examples of additional **correct** code for this rule with the `"always", { emptyObject: "never" }` options:

::: incorrect

```js
/* eslint @stylistic/object-curly-spacing: ["error", "always", { emptyObject: "never" }] */

var obj = { }
interface Bar { }
enum Foo { }
```

:::

::: correct

```js
/* eslint @stylistic/object-curly-spacing: ["error", "always", { emptyObject: "never" }] */

var obj = {}
interface Bar {}
enum Foo {}
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between curly braces.
