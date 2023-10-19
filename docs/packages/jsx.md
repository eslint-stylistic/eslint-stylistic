# @stylistic/eslint-plugin-jsx

JSX stylistic rules for ESLint, migrated from [`eslint-plugin-react`](https://github.com/jsx-eslint/eslint-plugin-react). Decoupled from React and support generic JSX syntax.

Credits to all contributors who have committed to the original rules.

::: tip
Recommended to use [`@stylistic/eslint-plugin`](/packages/default), which support both JavaScript and TypeScript rules automatically, without the need to manually overrides.
:::

## Install

```sh
npm i -D @stylistic/eslint-plugin-jsx
```

Add `@stylistic/jsx` to your plugins list, and rename [stylistic rules](#rules) adding `@stylistic/js` prefix:

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
