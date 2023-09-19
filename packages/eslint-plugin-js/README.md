# @stylistic/eslint-plugin-js

Rules for JavaScript code style, migrated from [eslint core](https://github.com/eslint/eslint).

Credits to all contributors who have committed to the original rules.

## Why

Learn more in [our documentation](https://eslint-stylistic.netlify.app/why)

## Install

```sh
npm i -D @stylistic/eslint-plugin-js
```

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
