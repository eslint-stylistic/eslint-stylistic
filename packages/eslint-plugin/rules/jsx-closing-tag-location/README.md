# jsx/jsx-closing-tag-location

Enforce the closing tag location for multiline JSX elements.

## Rule Details

This rule checks all JSX multiline elements with children (non-self-closing) and verifies the location of the closing tag. The expectation is that the closing tag is aligned with the opening tag on its own line.

Examples of **incorrect** code for this rule:

```jsx
<Hello>
  marklar
  </Hello>
```

```jsx
<Hello>
  marklar</Hello>
```

Examples of **correct** code for this rule:

```jsx
<Hello>
  marklar
</Hello>
```

```jsx
<Hello>marklar</Hello>
```

## Rule Options

There is one way to configure this rule.

The first form is a string shortcut corresponding to the `location` values specified below. If omitted, it defaults to `"tag-aligned"`.

```json
{
  "@stylistic/jsx/jsx-closing-tag-location": ["error", "tag-aligned"]
}
```

### `location`

Enforced location for the closing tag.

- `tag-aligned`: must be aligned with the opening tag.
- `line-aligned`: must be aligned with the line containing the opening tag.

Defaults to `tag-aligned`.

Examples of **incorrect** code for this rule:

```jsx
// 'jsx-closing-tag-location': 1
// 'jsx-closing-tag-location': [1, 'tag-aligned']
<Say
  firstName="John"
  lastName="Smith">
  Hello
  </Say>;

// 'jsx-closing-tag-location': [1, 'tag-aligned']
const App = <Bar>
  Foo
</Bar>;

// 'jsx-closing-tag-location': [1, 'line-aligned']
const App = <Bar>
  Foo
            </Bar>;
```

Examples of **correct** code for this rule:

```jsx
// 'jsx-closing-tag-location': 1
// 'jsx-closing-tag-location': [1, 'tag-aligned']
<Say
  firstName="John"
  lastName="Smith">
  Hello
</Say>;

// 'jsx-closing-tag-location': [1, 'tag-aligned']
const App = <Bar>
  Foo
            </Bar>;

// 'jsx-closing-tag-location': [1, 'line-aligned']
const App = <Bar>
  Foo
</Bar>;
```

## When Not To Use It

If you do not care about closing tag JSX alignment then you can disable this rule.
