# Upgrade Guide

## Migrating to v6

This guide covers the confirmed breaking changes between `v5.10.0` and the current v6 branch.

### Node.js Version

Minimum supported Node.js version is now `^20.19.0 || ^22.13.0 || >=24`.

### Removed Rules

These previously deprecated rules have been removed:

| Rule                        | Migration                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| `jsx-indent`                | Use [indent](../rules/indent)                                                                        |
| `jsx-props-no-multi-spaces` | Use [no-multi-spaces](../rules/no-multi-spaces)                                                      |
| `jsx-sort-props`            | Use `eslint-plugin-perfectionist`'s [sort-jsx-props](https://perfectionist.dev/rules/sort-jsx-props) |

### Removed Deprecated Options

The following deprecated options or shorthands are no longer supported:

| Rule                                                          | Removed Option / Syntax                         | Migration                                                                                                       |
| ------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [indent](../rules/indent)                                     | `offsetTernaryExpressionsOffsetCallExpressions` | Use `offsetTernaryExpressions.CallExpression` and `offsetTernaryExpressions.AwaitExpression`                    |
| [quotes](../rules/quotes)                                     | `'avoid-escape'` shorthand                      | Use the object form instead, for example `['error', 'single', { avoidEscape: true }]`                           |
| [quotes](../rules/quotes)                                     | `allowTemplateLiterals: true/false`             | Use `allowTemplateLiterals: 'always'` or `allowTemplateLiterals: 'never'`                                       |
| [type-annotation-spacing](../rules/type-annotation-spacing)   | `overrides.arrow`                               | Use [arrow-spacing](../rules/arrow-spacing) to control spacing around `=>`                                      |
| [line-comment-position](../rules/line-comment-position)       | `applyDefaultPatterns`                          | Use `applyDefaultIgnorePatterns`                                                                                |
| [eol-last](../rules/eol-last)                                 | `'unix'` / `'windows'`                          | Use `'always'`, and combine with [linebreak-style](../rules/linebreak-style) if you need a specific line ending |
| [no-mixed-spaces-and-tabs](../rules/no-mixed-spaces-and-tabs) | boolean shorthand (`true`)                      | Use `['error', 'smart-tabs']`                                                                                   |

### Behavior Changes

#### keyword-spacing

The space before a class body's `{` is no longer handled by [keyword-spacing](../rules/keyword-spacing).

If you previously relied on [keyword-spacing](../rules/keyword-spacing) to enforce `class Foo {}` vs `class Foo{}`, move that configuration to [space-before-blocks](../rules/space-before-blocks).

#### no-multi-spaces

The default value of `exceptions` is now `{}`.

In v5, `Property` and `ImportAttribute` were ignored by default. If you rely on aligned object properties, for example with [key-spacing](../rules/key-spacing), or on aligned import attributes, add them explicitly:

```json
{
  "@stylistic/no-multi-spaces": [
    "error",
    {
      "exceptions": {
        "Property": true,
        "ImportAttribute": true
      }
    }
  ]
}
```
