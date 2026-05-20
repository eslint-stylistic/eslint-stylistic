# jsx-shorthand-fragment

Enforce shorthand fragment syntax.

## Rule Details

When using React fragments, the shorthand syntax `<>...</>` should be preferred over `<Fragment>...</Fragment>` or `<React.Fragment>...</React.Fragment>` when no props (such as `key`) are needed.

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-shorthand-fragment: "error" */

<Fragment><div /></Fragment>;

<React.Fragment><span /><span /></React.Fragment>;
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-shorthand-fragment: "error" */

<><div /></>;

<><span /><span /></>;

// Fragment with key prop is allowed
<Fragment key={id}><div /></Fragment>;

<React.Fragment key={id}><div /></React.Fragment>;
```

:::

## Options

This rule has no options.
