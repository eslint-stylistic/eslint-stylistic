# @stylistic/eslint-plugin-js

JavaScript stylistic rules for ESLint, migrated from [eslint core](https://github.com/eslint/eslint).

Credits to all contributors who have committed to the original rules.

::: tip
We recommend using [`@stylistic/eslint-plugin`](/packages/default) as it includes the rules for both JavaScript and TypeScript
:::

## Install

::: code-group

```sh [npm]
npm i -D @stylistic/eslint-plugin-js
```

```sh [pnpm]
pnpm add -D @stylistic/eslint-plugin-js
```

```sh [yarn]
yarn add -D @stylistic/eslint-plugin-js
```

:::

Add `@stylistic/js` to your plugins list, and prefix [stylistic rules](#rules) with `@stylistic/js`:

::: code-group

```js [Flat Config]
// eslint.config.js
import stylisticJs from '@stylistic/eslint-plugin-js' // [!code ++]

export default [
  {
    plugins: {
      '@stylistic/js': stylisticJs // [!code ++]
    },
    rules: {
      'indent': ['error', 2], // [!code --]
      '@stylistic/js/indent': ['error', 2], // [!code ++]
      // ...
    }
  }
]
```

```js [Legacy Config]
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

:::

Check out the [migration guide](/guide/migration) for more details.

## Rules

<RuleList package="js" />
