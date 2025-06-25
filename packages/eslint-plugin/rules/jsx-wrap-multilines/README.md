# jsx-wrap-multilines

Disallow missing parentheses around multiline JSX.

Wrapping multiline JSX in parentheses can improve readability and/or convenience.

## Rule Details

This rule optionally takes a second parameter in the form of an object, containing places to apply the rule. By default, all the syntax listed below will be checked except the conditions out of declaration or assignment, logical expressions and JSX attributes, but these can be explicitly disabled. Any syntax type missing in the object will follow the default behavior displayed below.

```json
{
  "declaration": "parens",
  "assignment": "parens",
  "return": "parens",
  "arrow": "parens",
  "condition": "ignore",
  "logical": "ignore",
  "prop": "ignore",
  "propertyValue": "ignore"
}
```

Note: conditions are checked by default in declarations or assignments.

## Rule Options

Examples of **incorrect** code for this rule, when configured with `parens` or `parens-new-line`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", {
  "declaration": "parens",
  "assignment": "parens",
  "return": "parens",
  "arrow": "parens",
  "condition": "ignore",
  "logical": "ignore",
  "prop": "ignore",
  "propertyValue": "ignore"
}] */

var Hello = createReactClass({
  render: function() {
    return <div>
      <p>Hello {this.props.name}</p>
    </div>;
  }
});
```

:::

Examples of **incorrect** code for this rule, when configured with `parens-new-line`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", {
  "declaration": "parens-new-line",
  "assignment": "parens-new-line",
  "return": "parens-new-line",
  "arrow": "parens-new-line",
  "condition": "ignore",
  "logical": "ignore",
  "prop": "ignore",
  "propertyValue": "ignore"
}] */

var Hello = createReactClass({
  render: function() {
    return (<div>
      <p>Hello {this.props.name}</p>
    </div>);
  }
});
```

:::

Examples of **correct** code for this rule:

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: "error" */

var singleLineJSX = <p>Hello</p>

var Hello = createReactClass({
  render: function() {
    return (
      <div>
        <p>Hello {this.props.name}</p>
      </div>
    );
  }
});
```

:::

### `declaration`

Examples of **incorrect** code for this rule, when configured with `{ declaration: "parens" }`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { declaration: "parens" }] */

var hello = <div>
  <p>Hello</p>
</div>;
```

Examples of **correct** code for this rule, when configured with `{ declaration: "parens" }`:

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { declaration: "parens" }] */

var hello = (
  <div>
    <p>Hello</p>
  </div>
);

var hello = (<div>
  <p>Hello</p>
</div>);
```

:::

Examples of **incorrect** code for this rule, when configured with `{ declaration: "parens-new-line" }`:

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { declaration: "parens-new-line" }] */

var hello = <div>
  <p>Hello</p>
</div>;
```

:::

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { declaration: "parens-new-line" }] */

var hello = (<div>
  <p>Hello</p>
</div>);
```

:::

Examples of **correct** code for this rule, when configured with `{ declaration: "parens-new-line" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { declaration: "parens-new-line" }] */

var hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

:::

### `assignment`

Examples of **incorrect** code for this rule, when configured with `{ assignment: "parens" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { assignment: "parens" }] */

var hello;
hello = <div>
  <p>Hello</p>
</div>;
```

:::

Examples of **correct** code for this rule, when configured with `{ assignment: "parens" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { assignment: "parens" }] */

var hello;
hello = (
  <div>
    <p>Hello</p>
  </div>
);

var hello;
hello = (<div>
  <p>Hello</p>
</div>);
```

:::

Examples of **incorrect** code for this rule, when configured with `{ assignment: "parens-new-line" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { assignment: "parens-new-line" }] */

var hello;
hello = <div>
  <p>Hello</p>
</div>;

var hello;
hello = (<div>
  <p>Hello</p>
</div>);
```

:::

Examples of **correct** code for this rule, when configured with `{ assignment: "parens-new-line" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { assignment: "parens-new-line" }] */

var hello;
hello = (
  <div>
    <p>Hello</p>
  </div>
);
```

:::

### `return`

Examples of **incorrect** code for this rule, when configured with `{ return: "parens" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { return: "parens" }] */

function hello() {
  return <div>
    <p>Hello</p>
  </div>;
}
```

:::

Examples of **correct** code for this rule, when configured with `{ return: "parens" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { return: "parens" }] */

function hello() {
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}

function hello() {
  return (<div>
    <p>Hello</p>
  </div>);
}
```

:::

Examples of **incorrect** code for this rule, when configured with `{ return: "parens-new-line" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { return: "parens-new-line" }] */

function hello() {
  return <div>
    <p>Hello</p>
  </div>;
}

function hello() {
  return (<div>
    <p>Hello</p>
  </div>);
}
```

:::

Examples of **correct** code for this rule, when configured with `{ return: "parens-new-line" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { return: "parens-new-line" }] */

function hello() {
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}
```

:::

### `arrow`

