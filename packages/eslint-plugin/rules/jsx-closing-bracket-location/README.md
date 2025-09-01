# jsx-closing-bracket-location

Enforce the closing bracket location for JSX multiline elements.

## Rule Details

This rule checks all JSX multiline elements and verifies the location of the closing bracket. By default this one must be aligned with the opening tag.

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: "error" */

<Hello
  lastName="Smith"
  firstName="John" />;

<Hello
  lastName="Smith"
  firstName="John"
  />;
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: "error" */

<Hello firstName="John" lastName="Smith" />;

<Hello
  firstName="John"
  lastName="Smith"
/>;
```

:::

## Options

There are two ways to configure this rule.

The first form is a string shortcut corresponding to the `location` values specified below. If omitted, it defaults to `"tag-aligned"`.

```js
"@stylistic/jsx-closing-bracket-location": <enabled> // -> [<enabled>, "tag-aligned"]
"@stylistic/jsx-closing-bracket-location": [<enabled>, "<location>"]
```

The second form allows you to distinguish between non-empty and self-closing tags. Both properties are optional, and both default to `"tag-aligned"`. You can also disable the rule for one particular type of tag by setting the value to `false`.

```js
"@stylistic/jsx-closing-bracket-location": [<enabled>, {
  "nonEmpty": "<location>" || false,
  "selfClosing": "<location>" || false
}]
```

### `location`

Enforced location for the closing bracket.

- `tag-aligned`: must be aligned with the opening tag.
- `line-aligned`: must be aligned with the line containing the opening tag.
- `after-props`: must be placed right after the last prop.
- `props-aligned`: must be aligned with the last prop.

Defaults to `tag-aligned`.

For backward compatibility, you may pass an object `{ "location": <location> }` that is equivalent to the first string shortcut form.

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "tag-aligned"] */

<Hello
  firstName="John"
  lastName="Smith"
  />;

var x = <Hello
  firstName="John"
  lastName="Smith"
/>;

var x = function() {
  return <Say
    firstName="John"
    lastName="Smith"
  >
    Hello
  </Say>;
};
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "line-aligned"] */

<Say
  firstName="John"
  lastName="Smith">
Hello
</Say>;

var x = <Hello
  firstName="John"
  lastName="Smith"
        />;

var x = function() {
  return <Say
    firstName="John"
    lastName="Smith"
         >
    Hello
         </Say>;
};
```

::: incorrect

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "after-props"] */

<Hello
  firstName="John"
  lastName="Smith"
/>;

<Say
  firstName="John"
  lastName="Smith"
>
  Hello
</Say>;
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "props-aligned"] */

<Hello
  firstName="John"
  lastName="Smith"
/>;

<Say
  firstName="John"
  lastName="Smith"
>
  Hello
</Say>;
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "tag-aligned"] */

<Hello
  firstName="John"
  lastName="Smith"
/>;

var x = <Hello
  firstName="John"
  lastName="Smith"
        />;

var x = function() {
  return <Say
    firstName="John"
    lastName="Smith"
         >
    Hello
         </Say>;
};
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "line-aligned"] */

<Say
  firstName="John"
  lastName="Smith"
>
  Hello
</Say>;

var x = <Hello
  firstName="John"
  lastName="Smith"
/>;

var x = function() {
  return <Say
    firstName="John"
    lastName="Smith"
  >
    Hello
  </Say>;
};
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "after-props"] */

<Hello
  firstName="John"
  lastName="Smith" />;

<Say
  firstName="John"
  lastName="Smith">
  Hello
</Say>;
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", "props-aligned"] */

<Hello
  firstName="John"
  lastName="Smith"
  />;

<Say
  firstName="John"
  lastName="Smith"
  >
  Hello
</Say>;
```

:::

::: correct

```jsx
/* eslint @stylistic/jsx-closing-bracket-location: ["error", {selfClosing: 'props-aligned', nonEmpty: 'after-props'}] */

<Hello
  firstName="John"
  lastName="Smith"
  />;

<Say
  firstName="John"
  lastName="Smith">
  Hello
</Say>;
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
