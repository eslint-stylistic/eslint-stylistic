# jsx-shorthand-boolean

Enforce shorthand for boolean JSX attributes.

## Rule Details

When a JSX attribute is set to `{true}`, the value can be omitted entirely as the presence of the attribute implies `true`.

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-shorthand-boolean: "error" */

<div disabled={true} />;

<input readOnly={true} />;
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-shorthand-boolean: "error" */

<div disabled />;

<input readOnly />;

<div disabled={false} />;

<div disabled={variable} />;

<div disabled={condition ? true : false} />;
```

:::

## Options

This rule has no options.
