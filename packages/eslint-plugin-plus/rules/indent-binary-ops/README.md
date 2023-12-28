## Rule Details

Indentation for binary operators in multiline expressions.
This is a supplement to the [`indent`](https://eslint.style/rules/default/indent) rule. They are supposed to be used together with the same indentation size.

## Options

Same as the [`indent`](https://eslint.style/rules/default/indent) rule, it takes an option for the indentation size.

For example, for 2-space indentation:

```json
{
  "@stylistic/indent": ["error", 2],
  "@stylistic/indent-binary-ops": ["error", 2]
}
```

Or for tabbed indentation:

```json
{
  "@stylistic/indent": ["error", "tab"],
  "@stylistic/indent-binary-ops": ["error", "tab"]
}
```

This rule works by:

- Only check for binary operations that are multiline.
- Align the indentation of the second line with the same indentation of the first line (handled by the `indent` rule)
- In some conditions (e.g. last line ends with an open bracket), the indentation of the second line will be one level increased to the first line's indentation.

## Examples

Examples of **incorrect** code for this rule:

:::incorrect

```ts
/*eslint indent-binary-ops: ["error", 2]*/

if (a
    && b
      && c
    && (d
          || e
            || f
          )
) {
  foo()
}
```

:::

Examples of **correct** code for this rule:

:::correct

```ts
/*eslint indent-binary-ops: ["error", 2]*/

if (a
  && b
  && c
  && (d
    || e
    || f
  )
) {
  foo()
}
```

:::
