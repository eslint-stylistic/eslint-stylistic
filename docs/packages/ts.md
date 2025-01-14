# @stylistic/eslint-plugin-ts

TypeScript stylistic rules for ESLint, migrated from [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint).

Credits to all contributors who have committed to the original rules.

::: tip
We recommend using [`@stylistic/eslint-plugin`](/packages/default) as it includes the rules for both JavaScript and TypeScript
:::

## Install

```sh
npm i -D @stylistic/eslint-plugin-ts
```

Add `@stylistic/ts` to your plugins list, and change the prefix for [stylistic rules](#rules) from `@typescript-eslint/` to `@stylistic/ts/`:
::: code-group

```js [Flat Config]
// eslint.config.js
import stylisticTs from '@stylistic/eslint-plugin-ts' // [!code ++]
import parserTs from '@typescript-eslint/parser'

export default [
  {
    plugins: {
      '@stylistic/ts': stylisticTs // [!code ++]
    },
    languageOptions: {
      parser: parserTs,
    },
    rules: {
      '@typescript-eslint/indent': ['error', 2], // [!code --]
      '@stylistic/ts/indent': ['error', 2], // [!code ++]
      // ...
    }
  }
]
```

```js [Legacy Config]
// .eslintrc.js
module.exports = {
  plugins: [
    '@typescript-eslint',
    '@stylistic/ts', // [!code ++]
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/indent': ['error', 2], // [!code --]
    '@stylistic/ts/indent': ['error', 2], // [!code ++]
    // ...
  }
};
```

:::

Note that this package only contains stylistic rules. You still need to install `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` to parse and lint your TypeScript code.

Check out the [migration guide](/guide/migration) for more details.

## Rules

<RuleList package="ts" />
