---
related_rules:
  - arrow-parens
  - no-cond-assign
  - no-return-assign
further_reading:
  - 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence'
---

# no-extra-parens

This rule restricts the use of parentheses to only where they are necessary.

## Rule Details

This rule always ignores extra parentheses around the following:

- RegExp literals such as `(/abc/).test(var)` to avoid conflicts with the [wrap-regex](wrap-regex) rule
- immediately-invoked function expressions (also known as IIFEs) such as `var x = (function () {})();` and `var x = (function () {}());` to avoid conflicts with the [wrap-iife](wrap-iife) rule
- arrow function arguments to avoid conflicts with the [arrow-parens](arrow-parens) rule

Problems reported by this rule can be fixed automatically, except when removing the parentheses would create a new directive, because that could change the semantics of the code.
For example, the following script prints `object` to the console, but if the parentheses around `"use strict"` were removed, it would print `undefined` instead.

```js
<!--
// this is a script
// -->

("use strict");

function test() {
    console.log(typeof this);
}

test();
```

In this case, the rule will not try to remove the parentheses around `"use strict"` but will still report them as a problem.

## Options

This rule has a string option:

- [`"all"`](#all) (default) disallows unnecessary parentheses around _any_ expression
- [`"functions"`](#functions) disallows unnecessary parentheses _only_ around function expressions

This rule has an object option for exceptions to the `"all"` option:

- [`"conditionalAssign": false`](#conditionalassign) allows extra parentheses around assignments in conditional test expressions
- [`"returnAssign": false`](#returnassign) allows extra parentheses around assignments in `return` statements
- [`"nestedBinaryExpressions": false`](#nestedbinaryexpressions) allows extra parentheses in nested binary expressions
- [`"ternaryOperandBinaryExpressions": false`](#ternaryoperandbinaryexpressions) allows extra parentheses around binary expressions that are operands of ternary `?:`
- [`"ignoreJSX": "none|all|multi-line|single-line"`](#ignorejsx) allows extra parentheses around no/all/multi-line/single-line JSX components. Defaults to `none`.
- [`"enforceForArrowConditionals": false`](#enforceforarrowconditionals-deprecated) **(deprecated)** allows extra parentheses around ternary expressions which are the body of an arrow function
- [`"enforceForSequenceExpressions": false`](#enforceforsequenceexpressions) allows extra parentheses around sequence expressions
- [`"enforceForNewInMemberExpressions": false`](#enforcefornewinmemberexpressions-deprecated) **(deprecated)** allows extra parentheses around `new` expressions in member expressions
- [`"enforceForFunctionPrototypeMethods": false`](#enforceforfunctionprototypemethods) allows extra parentheses around immediate `.call` and `.apply` method calls on function expressions and around function expressions in the same context.
- [`"allowParensAfterCommentPattern": "any-string-pattern"`](#allowparensaftercommentpattern) allows extra parentheses preceded by a comment that matches a regular expression.
- [`"nestedConditionalExpressions": false`](#nestedconditionalexpressions) allows extra parentheses in nested conditional(ternary) expressions
- [`"allowNodesInSpreadElement"`](#allownodesinspreadelement-deprecated) **(deprecated)** object has properties whose names correspond to node types in the abstract syntax tree (AST) of JavaScript code. Allows extra parentheses to be added to these nodes within the spread syntax
  - `"ConditionalExpression": true`
  - `"LogicalExpression": true`
  - `"AwaitExpression": true`
- [`"ignoredNodes": []`](#ignorednodes) can be used to allow extra parentheses around any AST node. This accepts an array of [selectors](https://eslint.org/docs/latest/extend/selectors). If an AST node is matched by any of the selectors, the parentheses of tokens which are around that node will be ignored. This can be used as an escape hatch to relax the rule.

### all

Examples of **incorrect** code for this rule with the default `"all"` option:

::: incorrect

```js
/* eslint @stylistic/no-extra-parens: "error" */

a = (b * c);

(a * b) + c;

for (a in (b, c));

for (a in (b));

for (a of (b));

typeof (a);

(Object.prototype.toString.call());

class A {
    [(x)] = 1;
}

class B {
    x = (y + z);
}
```

:::

Examples of **correct** code for this rule with the default `"all"` option:

::: correct

```js
/* eslint @stylistic/no-extra-parens: "error" */

(0).toString();

({}.toString.call());

(function(){}) ? a() : b();

(/^a$/).test(x);

for (a of (b, c));

for (a of b);

for (a in b, c);

for (a in b);

class A {
    [x] = 1;
}

class B {
    x = y + z;
}
```

:::

#### conditionalAssign

Examples of **correct** code for this rule with the `"all"` and `{ "conditionalAssign": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "conditionalAssign": false }] */

while ((foo = bar())) {}

if ((foo = bar())) {}

do; while ((foo = bar()))

for (;(a = b););
```

:::

#### returnAssign

Examples of **correct** code for this rule with the `"all"` and `{ "returnAssign": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "returnAssign": false }] */

function a1(b) {
  return (b = 1);
}

function a2(b) {
  return b ? (c = d) : (c = e);
}

b => (b = 1);

b => b ? (c = d) : (c = e);
```

:::

#### nestedBinaryExpressions

Examples of **correct** code for this rule with the `"all"` and `{ "nestedBinaryExpressions": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "nestedBinaryExpressions": false }] */

x = a || (b && c);
x = a + (b * c);
x = (a * b) / c;
```

:::

#### ternaryOperandBinaryExpressions

Examples of **correct** code for this rule with the `"all"` and `{ "ternaryOperandBinaryExpressions": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "ternaryOperandBinaryExpressions": false }] */

(a && b) ? foo : bar;

(a - b > a) ? foo : bar;

foo ? (bar || baz) : qux;

foo ? bar : (baz || qux);
```

:::

#### ignoreJSX

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "all" }` options:

::: correct { "ecmaFeatures": { "jsx": true } }

```jsx
/* eslint @stylistic/no-extra-parens: ["error", "all", { ignoreJSX: "all" }] */
const ThisComponent = (<div />)
const ThatComponent = (
    <div
        prop={true}
    />
)
```

:::

Examples of **incorrect** code for this rule with the `all` and `{ "ignoreJSX": "multi-line" }` options:

::: incorrect { "ecmaFeatures": { "jsx": true } }

```jsx
/* eslint @stylistic/no-extra-parens: ["error", "all", { ignoreJSX: "multi-line" }] */
const ThisComponent = (<div />)
const ThatComponent = (<div><p /></div>)
```

:::

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "multi-line" }` options:

::: correct { "ecmaFeatures": { "jsx": true } }

```jsx
/* eslint @stylistic/no-extra-parens: ["error", "all", { ignoreJSX: "multi-line" }] */
const ThisComponent = (
    <div>
        <p />
    </div>
)
const ThatComponent = (
    <div
        prop={true}
    />
)
```

:::

Examples of **incorrect** code for this rule with the `all` and `{ "ignoreJSX": "single-line" }` options:

::: incorrect { "ecmaFeatures": { "jsx": true } }

```jsx
/* eslint @stylistic/no-extra-parens: ["error", "all", { ignoreJSX: "single-line" }] */
const ThisComponent = (
    <div>
        <p />
    </div>
)
const ThatComponent = (
    <div
        prop={true}
    />
)
```

:::

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "single-line" }` options:

::: correct { "ecmaFeatures": { "jsx": true } }

```jsx
/* eslint @stylistic/no-extra-parens: ["error", "all", { ignoreJSX: "single-line" }] */
const ThisComponent = (<div />)
const ThatComponent = (<div><p /></div>)
```

:::

#### enforceForArrowConditionals (deprecated)

This option is deprecated, please use [`ignoredNodes`](#ignorednodes) instead.

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForArrowConditionals": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "enforceForArrowConditionals": false }] */

const b = a => 1 ? 2 : 3;
const d = c => (1 ? 2 : 3);
```

:::

#### enforceForSequenceExpressions

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForSequenceExpressions": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "enforceForSequenceExpressions": false }] */

(a, b);

if ((val = foo(), val < 10)) {}

while ((val = foo(), val < 10));
```

:::

#### enforceForNewInMemberExpressions (deprecated)

This option is deprecated, please use [`ignoredNodes`](#ignorednodes) instead.

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForNewInMemberExpressions": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "enforceForNewInMemberExpressions": false }] */

const foo = (new Bar()).baz;

const quux = (new Bar())[baz];

(new Bar()).doSomething();
```

:::

#### enforceForFunctionPrototypeMethods

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForFunctionPrototypeMethods": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "enforceForFunctionPrototypeMethods": false }] */

const foo = (function () {}).call();

const bar = (function () {}).apply();

const baz = (function () {}.call());

const quux = (function () {}.apply());
```

:::

#### allowParensAfterCommentPattern

To make this rule allow extra parentheses preceded by specific comments, set this option to a string pattern that will be passed to the [`RegExp` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp).

Examples of **correct** code for this rule with the `"all"` and `{ "allowParensAfterCommentPattern": "@type" }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "allowParensAfterCommentPattern": "@type" }] */

const span = /**@type {HTMLSpanElement}*/(event.currentTarget);

if (/** @type {Foo | Bar} */(options).baz) console.log('Lint free');

foo(/** @type {Bar} */ (bar), options, {
    name: "name",
    path: "path",
});

if (foo) {
    /** @type {Bar} */
    (bar).prop = false;
}
```

:::

#### nestedConditionalExpressions

Examples of **correct** code for this rule with the `"all"` and `{ "nestedConditionalExpressions": false }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "nestedConditionalExpressions": false }] */

a ? (b ? c : d) : e;
a ? b : (c ? d : e);
```

:::

#### allowNodesInSpreadElement (deprecated)

This option is deprecated, please use [`ignoredNodes`](#ignorednodes) instead.

Examples of **correct** code for this rule with the `"all"` and `{ "allowNodesInSpreadElement": { LogicalExpression: true, ConditionalExpression: true } }` options:

::: correct

```js
/* eslint @stylistic/no-extra-parens: [
    "error",
    "all",
    { "allowNodesInSpreadElement": { LogicalExpression: true, ConditionalExpression: true } }
 ] */

const x = [
    ...a ? [1, 2, 3] : [],
    ...(a ? [1, 2, 3] : []),
]

const fruits = {
    ...isSummer && { watermelon: 30 },
    ...(isSummer && { watermelon: 30 }),
};
```

:::

#### ignoredNodes

The following configuration ignores `ConditionalExpression` in `ArrowFunctionExpression` nodes like [`enforceForArrowConditionals`](#enforceforarrowconditionals-deprecated):

Examples of **correct** code for this rule with the `"all", { "ignoredNodes": ["ArrowFunctionExpression[body.type=ConditionalExpression]"] }` option:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "ignoredNodes": ["ArrowFunctionExpression[body.type=ConditionalExpression]"] }] */

const b = a => 1 ? 2 : 3;
const d = c => (1 ? 2 : 3);
```

:::

The following configuration ignores `NewExpression` in `MemberExpression` nodes like [`enforceForNewInMemberExpressions`](#enforcefornewinmemberexpressions-deprecated):

Examples of **correct** code for this rule with the `"all", { "ignoredNodes": ["MemberExpression[object.type=NewExpression]"] }` option:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "ignoredNodes": ["MemberExpression[object.type=NewExpression]"] }] */

const foo = (new Bar()).baz;

const quux = (new Bar())[baz];

(new Bar()).doSomething();
```

:::

The following configuration ignores `LogicalExpression`, `ConditionalExpression` in `SpreadElement` nodes like [`allowNodesInSpreadElement`](#allownodesinspreadelement-deprecated):

Examples of **correct** code for this rule with the `"all", { "ignoredNodes": ["SpreadElement[argument.type=ConditionalExpression]", "SpreadElement[argument.type=LogicalExpression]", "SpreadElement[argument.type=AwaitExpression]"] }` option:

::: correct

```js
/* eslint @stylistic/no-extra-parens: [
    "error",
    "all",
    {
        "ignoredNodes": [
            "SpreadElement[argument.type=ConditionalExpression]",
            "SpreadElement[argument.type=LogicalExpression]",
            "SpreadElement[argument.type=AwaitExpression]",
        ]
    }
 ] */

const x = [
    ...a ? [1, 2, 3] : [],
    ...(a ? [1, 2, 3] : []),
]

const fruits = {
    ...isSummer && { watermelon: 30 },
    ...(isSummer && { watermelon: 30 }),
};

async function example() {
    const promiseArray = Promise.resolve([1, 2, 3]);
    console.log(...(await promiseArray));
}
```

:::

The following configuration ignores init in `VariableDeclarator` nodes:

Examples of **correct** code for this rule with the `"all", { "ignoredNodes": ["VariableDeclarator[init]"] }` option:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", { "ignoredNodes": ["VariableDeclarator[init]"] }] */

const a = (
    b &&
    c &&
    d
)

const foo = (
    bar
    .filter((item) => !!item)
    .join('')
)
```

:::

The following configuration ignores parens around a `TSIntersectionType` as the typeAnnotation of a `TSTypeAliasDeclaration`.

Examples of **correct** code for this rule with the `"all", { "ignoredNodes": ["TSTypeAliasDeclaration[typeAnnotation.type=TSIntersectionType]"] }` option:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "all", {
    "ignoredNodes": ["TSTypeAliasDeclaration[typeAnnotation.type=TSIntersectionType]"]
}] */

type TBar = (
    First
    & Second
    & Third
)
```

:::

All AST node types can be found at [ESTree](https://github.com/estree/estree) specification. You can use [AST Explorer](https://ast-explorer.dev/) with the `espree` or `@typescript-eslint/parser` to examine AST tree of a code snippet.

### functions

Examples of **incorrect** code for this rule with the `"functions"` option:

::: incorrect

```js
/* eslint @stylistic/no-extra-parens: ["error", "functions"] */

((function foo() {}))();

var y = (function () {return 1;});
```

:::

Examples of **correct** code for this rule with the `"functions"` option:

::: correct

```js
/* eslint @stylistic/no-extra-parens: ["error", "functions"] */

(0).toString();

(Object.prototype.toString.call());

({}.toString.call());

(function(){} ? a() : b());

(/^a$/).test(x);

a = (b * c);

(a * b) + c;

typeof (a);
```

:::
