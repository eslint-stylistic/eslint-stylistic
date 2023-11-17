# Getting Started

ESLint Stylistic is a collection of stylistic rules for ESLint, migrated from `eslint` core and `@typescript-eslint` repo to shift the maintenance effort to the community. Learn more about [why we need this project](/guide/why).

## Packages

ESLint Stylistic is composed of 4 plugins and 1 unified plugin:

### Migrated plugins

- `eslint` -> [`@stylistic/eslint-plugin-js`](/packages/js)
  - Built-in stylistic rules for JavaScript
- `@typescript-eslint/eslint-plugin` -> [`@stylistic/eslint-plugin-ts`](/packages/ts)
  - Stylistic rules for TypeScript
- `eslint-plugin-react` -> [`@stylistic/eslint-plugin-jsx`](/packages/jsx)
  - Stylistic rules for framework-agnostic JSX

### Additional plugins

- [`@stylistic/eslint-plugin-plus`](/packages/plus)
  - New rules introduced by ESLint Stylistic

### Unified plugins

- [`@stylistic/eslint-plugin`](/packages/default)
  - All rules from the above 4 plugins

<br>

::: tip
Check the [project progress](/contribute/project-progress) first to learn more about the current status of this project.
:::

## Migration

Please refer to the [migration guide](/guide/migration) for more details.
