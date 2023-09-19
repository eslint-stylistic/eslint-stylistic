# Migration

::: tip
Before you start migrating, check the [project progress](/contribute/project-progress) first to see the current status and understand potential breaking changes.
:::

## ESLint Migrate Plugin

We provides an ESLint plugin for migrating built-in stylistic rules to the `@stylistic` namespace.

```sh
npm i -D @stylistic/eslint-plugin-migrate
```

#### Preset Usage

Extend the `plugin:@stylistic/migrate/recommended` preset in your ESLint configuration. It will check the `.eslintrc.{js|json}` file and the `eslint-config-*/index.js` files in your workspace automatically.

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:@stylistic/migrate/recommended'
  ],
};
```

#### Manual Usage

You can install the plugin manually:

```js
// .eslintrc.js
module.exports = {
  plugins: [
    '@stylistic/migrate'
  ],
}
```

And opt-in to your eslint configure file by adding `/* eslint @stylistic/migrate/rules: "error" */` to the top of your file:

```js
/* eslint @stylistic/migrate/rules: "error" */

module.exports = {
  rules: {
    indent: ['error', 2], // Error: Use @stylistic/indent instead
  }
}
```

## Packages Metadata

If you want to handle the migration on your own, we also expose the metadata for easier programmatic usage.

```sh
npm i -D @eslint-stylistic/metadata
```

```js
import { rules, packages } from '@eslint-stylistic/metadata'

console.log(rules)
```
