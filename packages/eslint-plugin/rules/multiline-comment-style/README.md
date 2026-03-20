---
---

# multiline-comment-style

Many style guides require a particular style for comments that span multiple lines. For example, some style guides prefer the use of a single block comment for multiline comments, whereas other style guides prefer consecutive line comments.

## Rule Details

This rule aims to enforce a particular style for multiline comments.

Other than regular JavaScript comments, the following types of comments are recognized by this rule:

1. **[JSDoc comments](https://jsdoc.app/)**

   These are comments which start with a `/**` sequence. They are used to explain the functionality of functions, classes, methods, and other code elements, making the code self-documenting.

   Example:

   ```js
   /**
    * Represents a book.
    * @constructor
    * @param {string} title - The title of the book.
    * @param {string} author - The author of the book.
    */
   ```

2. **Exclamation comments**

   These are comments which start with a `/*!` sequence. They are conventionally used in JavaScript to indicate a _preserved comment_ or _important comment_. An exclamation comment signals its consumer that the comment should be preserved during processing.

   Exclamation comments are often used for including copyright information, attribution, or other important metadata that needs to remain in the code.

   Example:

   ```js
   /*!
    * My JavaScript Library
    * Copyright (c) 2025 John Doe
    *
    * Licensed under the MIT license.
    */
   ```

3. **Directive comments**

   These are special comments that convey instructions or metadata to tools like linters, compilers (e.g., TypeScript), or build systems. They are not standard JavaScript comments meant for human readability, but rather specific syntax understood by particular tools to alter their behavior.

   Example:

   ```js
   // @ts-ignore
   or
   /* eslint-disable */
   ```

## Options

This rule has a string option, which can have one of the following values:

- `"starred-block"` (default): Disallows consecutive line comments in favor of block comments. Additionally, requires block comments to have an aligned `*` character before each line.
- `"bare-block"`: Disallows consecutive line comments in favor of block comments, and disallows block comments from having a `"*"` character before each line. This option ignores JSDoc and Exclamation comments.
- `"separate-lines"`: Disallows block comments in favor of consecutive line comments. By default, this option ignores JSDoc and Exclamation comments. To also apply this rule to JSDoc comments and or Exclamation comments, set the `checkJSDoc` and or `checkExclamation` option to `true`.

The rule always ignores directive comments such as `/* eslint-disable */`.

### starred-block

Examples of **incorrect** code for this rule with the default `"starred-block"` option:

::: incorrect

```js

/* eslint @stylistic/multiline-comment-style: ["error", "starred-block"] */

// this line
// calls foo()
foo();

/* this line
calls foo() */
foo();

/* this comment
 * is missing a newline after /*
 */

/*
 * this comment
 * is missing a newline at the end */

/*
* the star in this line should have a space before it
 */

/*
 * the star on the following line should have a space before it
*/

```

:::

Examples of **correct** code for this rule with the default `"starred-block"` option:

::: correct

```js
/* eslint @stylistic/multiline-comment-style: ["error", "starred-block"] */

/*
 * this line
 * calls foo()
 */
foo();

// single-line comment
```

:::

### bare-block

Examples of **incorrect** code for this rule with the `"bare-block"` option:

::: incorrect

```js
/* eslint @stylistic/multiline-comment-style: ["error", "bare-block"] */

// this line
// calls foo()
foo();

/*
 * this line
 * calls foo()
 */
foo();
```

:::

Examples of **correct** code for this rule with the `"bare-block"` option:

::: correct

```js
/* eslint @stylistic/multiline-comment-style: ["error", "bare-block"] */

/* this line
   calls foo() */
foo();
```

:::

### separate-lines

Examples of **incorrect** code for this rule with the `"separate-lines"` option:

::: incorrect

```js

/* eslint @stylistic/multiline-comment-style: ["error", "separate-lines"] */

/* This line
calls foo() */
foo();

/*
 * This line
 * calls foo()
 */
foo();

```

:::

Examples of **correct** code for this rule with the `"separate-lines"` option:

::: correct

```js
/* eslint @stylistic/multiline-comment-style: ["error", "separate-lines"] */

// This line
// calls foo()
foo();

```

:::

### checkJSDoc

Examples of **incorrect** code for this rule with the `"separate-lines"` option and `checkJSDoc` set to `true`:

::: incorrect

```js

/* eslint @stylistic/multiline-comment-style: ["error", "separate-lines", { "checkJSDoc": true }] */

/**
 * I am a JSDoc comment
 * and I'm not allowed
 */
foo();

```

:::

Examples of **correct** code for this rule with the `"separate-lines"` option and `checkJSDoc` set to `true`:

::: correct

```js
/* eslint @stylistic/multiline-comment-style: ["error", "separate-lines", { "checkJSDoc": true }] */

// I am a JSDoc comment
// and I'm not allowed
foo();

```

:::

### checkExclamation

Examples of **incorrect** code for this rule with the `"separate-lines"` option and `checkExclamation` set to `true`:

::: incorrect

```js

/* eslint @stylistic/multiline-comment-style: ["error", "separate-lines", { "checkExclamation": true }] */

/*!
 * I am an exclamation comment
 * and I'm not allowed
 */
foo();

```

:::

## When Not To Use It

If you don't want to enforce a particular style for multiline comments, you can disable the rule.
