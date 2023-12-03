# Shared Configurations

[ESLint shareable configurations](https://eslint.org/docs/latest/extend/shareable-configs) exist to provide a comprehensive list of rules settings that you can start with. ESLint Stylistic maintains a few built-in configurations that you can use out of the box, or as the foundation for your own custom configuration.

::: info Versioning Policy
We consider adding new rules or tweaking options in the shared configurations as **non-breaking** changes. We will try to only make necessary changes in minor releases.
:::

## Configuration Factory

Fine-tuned shared configuration with clean and consistent code style.

Formatting and stylistic rules are always opinionated. We want to provide shared configurations to simplify the usage, while still allowing you to customize the rules to your own preferences. So, different from other ESLint plugins, we provides a **factory function** with some high-level options you can customize.

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

Refer to the [source code](https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/customize.ts) for the full list of configured rules.

Currently this factory is only available in the [`@stylistic/eslint-plugin`](/packages/default) package.


::: info Rules' Default
Please note that not all rules are used and options configure for each rule might be different from rules' own default values.
:::


## Static Configurations

We also provide a pre-generated static configuration from the [factory function](#configuration-factory) for you to use easily, if you agree with our defaults.

The default options are:

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
  // ...your other config items
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

## Enable All Avaible Rules

If you want to enable all rules with their default options (not recommended), we also provide a config for that:

::: warning
Many rules in ESLint Stylistic are migrated from ESLint's 10 years of codebase. For the compatibility, we kept the original default options of each rule. They might be designed in different time with different philosophy, so their default options might not always work the best together. We recommend you to use the [factory function](#configuration-factory), a fine-tuned configuration with clean and consistent code style.
:::

::: code-group

```js [Flat Config]
// eslint.config.js
import stylistic from '@stylistic/eslint-plugin'

export default [
  stylistic.configs['all-flat'],
  // ...your other config items
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

::: info

Due to the compatibility between rules, the `all` config is does not include JSX rules and non-fixable rules. You may need to configure them manually.

:::

This config is also available in each plugin package, for example, for `@stylistic/eslint-plugin-js`:

::: code-group

```js [Flat Config]
// eslint.config.js
import stylisticJs from '@stylistic/eslint-plugin-js'

export default [
  stylisticJs.configs['all-flat'],
  // ...your other config items
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
