---
description: Require or disallow padding lines between statements.
---

# ts/padding-line-between-statements

This rule extends the base [`padding-line-between-statements`](/rules/js/padding-line-between-statements) rule.

It adds support for TypeScript constructs such as `interface` and `type`.

## Options

In addition to options provided by ESLint, the following options can be used as statement types:

- `interface`
- `type`
- `function-overload`

For example, to add blank lines before interfaces and type definitions:

```jsonc
{
  "@stylistic/padding-line-between-statements": [
    "error",
    {
      "blankLine": "always",
      "prev": "*",
      "next": ["interface", "type"]
    }
  ]
}
```

To avoid blank lines between function overloads and the function body:

```jsonc
{
  "@stylistic/padding-line-between-statements": [
    "error",
    {
      "blankLine": "never",
      "prev": "function-overload",
      "next": "function"
    }
  ]
}
```
