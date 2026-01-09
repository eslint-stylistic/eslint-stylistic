---
---

# no-trailing-spaces

Sometimes in the course of editing files, you can end up with extra whitespace at the end of lines. These whitespace differences can be picked up by source control systems and flagged as diffs, causing frustration for developers. While this extra whitespace causes no functional issues, many code conventions require that trailing spaces be removed before check-in.

## Rule Details

This rule disallows trailing whitespace (spaces, tabs, and other Unicode whitespace characters) at the end of lines.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint @stylistic/no-trailing-spaces: "error" */

var foo = 0; 
var baz = 5;  
  
⏎
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint @stylistic/no-trailing-spaces: "error" */

var foo = 0;
var baz = 5;
```

:::

## Options

This rule has an object option:

- `"skipBlankLines": false` (default) disallows trailing whitespace on empty lines
- `"skipBlankLines": true` allows trailing whitespace on empty lines
- `"ignoreComments": false` (default) disallows trailing whitespace in comment blocks
- `"ignoreComments": true` allows trailing whitespace in comment blocks
- `"ignoreMarkdownLineBreaks": "never"` (default) disallows all trailing whitespace
- `"ignoreMarkdownLineBreaks": "always"` allows exactly two trailing spaces when followed by a non-empty line (markdown line break syntax). Use this for `.md` files.
- `"ignoreMarkdownLineBreaks": "comments"` allows exactly two trailing spaces only in comments when followed by a non-empty line. Use this for JSDoc and other documentation comments in `.js`/`.ts` files.

### skipBlankLines

Examples of **correct** code for this rule with the `{ "skipBlankLines": true }` option:

::: correct

```js
/* eslint @stylistic/no-trailing-spaces: ["error", { "skipBlankLines": true }] */

var foo = 0;
var baz = 5;
// ↓ a line with whitespace only ↓
  
// ↑ a line with whitespace only ↑
```

:::

### ignoreComments

Examples of **correct** code for this rule with the `{ "ignoreComments": true }` option:

::: correct

```js
/* eslint @stylistic/no-trailing-spaces: ["error", { "ignoreComments": true }] */

// ↓ these comments have trailing whitespace →
//
/**
 * baz   
 *   
 * bar   
 */
```

:::

### ignoreMarkdownLineBreaks

This option allows exactly two trailing spaces when followed by a non-empty line, which is the markdown syntax for a hard line break (`<br>`).

- `"never"` (default): No markdown line breaks allowed
- `"always"`: Allow everywhere (for `.md` files)
- `"comments"`: Only allow in comments (for JSDoc in `.js`/`.ts` files)

Examples of **correct** code for this rule with the `{ "ignoreMarkdownLineBreaks": "comments" }` option:

::: correct

```js
/* eslint @stylistic/no-trailing-spaces: ["error", { "ignoreMarkdownLineBreaks": "comments" }] */

/**
 * First line of description  
 * continues on second line  
 * and third line
 */
function foo() {}
```

:::

Examples of **incorrect** code for this rule with the `{ "ignoreMarkdownLineBreaks": "comments" }` option:

::: incorrect

```js
/* eslint @stylistic/no-trailing-spaces: ["error", { "ignoreMarkdownLineBreaks": "comments" }] */

// Two trailing spaces in code are still invalid:
var x = 1;  

/**
 * Trailing spaces before empty line  
 *
 * Three spaces are invalid   
 * Single space is invalid 
 * Two spaces before end of comment  
 */
```

:::

Examples of **correct** code for this rule with the `{ "ignoreMarkdownLineBreaks": "always" }` option (for `.md` files):

::: correct

```md
/* eslint @stylistic/no-trailing-spaces: ["error", { "ignoreMarkdownLineBreaks": "always" }] */

First line of paragraph  
continues on second line  
and third line
```

:::
