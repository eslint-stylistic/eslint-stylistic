# Shared Configurations

[ESLint shareable configurations](https://eslint.org/docs/latest/extend/shareable-configs) exist to provide a comprehensive list of rules settings that you can start with. ESLint Stylistic maintains a few built-in configurations that you can use out of the box, or as the foundation for your own custom configuration.

Currently the shared configurations are only available in the [`@stylistic/eslint-plugin`](/packages/default) package.

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
    'plugin:@stylistic/recommended-legacy'
  ],
  rules: {
    // ...your other rules
  }
}
```

:::

## Enable All Rules

If you want to enable all rules with their default options (not recommended), we also provide a config for that:

::: code-group

```js [Flat Config]
// eslint.config.js
import stylistic from '@stylistic/eslint-plugin'

export default [
  stylistic.configs['all-flat'],
  // ...you other config items
]
```

```js [Legacy Config]
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:@stylistic/all-extends'
  ],
  rules: {
    // ...your other rules
  }
}
```

:::

This config is also available in each plugin package, for example, for `@stylistic/eslint-plugin-js`:

::: code-group

```js [Flat Config]
// eslint.config.js
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  stylisticJs.configs['all-flat'],
  // ...you other config items
]
```

```js [Legacy Config]
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:@stylistic/js/all-extends'
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
