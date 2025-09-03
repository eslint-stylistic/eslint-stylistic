# Getting Started

ESLint Stylistic is a collection of stylistic rules for ESLint, migrated from `eslint` core and `@typescript-eslint` repo to shift the maintenance effort to the community. Learn more about [why we need this project](/guide/why).

## Plugin

ESLint Stylistic is provided as a unified plugin, which supports JS, TS and JSX out of the box.

[Check the rules and install guide](/rules) for more details.

:::info Unified Plugin

We used to provide separate plugins for each language like `@stylistic/eslint-plugin-js`, but **since v5**, we have merged them into a single plugin.

Those separated plugins would still work but would not receive new features. Please consider migrating to the unified plugin.

The legacy docs is available at [v4.eslint.style](https://v4.eslint.style/).

:::

## Migration

Please refer to the [migration guide](/guide/migration) for more details.

## Installation

```bash
# With npm
npm i -D @stylistic/eslint-plugin

# With pnpm
pnpm add -D @stylistic/eslint-plugin

# With yarn
yarn add -D @stylistic/eslint-plugin
```

## Usage

### Ready-to-use Preset

```js
// eslint.config.js
import stylistic from "@stylistic/eslint-plugin";

export default [
  // Your parser / TS / React / other presets
  // …

  // Activate Stylistic's recommended preset
  {
    plugins: { "@stylistic": stylistic },
    rules: {
      ...stylistic.configs.recommended.rules,
    },
  },
];
```

### The Factory (ready-to-insert configs)

```js
// eslint.config.js
import stylistic from '@stylistic/eslint-plugin'

export default [
  stylistic.configs.customize({
    // the following options are the default values
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: true,
    // ...
  }),
  // ...your other config items
]
```

For more configuration options and prebuilt presets, see the [Shared Configs](/guide/config-presets).
