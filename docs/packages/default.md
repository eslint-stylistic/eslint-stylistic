# @stylistic/eslint-plugin

Stylistic rules for ESLint, works for both JavaScript and TypeScript.

This plugin is a merge of [`@stylistic/eslint-plugin-js`](./js) and [`@stylistic/eslint-plugin-ts`](./ts). You don't need to override the rules manually.

## Install

```sh
npm i -D @stylistic/eslint-plugin
```

Add `@stylistic` to your plugins list, and rename [stylistic rules](#rules) adding `@stylistic` prefix:

```diff
// .eslintrc.js
module.exports = {
  plugins: [
+   '@stylistic'
  ],
  rules: {
-   'indent': ['error', 2],
+   '@stylistic/indent': ['error', 2],
    // ...  
  }
};
```

You can also try out our [migration plugin](/guide/migration) to automated the migration process.

## Rules

<RuleList package="default" />
