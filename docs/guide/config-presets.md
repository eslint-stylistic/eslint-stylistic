# Shared Configurations

[ESLint shareable configurations](https://eslint.org/docs/latest/extend/shareable-configs) exist to provide a comprehensive list of rules settings that you can start with. ESLint Stylistic maintains a few built-in configurations that you can use out of the box, or as the foundation for your own custom configuration.

Currently the shared configurations are only available in the [`@stylistic/eslint-plugin`](/packages/default) package.

::: info Versioning Policy
We consider adding new rules or tweaking options in the shared configurations as **non-breaking** changes. If we do, we will only make necessary changes and release as minor version bumps.
:::

## Configuration Factory

Formatting and stylistic rules are always opinionated. We want to provide shared configurations to simplify the usage, while still allowing you to customize the rules to your own preferences. So, a bit different than shared configurations from other ESLint plugins, we provides a factory function that you can customize some high-level options.

::: code-group

```js [Flat Config]
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
  // ...you other config items
]
```

```js [Legacy Config]
// .eslintrc.js
const stylistic = require('@stylistic/eslint-plugin')

const customized = stylistic.configs.customize({
  // the following options are the default values
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true,
  // ...
})

module.exports = {
  plugins: [
    '@stylistic'
  ],
  rules: {
    ...customized.rules,
    // ...your other rules
  }
}
```

Refer to the [source code](https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/customize.ts) for the full list of configured rules.

:::

## Pre-configured

If you agree with our defaults, we also provide some pre-configured static configurations for you to use easily.

By default is:

```js
{
  indent: 2,
  quotes: 'single',
  semi: false,
  jsx: true,
}
```

::: code-group

```js [Flat Config]
// eslint.config.js
import stylistic from '@stylistic/eslint-plugin'

export default [
  stylistic.configs['recommended-flat'],
  // ...you other config items
]
```

```js [Legacy Config]
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:@stylistic/recommended-extends'
  ],
  rules: {
    // ...your other rules
  }
}
```

:::

## Disabling Legacy Rules

If you are extending some presets that still include legacy rules and haven't migrated, we provide configuration presets to disable them all.

Learn more in the [Migration Guide](/guide/migration#disable-legacy-rules).
