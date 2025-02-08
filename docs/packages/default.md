# @stylistic/eslint-plugin

Stylistic rules for ESLint, works for both JavaScript, TypeScript and JSX.

This plugin provides all rules from:

- [`@stylistic/eslint-plugin-js`](./js)
- [`@stylistic/eslint-plugin-ts`](./ts)
- [`@stylistic/eslint-plugin-jsx`](./jsx)
- [`@stylistic/eslint-plugin-plus`](./plus)

With this plugin, you no longer need to mainly disable JavaScript in favor of TypeScript. Rules work for both languages.

## Shared Configurations

This plugin provides some built-in configurations that you can use out of the box. Learn more about [shared configurations](/guide/config-presets).

## Install

::: code-group

```sh [npm]
npm i -D @stylistic/eslint-plugin
```

```sh [pnpm]
pnpm add -D @stylistic/eslint-plugin
```

```sh [yarn]
yarn add -D @stylistic/eslint-plugin
```

:::

Add `@stylistic` to your plugins list, and prefix [stylistic rules](#rules) with `@stylistic`:
::: code-group

```js [Flat Config]
// eslint.config.js
import stylistic from '@stylistic/eslint-plugin' // [!code ++]

export default [
  {
    plugins: {
      '@stylistic': stylistic // [!code ++]
    },
    rules: {
      'indent': ['error', 2], // [!code --]
      '@stylistic/indent': ['error', 2], // [!code ++]
      // ...
    }
  }
]
```

```js [Legacy Config]
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

:::

Check out the [migration guide](/guide/migration) for more details.

## Rules

<RuleList package="default" />
