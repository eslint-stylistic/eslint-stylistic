---
related_rules:
  - jsx-max-props-per-line
  - jsx-first-prop-new-line
  - list-style
---

# jsx-props-style

Enforce consistent line break styles for JSX props.

## Rule Details

This rule checks the line break style of JSX props based on the first prop's position. If the first prop is on the same line as the opening tag, all props should be on the same line. If the first prop is on a new line, all props should be on separate lines.

## Options

This rule accepts an object option:

- [`"singleLine"`](#singleline): Options for when the JSX element is single-line
  - [`"maxItems"`](#maxitems): Maximum number of props allowed before auto-fixing to multi-line
- [`"multiLine"`](#multiline): Options for when the JSX element is multi-line
  - [`"minItems"`](#minitems): Minimum number of props required before auto-fixing to multi-line

The default configuration of this rule is:

<<< ./jsx-props-style.ts#defaultOptions

### singleLine

#### maxItems

Examples of **incorrect** code for this rule with the `"maxItems"` option:

::: incorrect

```jsx
/* eslint @stylistic/exp-jsx-props-style: ["error", { "singleLine": { "maxItems": 1 } }] */

<App foo bar />;
<App foo bar baz />;
<App foo {...props} />;
```

:::

Examples of **correct** code for this rule with the `"maxItems"` option:

::: correct

```jsx
/* eslint @stylistic/exp-jsx-props-style: ["error", { "singleLine": { "maxItems": 1 } }] */

<App foo />;
<App
  foo
  bar
/>;
<App
  foo
  bar
  baz
/>;
```

:::

### multiLine

#### minItems

Examples of **incorrect** code for this rule with the `"minItems"` option:

::: incorrect

```jsx
/* eslint @stylistic/exp-jsx-props-style: ["error", { "multiLine": { "minItems": 3 } }] */

<App
  foo
  bar
/>
```

:::

Examples of **correct** code for this rule with the `"minItems"` option:

::: correct

```jsx
/* eslint @stylistic/exp-jsx-props-style: ["error", { "multiLine": { "minItems": 3 } }] */

<App foo bar />;
<App
  foo
  bar
  baz
/>;
```

:::

## When Not To Use It

If you do not want to enforce consistent line break styles for JSX props, you can safely disable this rule.
