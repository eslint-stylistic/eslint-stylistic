# @stylistic/eslint-plugin-ts

Rules for TypeScript code style, migrated from [`typescript-eslint`](https://github.com/typescript-eslint/typescript-eslint).

Credits to all contributors who have committed to the original rules.

## Why

Learn more in [our documentation](https://eslint-stylistic.netlify.app/why)

## Install

```sh
npm i -D @stylistic/eslint-plugin-ts
```

```diff
// .eslintrc.js
module.exports = {
  plugins: [
+   '@stylistic/ts'
  ],
  rules: {
-   '@typescript-eslint/indent': ['error', 2],
+   '@stylistic/ts/indent': ['error', 2],
    // ...  
  }
};
```

You can also try out our [migration plugin](../eslint-plugin-migrate) to automated the migration process.
