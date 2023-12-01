---
description: 'Require empty lines around comments.'
---

This rule extends the base [`lines-around-comment`](/rules/js/lines-around-comment) rule.
It adds support for TypeScript syntax.

## Options

In addition to the options supported by the `js/lines-around-comment` rule, the rule adds the following options:

- `allowEnumEnd: true` doesn't require a blank line after an enum body block end
- `allowEnumStart: true` doesn't require a blank line before an enum body block start
- `allowInterfaceEnd: true` doesn't require a blank line before an interface body block end
- `allowInterfaceStart: true` doesn't require a blank line after an interface body block start
- `allowModuleEnd: true` doesn't require a blank line before a module body block end
- `allowModuleStart: true` doesn't require a blank line after a module body block start
- `allowTypeEnd: true` doesn't require a blank line before a type literal block end
- `allowTypeStart: true` doesn't require a blank line after a type literal block start
