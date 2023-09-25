# @stylistic/eslint-plugin-ts

TypeScript stylistic rules for ESLint, migrated from [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint).

Credits to all contributors who have committed to the original rules.

::: tip
Recommended to use [`@stylistic/eslint-plugin`](/packages/default), which support both JavaScript and TypeScript rules automatically, without the need to manually overrides.
:::

## Install

```sh
npm i -D @stylistic/eslint-plugin-ts
```

Add `@stylistic/ts` to your plugins list, and rename [stylistic rules](#rules) from `@typescript-eslint/` prefix to `@stylistic/ts/`:

```diff
// .eslintrc.js
module.exports = {
  plugins: [
    '@typescript-eslint',
+   '@stylistic/ts',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
-   '@typescript-eslint/indent': ['error', 2],
+   '@stylistic/ts/indent': ['error', 2],
    // ...  
  }
};
```

Note that this package only contains stylistic rules. You still need to install `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` to parse and lint your TypeScript code.

You can also try out our [migration plugin](/guide/migration) to automated the migration process.

## Rules

<RuleList package="ts" />
