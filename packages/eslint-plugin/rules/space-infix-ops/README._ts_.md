---
description: Require spacing around infix operators.
---

# ts/space-infix-ops

This rule extends the base [`space-infix-ops`](/rules/js/space-infix-ops) rule.
It adds support for type annotations and enum members.

```ts
enum MyEnum {
  KEY = 'value',
}
```

```ts
let value: string | number = 'value'
```

## Options

This rule accepts the same options as the base rule plus the an option to disable type checking:

```json
"space-infix-ops": ["error", { "int32Hint": false, "ignoreTypes": false }]
```

### `ignoreTypes`

Set the `ignoreTypes` option to `true` (default is `false`) to allow write `string|number` without space.

```ts
var foo: string|number = bar;
```
