---
title: space-before-blocks
rule_type: layout
related_rules:
  - keyword-spacing
  - arrow-spacing
  - switch-colon-spacing
  - block-spacing
  - brace-style
---

# space-before-blocks

Consistency is an important part of any style guide.
While it is a personal preference where to put the opening brace of blocks,
it should be consistent across a whole project.
Having an inconsistent style distracts the reader from seeing the important parts of the code.

## Rule Details

This rule will enforce consistency of spacing before blocks. It is only applied on blocks that don’t begin on a new line.

- This rule ignores spacing which is between `=>` and a block. The spacing is handled by the `arrow-spacing` rule.
- This rule ignores spacing which is between a keyword (e.g. `catch`) and a block. The spacing is handled by the `keyword-spacing` rule.
- This rule ignores spacing which is between `:` of a switch case and a block. The spacing is handled by the `switch-colon-spacing` rule.

## Options

This rule takes one argument. If it is `"always"` then blocks must always have at least one preceding space. If `"never"`
then all blocks should never have any preceding space. If different spacing is desired for function
blocks, keyword blocks, classes, interfaces, enums and ts-modules, an optional configuration object can be passed as the rule argument to
configure the cases separately. If any value in the configuration object is `"off"`, then neither style will be enforced for blocks of that kind.

( e.g. `{ "functions": "never", "keywords": "always", "classes": "always", "modules": "always" }` )

The default is `"always"`.

### "always"

Examples of **incorrect** code for this rule with the "always" option:

::: incorrect

```js
/* eslint @stylistic/space-before-blocks: "error" */

if (a){
    b();
}

function a(){}

for (;;){
    b();
}

try {} catch(a){}

class Foo{
  constructor(){}
}

namespace Foo{
  bar: string
}
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/* eslint @stylistic/space-before-blocks: "error" */

if (a) {
    b();
}

if (a) {
    b();
} else{ /*no error. this is checked by `keyword-spacing` rule.*/
    c();
}

class C {
    static{} /*no error. this is checked by `keyword-spacing` rule.*/
}

function a() {}

for (;;) {
    b();
}

try {} catch(a) {}

namespace Foo {
  bar: string
}
```

:::

### "never"

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/* eslint @stylistic/space-before-blocks: ["error", "never"] */

if (a) {
    b();
}

function a() {}

for (;;) {
    b();
}

try {} catch(a) {}

namespace Foo {
  bar: string
}
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/* eslint @stylistic/space-before-blocks: ["error", "never"] */

if (a){
    b();
}

function a(){}

for (;;){
    b();
}

try{} catch(a){}

class Foo{
  constructor(){}
}

namespace Foo{
  bar: string
}
```

:::

Examples of **incorrect** code for this rule when configured `{ "functions": "never", "keywords": "always", "classes": "never", "modules": "always" }`:

::: incorrect

```js
/* eslint @stylistic/space-before-blocks: ["error", { "functions": "never", "keywords": "always", "classes": "never", "modules": "never" }] */

function a() {}

try {} catch(a){}

class Foo {
  constructor() {}
}

namespace Foo {
  bar: string
}
```

:::

Examples of **correct** code for this rule when configured `{ "functions": "never", "keywords": "always", "classes": "never", "modules": "never" }`:

::: correct

```js
/* eslint @stylistic/space-before-blocks: ["error", { "functions": "never", "keywords": "always", "classes": "never", "modules": "never" }] */

for (;;) {
  // ...
}

describe(function(){
  // ...
});

class Foo{
  constructor(){}
}

namespace Foo{
  bar: string
}
```

:::

Examples of **incorrect** code for this rule when configured `{ "functions": "always", "keywords": "never", "classes": "never", "modules": "never" }`:

::: incorrect

```js
/* eslint @stylistic/space-before-blocks: ["error", { "functions": "always", "keywords": "never", "classes": "never", "modules": "never" }] */

function a(){}

try {} catch(a) {}

class Foo {
  constructor(){}
}

namespace Foo {
  bar: string
}
```

:::

Examples of **correct** code for this rule when configured `{ "functions": "always", "keywords": "never", "classes": "never", "modules": "never" }`:

::: correct

```js
/* eslint @stylistic/space-before-blocks: ["error", { "functions": "always", "keywords": "never", "classes": "never", "modules": "never" }] */

if (a){
  b();
}

var a = function() {}

class Foo{
  constructor() {}
}

namespace Foo{
  bar: string
}
```

:::

Examples of **incorrect** code for this rule when configured `{ "functions": "never", "keywords": "never", "classes": "always", "modules": "always" }`:

::: incorrect

```js
/* eslint @stylistic/space-before-blocks: ["error", { "functions": "never", "keywords": "never", "classes": "always", "modules": "always" }] */

class Foo{
  constructor(){}
}

namespace Foo{
  bar: string
}
```

:::

Examples of **correct** code for this rule when configured `{ "functions": "never", "keywords": "never", "classes": "always", "modules": "always" }`:

::: correct

```js
/* eslint @stylistic/space-before-blocks: ["error", { "functions": "never", "keywords": "never", "classes": "always", "modules": "always" }] */

class Foo {
  constructor(){}
}

namespace Foo {
  bar: string
}
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before blocks.
