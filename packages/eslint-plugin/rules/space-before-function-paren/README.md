---
title: space-before-function-paren
rule_type: layout
related_rules:
  - keyword-spacing
---

# space-before-function-paren

When formatting a function, whitespace is allowed between the function name or `function` keyword and the opening paren. Named functions also require a space between the `function` keyword and the function name, but anonymous functions require no whitespace. For example:

```js
function withoutSpace(x) {
    // ...
}

function withSpace (x) {
    // ...
}

var anonymousWithoutSpace = function() {};

var anonymousWithSpace = function () {};
```

Style guides may require a space after the `function` keyword for anonymous functions, while others specify no whitespace. Similarly, the space after a function name may or may not be required.

## Rule Details

This rule aims to enforce consistent spacing before function parentheses and as such, will warn whenever whitespace doesn't match the preferences specified.

## Options

This rule has a string option or an object option:

```js
{
    "space-before-function-paren": ["error", "always"],
    // or
    "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "always",
        "asyncArrow": "always",
        "catch": "always"
    }],
}
```

- `always` (default) requires a space followed by the `(` of arguments.
- `never` disallows any space followed by the `(` of arguments.

You can also use a separate option for each type of function.
Each of the following options can be set to `"always"`, `"never"`, or `"ignore"`. The default is `"always"`.

- `anonymous` is for anonymous function expressions (e.g. `function () {}`).
- `named` is for named function expressions (e.g. `function foo () {}`).
- `asyncArrow` is for async arrow function expressions (e.g. `async () => {}`).
- `catch` is for catch clause with params (e.g. `catch (e) {}`).

### "always"

Examples of **incorrect** code for this rule with the default `"always"` option:

::: incorrect

```js
/* eslint @stylistic/space-before-function-paren: "error" */

function foo() {
    // ...
}

var bar = function() {
    // ...
};

var bar = function foo() {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var baz = {
    bar() {
        // ...
    }
};

var baz = async() => 1

try {
    // ...
} catch(e) {
    // ...
}
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

::: correct

```js
/* eslint @stylistic/space-before-function-paren: "error" */

function foo () {
    // ...
}

var bar = function () {
    // ...
};

var bar = function foo () {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var baz = {
    bar () {
        // ...
    }
};

var baz = async () => 1

try {
    // ...
} catch (e) {
    // ...
}
```

:::

### "never"

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/* eslint @stylistic/space-before-function-paren: ["error", "never"] */

function foo () {
    // ...
}

var bar = function () {
    // ...
};

var bar = function foo () {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var baz = {
    bar () {
        // ...
    }
};

var baz = async () => 1

try {
    // ...
} catch (e) {
    // ...
}
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/* eslint @stylistic/space-before-function-paren: ["error", "never"] */

function foo() {
    // ...
}

var bar = function() {
    // ...
};

var bar = function foo() {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var baz = {
    bar() {
        // ...
    }
};

var baz = async() => 1

try {
    // ...
} catch(e) {
    // ...
}
```

:::

### `{"anonymous": "always", "named": "never", "asyncArrow": "always", "catch": "always"}`

Examples of **incorrect** code for this rule with the `{"anonymous": "always", "named": "never", "asyncArrow": "always", "catch": "always"}` option:

::: incorrect

```js
/* eslint @stylistic/space-before-function-paren: ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always", "catch": "always"}] */

function foo () {
    // ...
}

var bar = function() {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var baz = {
    bar () {
        // ...
    }
};

var baz = async(a) => await a

try {
    // ...
} catch(e) {
    // ...
}
```

:::

Examples of **correct** code for this rule with the `{"anonymous": "always", "named": "never", "asyncArrow": "always", "catch": "always"}` option:

::: correct

```js
/* eslint @stylistic/space-before-function-paren: ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always", "catch": "always"}] */

function foo() {
    // ...
}

var bar = function () {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var baz = {
    bar() {
        // ...
    }
};

var baz = async (a) => await a

try {
    // ...
} catch (e) {
    // ...
}
```

:::

### `{"anonymous": "never", "named": "always", "catch": "never"}`

Examples of **incorrect** code for this rule with the `{"anonymous": "never", "named": "always", "catch": "never"}` option:

::: incorrect

```js
/* eslint @stylistic/space-before-function-paren: ["error", { "anonymous": "never", "named": "always", "catch": "never" }] */

function foo() {
    // ...
}

var bar = function () {
    // ...
};

class Foo {
    constructor() {
        // ...
    }
}

var baz = {
    bar() {
        // ...
    }
};

try {
    // ...
} catch (e) {
    // ...
}
```

:::

Examples of **correct** code for this rule with the `{"anonymous": "never", "named": "always", "catch": "never"}` option:

::: correct

```js
/* eslint @stylistic/space-before-function-paren: ["error", { "anonymous": "never", "named": "always", "catch": "never" }] */

function foo () {
    // ...
}

var bar = function() {
    // ...
};

class Foo {
    constructor () {
        // ...
    }
}

var baz = {
    bar () {
        // ...
    }
};

try {
    // ...
} catch(e) {
    // ...
}
```

:::

### `{"anonymous": "ignore", "named": "always", "catch": "never"}`

Examples of **incorrect** code for this rule with the `{"anonymous": "ignore", "named": "always", "catch": "never"}` option:

::: incorrect

```js
/* eslint @stylistic/space-before-function-paren: ["error", { "anonymous": "ignore", "named": "always", "catch": "never" }] */

function foo() {
    // ...
}

class Foo {
    constructor() {
        // ...
    }
}

var baz = {
    bar() {
        // ...
    }
};

try {
    // ...
} catch (e) {
    // ...
}
```

:::

Examples of **correct** code for this rule with the `{"anonymous": "ignore", "named": "always", "catch": "never"}` option:

::: correct

```js
/* eslint @stylistic/space-before-function-paren: ["error", { "anonymous": "ignore", "named": "always", "catch": "never" }] */

var bar = function() {
    // ...
};

var bar = function () {
    // ...
};

function foo () {
    // ...
}

class Foo {
    constructor () {
        // ...
    }
}

var baz = {
    bar () {
        // ...
    }
};

try {
    // ...
} catch(e) {
    // ...
}
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing before function parenthesis.
