# @stylistic/eslint-plugin

Stylistic rules for ESLint, works for both JavaScript, TypeScript and JSX.

This plugin provides the rules from:

- [`@stylistic/eslint-plugin-js`](./js)
- [`@stylistic/eslint-plugin-ts`](./ts)
- [`@stylistic/eslint-plugin-jsx`](./jsx)

## Install

```sh
npm i -D @stylistic/eslint-plugin
```

Add `@stylistic` to your plugins list, and prefix [stylistic rules](#rules) with `@stylistic`:

```js
// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic' // [!code ++]
  ],
  rules: {
    'indent': ['error', 2], // [!code --]
    '@stylistic/indent': ['error', 2], // [!code ++]
    // ...
  }
}
```

Check out the [migration guide](/guide/migration) for more details.

## Rules

<RuleList package="default" />
