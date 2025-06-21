# jsx-props-no-multi-spaces

Disallow multiple spaces between inline JSX props.

Enforces that there is exactly one space between all attributes and after tag name and the first attribute in the same line.

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-props-no-multi-spaces: "error" */

<App  spacy />;

<App too  spacy />;

<App
  prop1='abc'

  prop2='def' />;
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-props-no-multi-spaces: "error" */

<App cozy />;

<App very cozy />;

<App
  prop1='abc'
  prop2='def' />;
```

:::

## When Not To Use It

If you are not using JSX or don't care about the space between two props in the same line.

If you have enabled the core rule `no-multi-spaces` with eslint >= 3, you don't need this rule.
