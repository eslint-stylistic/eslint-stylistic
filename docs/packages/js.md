# @stylistic/eslint-plugin-js

JavaScript stylistic rules for ESLint, migrated from [eslint core](https://github.com/eslint/eslint).

Credits to all contributors who have committed to the original rules.

## Install

```sh
npm i -D @stylistic/eslint-plugin-js
```

Add `@stylistic/js` to your plugins list, and rename [stylistic rules](#rules) adding `@stylistic/js` prefix:

```diff
// .eslintrc.js
module.exports = {
  plugins: [
+   '@stylistic/js'
  ],
  rules: {
-   'indent': ['error', 2],
+   '@stylistic/js/indent': ['error', 2],
    // ...  
  }
};
```

You can also try out our [migration plugin](../eslint-plugin-migrate) to automated the migration process.

## Rules

<RuleList package="js" />