Examples of **incorrect** code for this rule, when configured with `{ arrow: "parens" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { arrow: "parens" }] */

var hello = () => <div>
  <p>World</p>
</div>;
```

:::

Examples of **correct** code for this rule, when configured `{ arrow: "parens" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { arrow: "parens" }] */

var hello = () => (
  <div>
    <p>World</p>
  </div>
);

var hello = () => (<div>
  <p>World</p>
</div>);
```

:::

Examples of **incorrect** code for this rule, when configured with `{ arrow: "parens-new-line" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { arrow: "parens-new-line" }] */

var hello = () => <div>
  <p>World</p>
</div>;

var hello = () => (<div>
  <p>World</p>
</div>);
```

:::

Examples of **correct** code for this rule, when configured with `{ arrow: "parens-new-line" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { arrow: "parens-new-line" }] */

var hello = () => (
  <div>
    <p>World</p>
  </div>
);
```

:::

### `condition`

Examples of **incorrect** code for this rule, when configured with `{ condition: "parens" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { condition: "parens" }] */

<div>
  {foo ? <div>
      <p>Hello</p>
    </div> : null}
</div>
```

:::

Examples of **correct** code for this rule, when configured with `{ condition: "parens" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { condition: "parens" }] */

<div>
  {foo ? (<div>
      <p>Hello</p>
  </div>) : null}
</div>;

<div>
  {foo ? (
    <div>
      <p>Hello</p>
    </div>
  ): null}
</div>;
```

:::

Examples of **incorrect** code for this rule, when configured with `{ condition: "parens-new-line" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { condition: "parens-new-line" }] */

<div>
  {foo ? <div>
      <p>Hello</p>
    </div> : null}
</div>;

<div>
  {foo ? (<div>
      <p>Hello</p>
  </div>) : null}
</div>;
```

:::

Examples of **correct** code for this rule, when configured with `{ condition: "parens-new-line" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { condition: "parens-new-line" }] */

<div>
  {foo ? (
    <div>
      <p>Hello</p>
    </div>
  ): null}
</div>
```

:::

### `logical`

Examples of **incorrect** code for this rule, when configured with `{ logical: "parens" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { logical: "parens" }] */

<div>
  {foo &&
    <div>
      <p>Hello World</p>
    </div>
  }
</div>
```

:::

Examples of **correct** code for this rule, when configured with `{ logical: "parens" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { logical: "parens" }] */

<div>
  {foo &&
    (<div>
      <p>Hello World</p>
    </div>)
  }
</div>;

<div>
  {foo && (
    <div>
      <p>Hello World</p>
    </div>
  )}
</div>;
```

:::

Examples of **incorrect** code for this rule, when configured with `{ logical: "parens-new-line" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { logical: "parens-new-line" }] */

<div>
  {foo &&
    <div>
      <p>Hello World</p>
    </div>
  }
</div>;

<div>
  {foo &&
    (<div>
      <p>Hello World</p>
    </div>)
  }
</div>;
```

:::

Examples of **correct** code for this rule, when configured with `{ logical: "parens-new-line" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { logical: "parens-new-line" }] */

<div>
  {foo && (
    <div>
      <p>Hello World</p>
    </div>
  )}
</div>
```

:::

### `prop`

Examples of **incorrect** code for this rule, when configured with `{ prop: "parens" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { prop: "parens" }] */

<div foo={<div>
    <p>Hello</p>
  </div>}>
  <p>Hello</p>
</div>;
```

:::

Examples of **correct** code for this rule, when configured with `{ prop: "parens" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { prop: "parens" }] */

<div foo={(<div>
    <p>Hello</p>
  </div>)}>
  <p>Hello</p>
</div>;

<div foo={(
  <div>
    <p>Hello</p>
  </div>
)}>
  <p>Hello</p>
</div>;
```

:::

Examples of **incorrect** code for this rule, when configured with `{ prop: "parens-new-line" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { prop: "parens-new-line" }] */

<div foo={<div>
    <p>Hello</p>
  </div>}>
  <p>Hello</p>
</div>;

<div foo={(<div>
    <p>Hello</p>
  </div>)}>
  <p>Hello</p>
</div>;
```

:::

Examples of **correct** code for this rule, when configured with `{ prop: "parens-new-line" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { prop: "parens-new-line" }] */

<div foo={(
  <div>
    <p>Hello</p>
  </div>
)}>
  <p>Hello</p>
</div>;
```

:::

### `propertyValue`

Examples of **incorrect** code for this rule, when configured with `{ propertyValue: "parens" }`.

::: incorrect

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { propertyValue: "parens" }] */

var hello = {
  foo: <div>
    <p>Hello</p>
  </div>
};
```

:::

Examples of **correct** code for this rule, when configured with `{ propertyValue: "parens" }`.

::: correct

```jsx
/* eslint @stylistic/jsx-wrap-multilines: ["error", { propertyValue: "parens" }] */

var hello = {
  foo: (
    <div>
      <p>Hello</p>
    </div>
  )
};
```

:::
