# Migration

::: tip
Before you start migrating, check the [project progress](/contribute/project-progress) first to see the current status and understand potential breaking changes.
:::

## When should I migrate?

For production projects, we would recommend to wait a bit longer, until ESLint officially announces the deprecation list.

At the current stage, the packages are already useable. We are more then happy to see you start trying them out and give us feedbacks.

The benefit of migrating:

- Clear scope of rules, you can see more clearly what rules are related to code style by the prefix `@stylistic/`
- Better IDE experience, you can config your IDE to [hide the error messages for code style rules](/guide/faq#the-error-messages-squiggly-lines-for-code-style-are-annoying) with scoping and does require to list manually.
- Future proof, the rules in core will no longer be updated and might be removed at some point. The maintenance work will be shifted to here.

The downside of migrating **now**:

- We are still waiting for ESLint and `typescript-eslint` teams to announce the official deprecation list. You might expect at least one major breaking change in `@stylistic` packages (add/removing supporting rules). We suggest to pin the dependency version to avoid unexpected breakage.

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
