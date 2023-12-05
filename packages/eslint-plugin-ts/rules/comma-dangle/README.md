---
description: 'Require or disallow trailing commas.'
---

This rule extends the base [`comma-dangle`](/rules/js/comma-dangle) rule.
It adds support for TypeScript syntax.

## Options

In addition to the options supported by the `js/comma-dangle` rule, the rule adds the following options:

- `"enums"` is for trailing comma in enum. (e.g. `enum Foo = {Bar,}`)
- `"generics"` is for trailing comma in generic. (e.g. `function foo<T,>() {}`)
- `"tuples"` is for trailing comma in tuple. (e.g. `type Foo = [string,]`)
