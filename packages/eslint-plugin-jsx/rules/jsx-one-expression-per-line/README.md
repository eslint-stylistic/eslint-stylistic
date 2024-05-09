# jsx/jsx-one-expression-per-line

Require one JSX element per line.

Note: The fixer will insert line breaks between any expression that are on the same line.

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect

```jsx
/* eslint @stylistic/jsx-one-expression-per-line: "error" */

<App><Hello /></App>

<App><Hello />
</App>

<App>
  <Hello>
  </Hello></App>

<App>
  <Hello /> World
</App>

<App>
  <Hello /> { 'World' }
</App>

<App>
  <Hello /> { this.world() }
</App>

<App>
  { 'Hello' }{ ' ' }{ 'World' }
</App>

<App
  foo
><Hello />
</App>

<App><Hello
  foo
/>
</App>

<App><Hello1 />
     <Hello2 />
     <Hello3 />
</App>
```

Examples of **correct** code for this rule:

::: correct

```jsx
<App>
  <Hello />
</App>

<App>
  <Hello>
  </Hello>
</App>

<App>
  <Hello />
  World
</App>

<App>
  <Hello />
  { 'World' }
</App>

<App>
  <Hello />
  { this.world() }
</App>

<App>
  { 'Hello' }
  { ' ' }
  { 'World' }
</App>

<App
  foo
>
  <Hello />
</App>

<App>
  <Hello
    foo
  />
</App>

<App>
  <Hello1 />
  <Hello2 />
  <Hello3 />
</App>
```

## Rule Options

```js
...
"@stylistic/jsx/jsx-one-expression-per-line": [<enabled>, { "allow": "none"|"literal"|"single-child" }]
...
```

### `allow`

Defaults to `none`.

Examples of **correct** code for this rule, when configured as `"literal"`:

```jsx
<App>Hello</App>
```

Examples of **correct** code for this rule, when configured as `"single-child"`:

```jsx
<App>Hello</App>

<App>{"Hello"}</App>

<App><Hello /></App>
```

Examples of **correct** code for this rule, when configured as `"single-line"`:

```jsx
<App>Hello <span>ESLint</span></App>

<App>{"Hello"} {"ESLint"}</App>

<App>
  <Hello /> <ESLint />
</App>
```
