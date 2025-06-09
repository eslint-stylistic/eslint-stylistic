# jsx-indent-props

Enforce props indentation in JSX.

## Rule Details

This rule is aimed to enforce consistent indentation style. The default style is `4 spaces`.

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent-props: "error" */

<Hello
  firstName="John"
/>;

<Hello
firstName="John"
/>;

<Hello
	firstName="John"
/>;
```

:::

## Rule Options

It takes an option as the second parameter which can either be the indent mode or an object to define further settings.
The indent mode can be `"tab"` for tab-based indentation, a positive number for space indentations or `"first"` for aligning the first prop for each line with the tag's first prop.
Note that using the `"first"` option allows very inconsistent indentation unless you also enable a rule that enforces the position of the first prop.
If the second parameter is an object, it can be used to specify the indent mode as well as the option `ignoreTernaryOperator`, which causes the indent level not to be increased by a `?` or `:` operator (default is `false`).

```js
...
"@stylistic/jsx-indent-props": [<enabled>, 'tab'|<number>|'first'|<object>]
...
```

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", 2] */

<Hello
    firstName="John"
/>
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", "tab"] */

<Hello
  firstName="John"
/>
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", "first"] */

<Hello
  firstName="John"
    lastName="Doe"
/>
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", 2] */

<Hello
  firstName="John"
/>;

<Hello
  firstName="John" />;
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", "tab"] */

<Hello
	firstName="John"
/>
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", 0] */

<Hello
firstName="John"
/>
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", "first"] */

<Hello
  firstName="John"
  lastName="Doe"
/>;

<Hello
       firstName="John"
       lastName="Doe"
/>;

<Hello firstName="Jane"
       lastName="Doe" />;
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", 2] */

true
? <Hello
    firstName="John"
    lastName="Doe"
  />
: <Hello />;
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-indent-props: ["error", { indentMode: 2, ignoreTernaryOperator: true }] */
true
? <Hello
  firstName="John"
  lastName="Doe"
/>
: <Hello />;
```

:::

## When Not To Use It

If you are not using JSX then you can disable this rule.
