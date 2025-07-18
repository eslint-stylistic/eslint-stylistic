# jsx-first-prop-new-line

Enforce proper position of the first property in JSX.

## Rule Details

This rule checks whether the first property of all JSX elements is correctly placed. There are the possible configurations:

- `always`: The first property should always be placed on a new line.
- `never` : The first property should never be placed on a new line, e.g. should always be on the same line as the Component opening tag.
- `multiline`: The first property should always be placed on a new line when the JSX tag takes up multiple lines.
- `multiprop`: The first property should never be placed on a new line unless there are multiple properties.
- `multiline-multiprop`: The first property should always be placed on a new line if the JSX tag takes up multiple lines and there are multiple properties. This is the `default` value.

Examples of **incorrect** code for this rule, when configured with `"always"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "always"] */

<Hello personal={true} />;

<Hello personal={true}
    foo="bar"
/>;
```

:::

Examples of **correct** code for this rule, when configured with `"always"`:

::: correct

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "always"] */

<Hello
    personal />;

<Hello
    personal
/>;
```

:::

Examples of **incorrect** code for this rule, when configured with `"never"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "never"] */

<Hello
    personal />;

<Hello
    personal
/>;
```

:::

Examples of **correct** code for this rule, when configured with `"never"`:

::: correct

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "never"] */

<Hello personal={true} />;

<Hello personal={true}
    foo="bar"
/>;
```

:::

Examples of **incorrect** code for this rule, when configured with `"multiline"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "multiline"] */

<Hello personal
    prop />;

<Hello foo={{
}} />;
```

:::

Examples of **correct** code for this rule, when configured with `"multiline"`:

::: correct

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "multiline"] */

<Hello personal={true} />;

<Hello
    personal={true}
    foo="bar"
/>;
```

:::

Examples of **incorrect** code for this rule, when configured with `"multiline-multiprop"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "multiline-multiprop"] */

<Hello foo={{
    }}
    bar />;
```

:::

Examples of **correct** code for this rule, when configured with `"multiline-multiprop"`:

::: correct

```jsx
/* eslint @stylistic/jsx-first-prop-new-line: ["error", "multiline-multiprop"] */

<Hello foo={{
}} />;

<Hello
    foo={{
    }}
    bar
/>;
```

:::

## Rule Options

```jsx
"@stylistic/jsx-first-prop-new-line": `"always" | "never" | "multiline" | "multiprop" | "multiline-multiprop"`
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
