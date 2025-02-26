# jsx/jsx-function-call-newline

Enforce line breaks before and after JSX elements when they are used as arguments to a function.

## Rule Details

This rule checks whether a line break is needed before and after all JSX elements that serve as function arguments. There are the possible configurations:

- `always`: Each JSX element as an argument has a line break before and after it.
- `multiline`(default): Only line break are added before and after a JSX element when there is a newline present within the element itself.

Examples of **incorrect** code for this rule, when configured with `"always"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-function-call-newline: ["error", "always"] */

fn(<div />)

fn(<span>foo</span>)

fn(<span>
bar
</span>)

fn(<div />, <div
  style={{ color: 'red' }}
  />, <p>baz</p>)
```

Examples of **correct** code for this rule, when configured with `"always"`:

::: correct

```jsx
/* eslint @stylistic/jsx-function-call-newline: ["error", "always"] */

fn(
  <div />
)

fn(
  <span>foo</span>
)
fn(
  <span>
    bar
  </span>
)

fn(
  <div />,
  <div
    style={{ color: 'red' }}
  />,
  <p>baz</p>
)
```

Examples of **incorrect** code for this rule, when configured with `"multiline"`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-function-call-newline: ["error", "multiline"] */

fn(<div
 />, <span>
 foo</span>
)

fn (
  <div />, <span>
    bar
  </span>
)
```

Examples of **correct** code for this rule, when configured with `"multiline"`:

::: correct

```jsx
/* eslint @stylistic/jsx-function-call-newline: ["error", "multiline"] */

fn(<div />)

fn(<span>foo</span>)

fn(
  <div
 />,
 <span>
 foo</span>
)

fn (
  <div />,
  <span>
    bar
  </span>
)
```

## Rule Options

```jsx
"@stylistic/jsx/jsx-function-call-newline": "always" | "multiline"
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
