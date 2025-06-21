# Migration

[ESLint deprecated their formatting rules in v8.53.0](https://eslint.org/blog/2023/10/deprecating-formatting-rules/) and recommended users to migrate to ESLint Stylistic. While [ESLint never removes deprecated rules](https://eslint.org/docs/latest/use/rule-deprecation), it still means that deprecated rules will not receive any future updates. In ESLint Stylistic, we already migrated all those rules and will continue to maintain them.

This guide will help you to do the migration.

ESLint Stylistic is migrated from 3 different sources packages:

- `eslint`: Built-in stylistic rules for JavaScript
- `@typescript-eslint/eslint-plugin`: Stylistic rules for TypeScript
- `eslint-plugin-react`: Framework-agnostic JSX rules

:::tip

If you are directly migrating from `eslint` and `@typescript-eslint/eslint-plugin`, you might want to check v4 first for a even smoother migration experience.

[Check the migration guide for v4](https://v4.eslint.style/guide/migration)

:::

## Manual Migrate

To make the rules configuration easier, we merged all three plugins into one single plugin.

```sh
npm i -D @stylistic/eslint-plugin
```

::: warning

Since v4, we moved the plugin to **ESM-only**, which only supports flat config and ESLint v9+. If you are still using legacy config, please install v3.x with `npm i -D @stylistic/eslint-plugin@3` first and then move to flat config.

:::

::: code-group

```js [Flat Config]
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // ESLint built-in stylistic rules:
      // Add `@stylistic/` prefix
      'semi': 'error', // [!code --]
      '@stylistic/semi': 'error', // [!code ++]

      // `@typescript-eslint` rules:
      // Change `@typescript-eslint/` to `@stylistic/` prefix
      '@typescript-eslint/semi': 'error', // [!code --]
      '@stylistic/semi': 'error', // [!code ++]

      // `eslint-plugin-react` rules:
      // Change `react/` to `@stylistic/` prefix
      'react/jsx-indent': 'error', // [!code --]
      '@stylistic/jsx-indent': 'error', // [!code ++]
    }
  }
]
```

```js [Legacy Config]
// Legacy config is no longer supported in v4+
// Please use v3.x if you need to use legacy config
// We encourage you to migrate to flat config soon

// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic'
  ],
  rules: {
    // ESLint built-in stylistic rules:
    // Add `@stylistic/` prefix
    'semi': 'error', // [!code --]
    '@stylistic/semi': 'error', // [!code ++]

    // `@typescript-eslint` rules:
    // Change `@typescript-eslint/` to `@stylistic/` prefix
    '@typescript-eslint/semi': 'error', // [!code --]
    '@stylistic/semi': 'error', // [!code ++]

    // `eslint-plugin-react` rules:
    // Change `react/` to `@stylistic/` prefix
    'react/jsx-indent': 'error', // [!code --]
    '@stylistic/jsx-indent': 'error', // [!code ++]
  }
}
```

:::

And usually typescript-eslint would ask you to disable the built-in rules, in favor of the `@typescript-eslint` version. With ESLint Stylistic, you only need one rule to handle both JavaScript and TypeScript:

::: code-group

```js [Flat Config]
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // Previously, you need to disable the built-in rule
      'semi': 'off', // [!code --]
      '@typescript-eslint/semi': 'error', // [!code --]

      // Now only need one rule
      '@stylistic/semi': 'error', // [!code ++]
    }
  }
]
```

```js [Legacy Config]
// Legacy config is no longer supported in v4+
// Please use v3.x if you need to use legacy config
// We encourage you to migrate to flat config soon

// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic'
  ],
  rules: {
    // Previously, you need to disable the built-in rule
    'semi': 'off', // [!code --]
    '@typescript-eslint/semi': 'error', // [!code --]

    // Now only need one rule
    '@stylistic/semi': 'error', // [!code ++]
  }
}
```

:::

## Disable Legacy Rules

In cases that you are extending some presets that still include legacy rules and haven't migrated, we provide configuration presets to disable them all.

::: code-group

```js [Flat Config]
// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc'
import stylistic from '@stylistic/eslint-plugin'

const compat = new FlatCompat()

export default [
  // `extends` is not supported in flat config, can you use `@eslint/eslintrc` to handle it
  ...compat({
     extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      // ...
    ],
  }),
  // override the legacy rules
  stylistic.configs['disable-legacy'], // [!code ++]
  // your own rules
  {
    plugins: {
      stylistic,
    },
    rules: {
      'stylistic/semi': 'error',
      // ...
    }
  }
]
```

```js [Legacy Config]
// Legacy config is no longer supported in v4+
// Please use v3.x if you need to use legacy config
// We encourage you to migrate to flat config soon

// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // ...
    'plugin:@stylistic/disable-legacy', // [!code ++]
  ],
  plugins: [
    '@stylistic'
  ],
  rules: {
    '@stylistic/semi': 'error',
    // ...
  }
}
```

:::

## Packages Metadata

If you want to handle the migration on your own, we also expose the metadata for easier programmatic usage.

```sh
npm i -D @eslint-stylistic/metadata
```

```js
import { rules, packages } from '@eslint-stylistic/metadata'

console.log(rules)
```
