# @stylistic/eslint-plugin-jsx

JSX stylistic rules for ESLint, migrated from [`eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react). Decoupled from React and supports generic JSX syntax.

Credits to all contributors who have committed to the original rules.

::: tip
We recommend using [`@stylistic/eslint-plugin`](/packages/default) as it includes the rules for both JavaScript and TypeScript
:::

## Install

```sh
npm i -D @stylistic/eslint-plugin-jsx
```

Add `@stylistic/jsx` to your plugins list, and change the prefix for [stylistic rules](#rules) from `react` to `@stylistic/js`:

```ts
// .eslintrc.js
module.exports = {
  plugins: [
   '@stylistic/jsx' // [!code ++]
  ],
  rules: {
    'react/jsx-indent': ['error', 2], // [!code --]
    '@stylistic/jsx/jsx-indent': ['error', 2], // [!code ++]
    // ...
  }
};
```

Check out the [migration guide](/guide/migration) for more details.

## Rules

<RuleList package="jsx" />
