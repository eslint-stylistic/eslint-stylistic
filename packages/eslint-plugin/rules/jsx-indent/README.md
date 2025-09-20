# jsx-indent

> **Deprecated**: Use [`indent`](https://eslint.style/rules/default/indent) instead, as it fully covers all test cases from this rule.

Enforce JSX indentation.

Note: The fixer will fix whitespace and tabs indentation.

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent: "error" */

const app = <App>
  <Hello />
</App>;

const app = <App>
<Hello />
</App>;

const app = <App>
	<Hello />
</App>;
```

:::

## Options

It takes an option as the second parameter which can be `"tab"` for tab-based indentation or a positive number for space indentations.
To enable checking the indentation of attributes or add indentation to logical expressions, use the third parameter to turn on the `checkAttributes` (default is false) and `indentLogicalExpressions` (default is false) respectively.

```js
...
"@stylistic/jsx-indent": [<enabled>, 'tab'|<number>, {checkAttributes: <boolean>, indentLogicalExpressions: <boolean>}]
...
```

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent: ["error", 2] */

<App>
    <Hello />
</App>
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent: ["error", "tab"] */

<App>
  <Hello />
</App>
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent: ["error", 2, {checkAttributes: true}] */

<App render={
  <Hello render={
    (bar) => <div>hi</div>
}
  />
  }>
</App>
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent: ["error", 2, {indentLogicalExpressions: true}] */

<App>
  {condition && (
  <Hello />
  )}
</App>
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-indent: ["error", 2] */

<App>
  <Hello />
</App>
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent: ["error", "tab"] */

<App>
	<Hello />
</App>
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent: ["error", 0] */

<App>
<Hello />
</App>
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent: ["error", 2, {checkAttributes: false}] */

<App render={
  <Hello render={
    (bar) => <div>hi</div>
}
  />
  }>
</App>
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent: ["error", 2, {indentLogicalExpressions: true}] */

<App>
  {condition && (
    <Hello />
  )}
</App>
```

:::

## When Not To Use It

If you are not using JSX then you can disable this rule.
