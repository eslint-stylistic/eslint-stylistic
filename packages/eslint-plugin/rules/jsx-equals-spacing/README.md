# jsx-equals-spacing

Enforce or disallow spaces around equal signs in JSX attributes.

## Rule Details

This rule will enforce consistency of spacing around equal signs in JSX attributes, by requiring or disallowing one or more spaces before and after `=`.

## Rule Options

There are two options for the rule:

- `"always"` enforces spaces around the equal sign
- `"never"` disallows spaces around the equal sign (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"@stylistic/jsx-equals-spacing": [2, "always"]
```

### never

Examples of **incorrect** code for this rule, when configured with `"never"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-equals-spacing: ["error", "never"] */

<Hello name = {firstname} />;
<Hello name ={firstname} />;
<Hello name= {firstname} />;
```

:::

Examples of **correct** code for this rule, when configured with `"never"`:

::: correct

```jsx
/* eslint @stylistic/jsx-equals-spacing: ["error", "never"] */

<Hello name={firstname} />;
<Hello name />;
<Hello {...props} />;
```

:::

### always

Examples of **incorrect** code for this rule, when configured with `"always"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-equals-spacing: ["error", "always"] */

<Hello name={firstname} />;
<Hello name ={firstname} />;
<Hello name= {firstname} />;
```

:::

Examples of **correct** code for this rule, when configured with `"always"`:

::: correct

```jsx
/* eslint @stylistic/jsx-equals-spacing: ["error", "always"] */

<Hello name = {firstname} />;
<Hello name />;
<Hello {...props} />;
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing around equal signs in JSX attributes.
