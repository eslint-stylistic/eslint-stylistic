---
related_rules:
  - array-bracket-spacing
  - array-bracket-newline
  - array-element-newline
  - function-call-argument-newline
  - function-paren-newline
  - object-curly-newline
  - object-curly-spacing
  - object-property-newline
  - jsx-function-call-newline
---

# list-style

Enforce consistent spacing and line break styles inside brackets.

## Rule Details

This rule requires or disallows a line break between object/array/named imports/exports and function parameters and other similar structures.

It check the newline style of the first property or item and apply the same style to the rest of the properties or items. This allows you to easily wrap or unwrap your code consistently.

## Options

This rule accepts an object option:

- [`"singleLine"`](#singleline): Options for when the node is single-line
  - [`"spacing"`](#spacing): Whether spaces are required inside the enclosing brackets
  - [`"maxItems"`](#maxitems): Maximum number of elements allowed before auto-fixing to multi-line
- [`"multiLine"`](#multiline): Options for when the node is multi-line
  - [`"minItems"`](#minitems): Minimum number of elements allowed before auto-fixing to single-line
- [`"overrides"`](#overrides): Override options based on bracket type or node type

The default configuration of this rule is:

<<< ./list-style.ts#defaultOptions

### singleLine

#### spacing

"always" requires spaces, "never" disallows spaces.

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```ts
/* eslint @stylistic/exp-list-style: ["error", { "singleLine": { "spacing": "always" } }] */

let foo = {a: 1, b: 2};
let bar = [1, 2];
let {a, b} = foo;
let [c, d] = bar;
function foo(a) {}
const foo = function (a) {}
foo(a, b);
new Foo<Bar>(a, b);
import {name} from 'package.json' with {type: 'json'}
export {name} from 'package.json' with {type: 'json'}
export * from 'package.json' with {type: 'json'}
type Foo<T> = {a: number; b: T};
type Bar = [1, 2];
type Baz<T> = (a: number, b: T) => void
function foo<T>(a: number, b: T): void;
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```ts
/* eslint @stylistic/exp-list-style: ["error", { "singleLine": { "spacing": "always" } }] */

let foo = { a: 1, b: 2 };
let bar = [ 1, 2 ];
let { a, b } = foo;
let [ c, d ] = bar;
function foo( a ) {}
const foo = function ( a ) {}
foo( a, b );
new Foo< Bar >( a, b );
import { name } from 'package.json' with { type: 'json' }
export { name } from 'package.json' with { type: 'json' }
export * from 'package.json' with { type: 'json' }
type Foo< T > = { a: number; b: T };
type Bar = [ 1, 2 ];
type Baz< T > = ( a: number, b: T ) => void
function foo< T >( a: number, b: T ): void;
```

:::

#### maxItems

Examples of **incorrect** code for this rule with the `"maxItems"` option:

::: incorrect

```ts
/* eslint @stylistic/exp-list-style: ["error", { "singleLine": { "maxItems": 1 } }] */

let foo = {a: 1, b: 2};
let bar = [1, 2];
let {a, b} = foo;
let [a, b] = bar;
```

:::

Examples of **correct** code for this rule with the `"maxItems"` option:

::: correct

```ts
/* eslint @stylistic/exp-list-style: ["error", { "singleLine": { "maxItems": 1 } }] */

let foo = {
  a: 1,
  b: 2
};
let bar = [
  1,
  2
];
let {
  a,
  b
} = foo;
let [
  a,
  b
] = bar;
```

:::

### multiLine

#### minItems

Examples of **incorrect** code for this rule with the `"minItems"` option:

::: incorrect

```ts
/* eslint @stylistic/exp-list-style: ["error", { "multiLine": { "minItems": 3 } }] */

let foo = {
  a: 1,
  b: 2,
};
let bar = [
  1,
  2,
];
let {
  a,
  b,
} = foo;
let [
  a,
  b,
] = bar;
```

:::

Examples of **correct** code for this rule with the `"minItems"` option:

::: correct

```ts
/* eslint @stylistic/exp-list-style: ["error", { "multiLine": { "minItems": 1 } }] */

let foo = {
  a: 1,
  b: 2,
};
let bar = [
  1,
  2,
];
let {
  a,
  b
} = foo;
let [
  a,
  b
] = bar;
```

:::

### overrides

You can specify different options for specific bracket types:

- `{}` - curly braces (objects)
- `[]` - square brackets (arrays)
- `()` - parentheses (function calls, parameters)
- `<>` - angle brackets (TypeScript generics)

Examples of correct code for this rule with the "overrides" option specified for brackets:

::: correct

```js
/* eslint @stylistic/exp-list-style: ["error", { "overrides": { "{}": { "singleLine": { "spacing": "always" } } } }] */

let foo = { a: 1 };
let bar = [1];
let { a } = foo;
let [b] = bar;
```

:::

You can also specify different options for various node types:

- `ArrayExpression`: arrays expressions
- `ArrayPattern`: array patterns of destructuring assignments
- `ArrowFunctionExpression`: parameters of arrow function declarations
- `CallExpression`: parameters of call expressions
- `ExportNamedDeclaration`: named exports
- `FunctionDeclaration`: parameters of function declarations
- `FunctionExpression`: parameters of function expressions
- `IfStatement`: condition of if statements
- `ImportDeclaration`: named imports
- `ImportAttributes`: import attributes
- `NewExpression`: parameters of new expressions
- `ObjectExpression`: object literals
- `ObjectPattern`: object patterns of destructuring assignments
- `TSDeclareFunction`: parameters of function type declarations
- `TSFunctionType`: parameters of arrow function type declarations
- `TSInterfaceBody`: interfaces declarations
- `TSEnumBody`: enum declarations
- `TSTupleType`: tuple types
- `TSTypeLiteral`: type literals
- `TSTypeParameterDeclaration`: type parameter declarations
- `TSTypeParameterInstantiation`: type parameter instantiations
- `JSONArrayExpression`: arrays expressions in JSON files
- `JSONObjectExpression`: object literals in JSON files

Example of node-specific override:

::: correct

```js
/* eslint @stylistic/exp-list-style: ["error", {
  "overrides": {
    "ImportAttributes": { "singleLine": { "spacing": "never" } },
  }
}] */

import def, { a, b } from 'foo' with {type: 'raw'};

let foo = { a: 1 };
let bar = [1];
let { a } = foo;
let [b] = bar;
```

:::

You can also set an override to `"off"` to disable checking for a specific bracket type or node type:

::: correct

```js
/* eslint @stylistic/exp-list-style: ["error", {
  "overrides": {
    "IfStatement": "off",
  }
}] */

if (node.callee.type !== 'Identifier'
  || (node.callee.name !== 't' && node.callee.name !== 'n')
) {
  // ...
}
```

:::

## When Not To Use It

If you do not want to enforce consistent line breaks after opening and before closing brackets, or if your project has existing inconsistent formatting that you don't wish to change, you can safely disable this rule.
