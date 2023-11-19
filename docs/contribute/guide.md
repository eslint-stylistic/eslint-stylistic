# Contributing Guide

Hi! We're really excited that you're interested in contributing to ESLint Stylistic! Before submitting your contribution, please read through the following guide.

You can use [StackBlitz Codeflow](https://stackblitz.com/codeflow) to fix bugs or implement features. You'll see a Codeflow button on issues to start a PR to fix them. A button will also appear on PRs to review them without needing to check out the branch locally. When using Codeflow, the Vite repository will be cloned for you in an online editor, with the Vite package built in watch mode ready to test your changes. If you'd like to learn more, check out the [Codeflow docs](https://developer.stackblitz.com/codeflow/what-is-codeflow).

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/eslint-stylistic/eslint-stylistic)

## Repo Setup

To develop locally, fork this repository and clone it in your local machine. This repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

To develop and test this project:

1. Run `pnpm i` in the root folder.

2. Run `pnpm run build` in the root folder.

3. Once you make changes to the code, run `pnpm run test` again to build the project.

> We use pnpm v8. If you are working on multiple projects with different versions of pnpm, it's recommended to enable [Corepack](https://github.com/nodejs/corepack) by running `corepack enable`.

## Running Tests

### Unit Tests

Each rule have a `*.test.ts` test file along side the implementation. The tests are run using [Vitest](https://vitest.dev/).

- `pnpm test` by default runs every unit tests.

- `pnpm test [rule-name]` runs filtered tests for a specific rule.

### Integrations Tests

Other than the unit tests, we also provides a higher level integration tests that runs ESLint against a set of fixtures. 

- `pnpm run test:fixtures` runs fixtures tests.

Fixture tests use [Snapshot](https://vitest.dev/guide/snapshot.html) to ensure the output is consistent. When the output does not match the snapshot, the test will fail. If the change is expected, you can update the snapshot by passing `u` key when running the test.

## Linting

The project uses ESLint and itself to lint and format the code.
You can run `pnpm run lint --fix` to lint and fix the code.
