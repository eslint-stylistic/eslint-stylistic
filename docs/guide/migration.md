# Migration

::: tip
Before you start migrating, check the [project progress](/contribute/project-progress) first to see the current status and understand potential breaking changes.
:::

## When Should I Migrate?

For production projects, we would recommend to wait a bit longer, until ESLint officially announces the deprecation list.

At the current stage, the packages are already useable. We are more then happy to see you start trying them out and give us feedbacks.

The benefit of migrating:

- Clear scope of rules, you can see more clearly what rules are related to code style by the prefix `@stylistic/`
- Better IDE experience, you can config your IDE to [hide the error messages for code style rules](/guide/faq#the-error-messages-squiggly-lines-for-code-style-are-annoying) with scoping and does require to list manually.
- Future proof, the rules in core will no longer be updated and might be removed at some point. The maintenance work will be shifted to here.

The downside of migrating **now**:

- We are still waiting for ESLint and `typescript-eslint` teams to announce the official deprecation list. We suggest to pin the dependency version to avoid unexpected breakage.

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

To make the rules configuration easier, we merged all these 3 plugins into one single plugin.

```sh
npm i -D @stylistic/eslint-plugin
```

```js
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

And usually typescript-eslint would ask you to disable able the built-in rules, in favor of the `@typescript-eslint` version. With ESLint Stylistic, you only need one rule to handle both JavaScript and TypeScript.

```js
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

### Approach 2: Migrate to 1-to-1 Plugins

To make the migration easier, we also provide 1-to-1 mapping plugins for each source package. Different from the [single plugin](#approach-1-migrate-to-single-plugin), you need to install 3 different packages with additional prefixes in rules.

#### ESLint Code (JavaScript)

```sh
npm i -D @stylistic/eslint-plugin-js
```

```js
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

#### TypeScript

```sh
npm i -D @stylistic/eslint-plugin-ts
```

```js
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

#### JSX

```sh
npm i -D @stylistic/eslint-plugin-jsx
```

```js
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

## ESLint Migrate Plugin

We provides an ESLint plugin for migrating built-in stylistic rules to the `@stylistic` namespace.

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

## Packages Metadata

If you want to handle the migration on your own, we also expose the metadata for easier programmatic usage.

```sh
npm i -D @eslint-stylistic/metadata
```

```js
import { rules, packages } from '@eslint-stylistic/metadata'

console.log(rules)
```
