# Contributing Guide

Hi! We're really excited that you're interested in contributing to ESLint Stylistic! Before submitting your contribution, please read through the following guide.

You can use [StackBlitz Codeflow](https://stackblitz.com/codeflow) to fix bugs or implement features. You'll see a Codeflow button on issues to start a PR to fix them. A button will also appear on PRs to review them without needing to check out the branch locally. When using Codeflow, the Vite repository will be cloned for you in an online editor, with the Vite package built in watch mode ready to test your changes. If you'd like to learn more, check out the [Codeflow docs](https://developer.stackblitz.com/codeflow/what-is-codeflow).

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/eslint-stylistic/eslint-stylistic)

## Contribute to Code

Before you work on the code and send PRs, it's always better to check existing issues or create a new one first. This would give a chance for the maintainers and community to discuss the direction before working on it, to avoid spending time on something that might not be merged eventually.

### Fixing Bugs

In this project, we care a lot about testing and code coverage to ensure the quality of the code. If you are fixing a bug, please make sure to add test cases that cover the bug you are fixing. The test files are located in the same folder as the rule implementation, with a `*.test.ts` extension. Learn more about [Running Tests](#running-tests).

### Proposing a new rule

While we are open to adding new rules covering more stylistic issues, we are also very careful about adding new rules. We want to control the number of rules in this project to keep it maintainable.

In general, we recommend you implement the rule and distribute it as your own plugin first. This would allow you and the community to use the rule and gather feedback. If the rule is well received and the rule is commonly needed, then we can discuss whether to add it to ESLint Stylistic.

## Local Setup

To develop locally, fork this repository and clone it in your local machine. This repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

To develop and test this project:

1. Run `pnpm i` in the root folder.

2. Run `pnpm run build` in the root folder.

3. Once you make changes to the code, run `pnpm run test` again to build the project.

> We use pnpm v8. If you are working on multiple projects with different versions of pnpm, it's recommended to enable [Corepack](https://github.com/nodejs/corepack) by running `corepack enable`.

### Running Tests

#### Unit Tests

Each rule has a `*.test.ts` test file alongside the implementation. The tests are run using [Vitest](https://vitest.dev/).

- `pnpm test` by default runs every unit test.

- `pnpm test [rule-name]` runs filtered tests for a specific rule.

#### Integrations Tests

Other than the unit tests, we also provide higher-level integration tests that run ESLint against a set of fixtures.

- `pnpm run test:fixtures` runs fixture tests.

Fixture tests use [Snapshot](https://vitest.dev/guide/snapshot.html) to ensure the output is consistent. When the output does not match the snapshot, the test will fail. If the change is expected, you can update the snapshot by passing the `u` key when running the test.

### Linting

The project uses ESLint and itself to lint and format the code.
You can run `pnpm run lint --fix` to lint and fix the code.
