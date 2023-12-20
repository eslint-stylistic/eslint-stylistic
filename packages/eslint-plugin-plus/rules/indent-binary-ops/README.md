## Rule Details

Indentation for binary operators in multiline expressions.
This is a supplement to the [`indent`](https://eslint.style/rules/default/indent) rule.

## Options

Same as the [`indent`](https://eslint.style/rules/default/indent) rule, it takes an option for the indentation size that defaults to 2-spaces.

For example, for 2-spaces indentation:

```json
{
  "indent-binary-ops": ["error", 2]
}
```

Or for tabbed indentation:

```json
{
  "indent-binary-ops": ["error", "tab"]
}
```

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
