# @stylistic/eslint-plugin-js

JavaScript stylistic rules for ESLint, migrated from [eslint core](https://github.com/eslint/eslint).

Credits to all contributors who have committed to the original rules.

::: tip
Recommended to use [`@stylistic/eslint-plugin`](/packages/default), which support both JavaScript and TypeScript rules automatically, without the need to manually overrides.
:::

## Install

```sh
npm i -D @stylistic/eslint-plugin-js
```

Add `@stylistic/js` to your plugins list, and rename [stylistic rules](#rules) adding `@stylistic/js` prefix:

```js
// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic/js' // [!code ++]
  ],
  rules: {
    'indent': ['error', 2], // [!code --]
    '@stylistic/js/indent': ['error', 2], // [!code ++]
    // ...  
  }
}
```

Check out the [migration guide](/guide/migration) for more details.

## Rules

<RuleList package="js" />
