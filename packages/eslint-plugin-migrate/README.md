# @stylistic/eslint-plugin-migrate

An ESLint plugin for migrating built-in stylistic rules to the `@stylistic` namespace.

## Usage

```sh
npm i -D @stylistic/eslint-plugin-migrate
```

### Preset

Extend the `plugin:@stylistic/migrate/recommended` preset in your ESLint configuration. It will check the `.eslintrc.{js|json}` file and the `eslint-config-*/index.js` files in your workspace automatically.

```js
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:@stylistic/migrate/recommended'
  ],
};
```

### Manual

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
