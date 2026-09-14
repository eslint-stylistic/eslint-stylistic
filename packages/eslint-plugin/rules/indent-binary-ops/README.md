# indent-binary-ops

> [!WARNING]
> This rule is deprecated since v6.0.0 and will remain available for one compatibility release. The [`indent`](https://eslint.style/rules/default/indent) rule now checks binary, logical, union, and intersection operator indentation by default. Existing configurations remain valid during the compatibility period, but should remove this rule to avoid duplicate reports.

## Rule Details

Indentation for binary operators in multiline expressions.
This rule is retained temporarily for compatibility with existing configurations.

## Options

Same as the [`indent`](https://eslint.style/rules/default/indent) rule, it takes an option for the indentation size.

Legacy configuration for 2-space indentation:

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
/* eslint @stylistic/indent-binary-ops: ["error", 2] */

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
/* eslint @stylistic/indent-binary-ops: ["error", 2] */

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
