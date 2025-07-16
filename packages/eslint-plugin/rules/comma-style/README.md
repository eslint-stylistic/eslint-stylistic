---
title: comma-style
rule_type: layout
related_rules:
  - operator-linebreak
further_reading:
  - 'https://gist.github.com/isaacs/357981'
---

# comma-style

The Comma Style rule enforces styles for comma-separated lists. There are two comma styles primarily used in JavaScript:

- The standard style, in which commas are placed at the end of the current line
- Comma First style, in which commas are placed at the start of the next line

One of the justifications for using Comma First style is that it can help track missing and trailing commas. These are problematic because missing commas in variable declarations can lead to the leakage of global variables and trailing commas can lead to errors in older versions of IE.

## Rule Details

This rule enforce consistent comma style in array literals, object literals, and variable declarations.

This rule does not apply in either of the following cases:

- comma preceded and followed by linebreak (lone comma)
- single-line array literals, object literals, and variable declarations

## Options

This rule has a string option:

- `"last"` (default) requires a comma after and on the same line as an array element, object property, or variable declaration
- `"first"` requires a comma before and on the same line as an array element, object property, or variable declaration

This rule also accepts an additional `exceptions` object:

- `"exceptions"` has properties whose names correspond to node types in the abstract syntax tree (AST) of JavaScript code:
  - `"ArrayExpression": true` ignores comma style in array literals
  - `"ArrayPattern": true` ignores comma style in array patterns of destructuring
  - `"ArrowFunctionExpression": true` ignores comma style in the parameters of arrow function expressions
  - `"CallExpression": true` ignores comma style in the arguments of function calls
  - `"FunctionDeclaration": true` ignores comma style in the parameters of function declarations
  - `"FunctionExpression": true` ignores comma style in the parameters of function expressions
  - `"ImportDeclaration": true` ignores comma style in the specifiers / import attributes of import declarations
  - `"ObjectExpression": true` ignores comma style in object literals
  - `"ObjectPattern": true` ignores comma style in object patterns of destructuring
  - `"VariableDeclaration": true` ignores comma style in variable declarations
  - `"NewExpression": true` ignores comma style in the parameters of constructor expressions
  - `"ExportAllDeclaration": true` ignores comma style in the import attributes of export all declarations
  - `"ExportNamedDeclaration": true` ignores comma style in the specifiers / import attributes of export named declarations
  - `"ImportExpression": true` ignores comma style in the arguments of import expressions
  - `"SequenceExpression": true` ignores comma style in sequence expressions
  - `"ClassDeclaration": true` ignores comma style in the TypeScript implements of class declarations
  - `"ClassExpression": true` ignores comma style in the TypeScript implements of class declarations
  - `"TSDeclareFunction": true` ignores comma style in the parameters of TypeScript declare functions
  - `"TSFunctionType": true` ignores comma style in the parameters of TypeScript function types
  - `"TSConstructorType": true` ignores comma style in the parameters of TypeScript constructor types
  - `"TSEmptyBodyFunctionExpression": true` ignores comma style in the parameters of TypeScript empty body function expressions
  - `"TSMethodSignature": true` ignores comma style in the parameters of TypeScript method signatures
  - `"TSCallSignatureDeclaration": true` ignores comma style in the parameters of TypeScript call signature declarations
  - `"TSConstructSignatureDeclaration": true` ignores comma style in the parameters of TypeScript construct signature declarations
  - `"TSEnumBody": true` ignores comma style in the members of TypeScript enums
  - `"TSTypeLiteral": true` ignores comma style in the members of TypeScript type literals
  - `"TSInterfaceBody": true` ignores comma style in the members of TypeScript interfaces
  - `"TSIndexSignature": true` ignores comma style in the key parameters of TypeScript index signatures
  - `"TSInterfaceDeclaration": true` ignores comma style in the extend classes of TypeScript interfaces
  - `"TSTupleType": true` ignores comma style in the elements of TypeScript tuple types
  - `"TSTypeParameterDeclaration": true` ignores comma style in the type parameters of TypeScript type parameter declarations
  - `"TSTypeParameterInstantiation": true` ignores comma style in the type arguments of TypeScript type parameter instantiations

A way to determine the node types as defined by [ESTree](https://github.com/estree/estree) and [@typescript-eslint/parser](https://typescript-eslint.io/packages/parser/) is to use [AST Explorer](https://ast-explorer.dev/) with the espree parser or @typescript-eslint/parser.

### last

Examples of **incorrect** code for this rule with the default `"last"` option:

:::incorrect

```js
/* eslint @stylistic/comma-style: ["error", "last"] */

var foo = 1
,
bar = 2;

var foo = 1
  , bar = 2;

var foo = ["apples"
           , "oranges"];

function baz() {
    return {
        "a": 1
        ,"b:": 2
    };
}
```

:::

Examples of **correct** code for this rule with the default `"last"` option:

:::correct

```js
/* eslint @stylistic/comma-style: ["error", "last"] */

var foo = 1, bar = 2;

var foo = 1,
    bar = 2;

var foo = ["apples",
           "oranges"];

function baz() {
    return {
        "a": 1,
        "b:": 2
    };
}
```

:::

### first

Examples of **incorrect** code for this rule with the `"first"` option:

:::incorrect

```js
/* eslint @stylistic/comma-style: ["error", "first"] */

var foo = 1,
    bar = 2;

var foo = ["apples",
           "oranges"];

function baz() {
    return {
        "a": 1,
        "b:": 2
    };
}
```

:::

Examples of **correct** code for this rule with the `"first"` option:

:::correct

```js
/* eslint @stylistic/comma-style: ["error", "first"] */

var foo = 1, bar = 2;

var foo = 1
    ,bar = 2;

var foo = ["apples"
          ,"oranges"];

function baz() {
    return {
        "a": 1
        ,"b:": 2
    };
}
```

:::

### exceptions

An example use case is to enforce comma style _only_ in var statements.

Examples of **incorrect** code for this rule with sample `"first", { "exceptions": { … } }` options:

:::incorrect

```js
/* eslint @stylistic/comma-style: ["error", "first", { "exceptions": { "ArrayExpression": true, "ObjectExpression": true } }] */

var o = {},
    a = [];
```

:::

Examples of **correct** code for this rule with sample `"first", { "exceptions": { … } }` options:

:::correct

```js
/* eslint @stylistic/comma-style: ["error", "first", { "exceptions": { "ArrayExpression": true, "ObjectExpression": true } }] */

var o = {fst:1,
         snd: [1,
               2]}
  , a = [];
```

:::

## When Not To Use It

This rule can safely be turned off if your project does not care about enforcing a consistent comma style.
