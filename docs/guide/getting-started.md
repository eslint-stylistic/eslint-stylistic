# Getting Started

ESLint Stylistic is a collection of stylistic rules for ESLint, migrated from `eslint` core and `@typescript-eslint` repo to shift the maintenance effort to the community. Learn more about [why we need this project](/guide/why).

## Packages

ESLint Stylistic is migrated from 3 different sources packages:

- `eslint` -> [`@stylistic/eslint-plugin-js`](/packages/js)
  - Built-in stylistic rules for JavaScript
- `@typescript-eslint/eslint-plugin` -> [`@stylistic/eslint-plugin-ts`](/packages/ts)
  - Stylistic rules for TypeScript
- `eslint-plugin-react` -> [`@stylistic/eslint-plugin-jsx`](/packages/jsx)
  - Stylistic rules for framework-agnostic JSX

We also provide an unified plugin [`@stylistic/eslint-plugin`](/packages/default) that merges rules from all 3 plugins.

## Migration

::: tip
Before you start, check the [project progress](/contribute/project-progress) first to see the current status and understand potential breaking changes to migrate.
:::

Please refer to the [migration guide](/guide/migration) for more details.
