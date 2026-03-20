# jsx-newline

Require or prevent a new line after jsx elements and expressions

## Rule Details

This is a stylistic rule intended to make JSX code more readable by requiring or preventing lines between adjacent JSX elements and expressions.

## Options

```json5
...
"@stylistic/jsx-newline": [<enabled>, { "prevent": <boolean>, "allowMultilines": <boolean> }]
...
```

- enabled: for enabling the rule. 0=off, 1=warn, 2=error. Defaults to 0.
- prevent: optional boolean. If `true` prevents empty lines between adjacent JSX elements and expressions. Defaults to `false`.
- allowMultilines: optional boolean. If `true` and `prevent` is also equal to `true`, it allows newlines after multiline JSX elements and expressions. Defaults to `false`.

### prevent

Examples of **incorrect** code for this rule, when configured with `{ "prevent": false }`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-newline: ["error", { "prevent": false }] */

<div>
  <Button>{data.label}</Button>
  <List />
</div>;

<div>
  <Button>{data.label}</Button>
  {showSomething === true && <Something />}
</div>;

<div>
  {showSomething === true && <Something />}
  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>;
```

:::

Examples of **correct** code for this rule, when configured with `{ "prevent": false }`:

::: correct

```jsx
/* eslint @stylistic/jsx-newline: ["error", { "prevent": false }] */

<div>
  <Button>{data.label}</Button>

  <List />

  <Button>
    <IconPreview />
    Button 2

    <span></span>
  </Button>

  {showSomething === true && <Something />}

  <Button>Button 3</Button>

  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>
```

:::

Examples of **incorrect** code for this rule, when configured with `{ "prevent": true }`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-newline: ["error", { "prevent": true }] */

<div>
  <Button>{data.label}</Button>

  <List />

  <Button>
    <IconPreview />
    Button 2

    <span></span>
  </Button>

  {showSomething === true && <Something />}

  <Button>Button 3</Button>

  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>
```

:::

Examples of **correct** code for this rule, when configured with `{ "prevent": true }`:

::: correct

```jsx
/* eslint @stylistic/jsx-newline: ["error", { "prevent": true }] */

<div>
  <Button>{data.label}</Button>
  <List />
</div>;

<div>
  <Button>{data.label}</Button>
  {showSomething === true && <Something />}
</div>;

<div>
  {showSomething === true && <Something />}
  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>;
```

:::

### allowMultilines

Examples of **incorrect** code for this rule, when configured with `{ "prevent": true, "allowMultilines": true }`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-newline: ["error", { "prevent": true, "allowMultilines": true }] */

<div>
  {showSomething === true && <Something />}

  <Button>Button 3</Button>
  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>
```

:::

Examples of **correct** code for this rule, when configured with `{ "prevent": true, "allowMultilines": true }`:

::: correct

```jsx
/* eslint @stylistic/jsx-newline: ["error", { "prevent": true, "allowMultilines": true }] */

<div>
  {showSomething === true && <Something />}

  <Button>
    Button 3
  </Button>

  {showSomethingElse === true ? (
    <SomethingElse />
  ) : (
    <ErrorMessage />
  )}
</div>
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with spacing between your JSX elements and expressions.
