<p align="center">
<img src="./public/logo.svg" width="150">
</p>

<h1 align="center">ESLint Stylistic</h1>

<p align="center">
<a href="https://npmjs.com/package/eslint-config-stylistic"><img src="https://img.shields.io/npm/v/eslint-config-stylistic?style=flat&colorA=080f12&colorB=1fa669" alt="npm version"></a>
</p>

Stylistic rules for [ESLint](https://eslint.org/) and [`typescript-eslint`](https://typescript-eslint.io/).

This project was initiated as ESLint and `typescript-eslint` teams [decided to deprecate formatting/stylistic-related rules](https://github.com/eslint/eslint/issues/17522) from their core due to the maintenance cost. This repo ports those rules and distributes them as separate packages and will keep them maintained by the community.

## Project Stages

[Project Plans](https://github.com/eslint-stylistic/eslint-stylistic/issues/1)

####  👉 1. **Migration Infra [CURRENT]** 

Setup migration scripts, docs, tools, etc. 

- During this process we are aiming for 1:1 rules migration, and will not consider improvements or changes to the rules.
- We will use scripts to migrate the rules from ESLint's codebase to this repo (no manually editting), to keep in sync, until stage 2.

#### 2. Waiting for ESLint's announcement

Then we will have a clear image of what rules to be included in this repo.

#### 3. Iterations & Maintenance

Releases, bugfixes, and might introduce new rules based on community feedback.

- The effort of maintaining those formatting/stylistic rules will be shift from ESLint/`typescript-eslint` teams to this repo. We can start to consider improvements and changes to the rules.
- Collaborate with ESLint/`typescript-eslint` teams to redirect users in their docs to migrate to this project for formatting rules.


## License

[MIT](./LICENSE)
