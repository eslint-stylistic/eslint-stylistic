# Migration

[ESLint deprecated their formatting rules in v8.53.0](https://eslint.org/blog/2023/10/deprecating-formatting-rules/) and recommended users to migrate to ESLint Stylistic. While [ESLint never removes deprecated rules](https://eslint.org/docs/latest/use/rule-deprecation), it still means that deprecated rules will not receive any future updates. In ESLint Stylistic, we already migrated all those rules and will continue to maintain them.

This guide will help you to do the migration.

## Manual Migrate

ESLint Stylistic is migrated from 3 different sources packages:

- `eslint` -> `@stylistic/eslint-plugin-js`
  - Built-in stylistic rules for JavaScript
- `@typescript-eslint/eslint-plugin` -> `@stylistic/eslint-plugin-ts`
  - Stylistic rules for TypeScript
- `eslint-plugin-react` -> `@stylistic/eslint-plugin-jsx`
  - Framework-agnostic JSX rules

There are two ways to migrate your project to ESLint Stylistic:

- [Approach 1: Migrate to Single Plugin](#approach-1-migrate-to-single-plugin): One single package for JavaScript, TypeScript and JSX. This is the recommended way.
- [Approach 2: Migrate to 1-to-1 Plugins](#approach-2-migrate-to-1-to-1-plugins): One package for each source package. Rules are 1:1 mapped, and would be easier to migrate.

### Approach 1: Migrate to Single Plugin

To make the rules configuration easier, we merged all three plugins into one single plugin.

```sh
npm i -D @stylistic/eslint-plugin
```

```js
// .eslintrc.js  [Legacy Config]
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

And usually typescript-eslint would ask you to disable the built-in rules, in favor of the `@typescript-eslint` version. With ESLint Stylistic, you only need one rule to handle both JavaScript and TypeScript:

```js
// .eslintrc.js  [Legacy Config]
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

### Approach 2: Migrate to 1-to-1 Plugins

To make the migration easier, we also provide a 1-to-1 mapping for each source package's plugins. Unlike the [single plugin approach](#approach-1-migrate-to-single-plugin), you need to install 3 different packages with additional prefixes in the rules.

#### ESLint Code (JavaScript)

```sh
npm i -D @stylistic/eslint-plugin-js
```

::: code-group

```js [Flat Config]
// .eslint.config.js
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  plugins: {
    '@stylistic/js': stylisticJs
  },
  rules: {
    // ESLint built-in stylistic rules:
    // Add `@stylistic/js/` prefix
    'semi': 'error', // [!code --]
    '@stylistic/js/semi': 'error', // [!code ++]
  }
]
```

```js [Legacy Config]
// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic/js'
  ],
  rules: {
    // ESLint built-in stylistic rules:
    // Add `@stylistic/js/` prefix
    'semi': 'error', // [!code --]
    '@stylistic/js/semi': 'error', // [!code ++]
  }
}

```

:::

#### TypeScript

```sh
npm i -D @stylistic/eslint-plugin-ts
```

::: code-group

```js [Flat Config]
// .eslint.conf.js
import stylisticTs from '@stylistic/eslint-plugin-ts'

export default [
  plugins: {
    '@stylistic/ts': stylisticTs
  },
  rules: {
    // `@typescript-eslint` rules:
    // Change `@typescript-eslint/` to `@stylistic/ts/` prefix
    '@typescript-eslint/semi': 'error', // [!code --]
    '@stylistic/ts/semi': 'error', // [!code ++]
  }
]
```

```js [Legacy Config]
// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic/ts'
  ],
  rules: {
    // `@typescript-eslint` rules:
    // Change `@typescript-eslint/` to `@stylistic/ts/` prefix
    '@typescript-eslint/semi': 'error', // [!code --]
    '@stylistic/ts/semi': 'error', // [!code ++]
  }
}
```

:::

#### JSX

```sh
npm i -D @stylistic/eslint-plugin-jsx
```

::: code-group

```js [Flat Config]
// .eslint.conf.js
import stylisticJsx from '@stylistic/eslint-plugin-jsx'

export default [
  plugins: [
    '@stylistic/jsx'
  ],
  rules: {
    // `eslint-plugin-react` rules:
    // Change `react/` to `@stylistic/jsx/` prefix
    'react/jsx-indent': 'error', // [!code --]
    '@stylistic/jsx/jsx-indent': 'error', // [!code ++]
  }
]
```

```js [Legacy Config]
// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic/jsx'
  ],
  rules: {
    // `eslint-plugin-react` rules:
    // Change `react/` to `@stylistic/jsx/` prefix
    'react/jsx-indent': 'error', // [!code --]
    '@stylistic/jsx/jsx-indent': 'error', // [!code ++]
  }
}
```

:::

## ESLint Migrate Plugin

We provide an ESLint plugin for migrating built-in stylistic rules to the `@stylistic` namespace.

```sh
npm i -D @stylistic/eslint-plugin-migrate
```

```js
// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic/migrate'
  ],
}
```

And opt-in to your eslint configure file by adding eslint comments to the top of your file:

```js
// Migrate built-in rules to @stylistic/js namespace
/* eslint @stylistic/migrate/migrate-js: "error" */

// Migrate `@typescript-eslint` rules to @stylistic/ts namespace
/* eslint @stylistic/migrate/migrate-ts: "error" */

module.exports = {
  rules: {
    indent: ['error', 2], // Error: Use @stylistic/js/indent instead

    '@typescript-eslint/indent': ['error', 2], // Error: Use @stylistic/ts/indent instead
  }
}
```

## Disable Legacy Rules

In cases that you are extending some presets that still include legacy rules and haven't migrated, we provide configuration presets to disable them all.

::: code-group

```js [Flat Config]
// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc'
import StylisticPlugin from '@stylistic/eslint-plugin'

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
  StylisticPlugin.configs['disable-legacy'] // [!code ++],
  // your own rules
  {
    plugins: {
      stylistic: StylisticPlugin
    },
    rules: {
      'stylistic/semi': 'error',
      // ...
    }
  }
]
```

```js [Legacy Config]
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
