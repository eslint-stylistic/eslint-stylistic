# Project Progress

We are currently at the **Waiting for ESLint's announcement** stage.

The rules for both JavaScript and TypeScript are migrated and released as beta versions. They are usable already but might need further testing. We are waiting for ESLint's announcement to finalize the rules list. Before that, **be aware that the rules included in `eslint-stylistic` might be changed** if you want to start migrating (we recommend to pin the dependency versions).

Also check out our [project plans](https://github.com/eslint-stylistic/eslint-stylistic/issues/1) for more details.

## ✅ 1. Migration Infra

Setup migration scripts, docs, tools, etc. 

- During this process we are aiming for 1:1 rules migration, and will not consider improvements or changes to the rules.
- We will use scripts to migrate the rules from ESLint's codebase to this repo (no manually editting), to keep in sync, until stage 2.

## 👉 2. Waiting for ESLint's announcement

Then we will have a clear image of what rules to be included in this repo.

## 3. Iterations & Maintenance

Releases, bugfixes, and might introduce new rules based on community feedback.

- The effort of maintaining those formatting/stylistic rules will be shift from ESLint/`typescript-eslint` teams to this repo. We can start to consider improvements and changes to the rules.
- Collaborate with ESLint/`typescript-eslint` teams to redirect users in their docs to migrate to this project for formatting rules.
