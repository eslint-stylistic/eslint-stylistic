# Project Progress

We are currently at the **Maintenance** stage.

The rules for both JavaScript and TypeScript are migrated and released as beta versions. They are usable already but might need further testing. We are waiting for ESLint's announcement to finalize the rules list. Before that, **be aware that the rules included in `eslint-stylistic` might be changed** if you want to start migrating (we recommend to pin the dependency versions).

Also check out our [project plans](https://github.com/eslint-stylistic/eslint-stylistic/issues/1) for more details.

## ✅ 1. Migration Infra

Setup migration scripts, docs, tools, etc.

- During this process we are aiming for 1:1 rules migration, and will not consider improvements or changes to the rules.
- We will use scripts to migrate the rules from ESLint's codebase to this repo (no manual editing), to keep them in sync, until stage 2.

## ✅ 2. Waiting for ESLint's announcement

ESLint has [announced the deprecation list](https://eslint.org/blog/2023/10/deprecating-formatting-rules/), and we have migrated all the rules included in the list.

## ✅ 3. Drop-in Release

The release of v1.0.0 serve as the 1:1 drop-in replacement of the deprecated rules.

- The effort of maintaining those formatting/stylistic rules will be shift from ESLint/`typescript-eslint` teams to this repo. We can start to consider improvements and changes to the rules.
- Collaborate with ESLint/`typescript-eslint` teams to redirect users in their docs to migrate to this project for formatting rules.

## 👉 4. Maintenance & Refactors

[👋 **We need your help**! Join our Discord server and let us know if you are interested in contributing.](https://eslint.style/chat)

Bugfixes, beleases, and might introduce new rules based on community feedback.

- Rewrite JS and JSX rules in TypeScript for better long-term maintenance.
- Fuse JS/TS/JSX rules into a single package, and merge their docs. After this, separate packages for JS/TS/JSX will be deprecated.
- Introduce an `experimental` mechanism that ships new rules and features as a separate opt-in package, to collect early feedbacks.
