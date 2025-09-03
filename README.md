<p align="center">
<img src="./docs/public/logo.svg" width="150">
</p>

<h1 align="center">ESLint Stylistic</h1>

<p align="center">
<a href="https://eslint.style">Documentation</a> |
<a href="https://eslint.style/chat">Discord</a> |
<a href="https://eslint.style/guide/why">Why</a> |
<a href="https://eslint.style/guide/migration">Migration</a> |
<a href="https://eslint.style/contribute/project-progress">Project Progress</a>
</p>

<p align="center">
<a href="https://pkg.pr.new/~/eslint-stylistic/eslint-stylistic"><img alt="pkg.new.pr" src="https://pkg.pr.new/badge/eslint-stylistic/eslint-stylistic?style=flat&color=32A9C3&logoSize=auto"></a>
<a href="https://npmjs.com/package/@stylistic/eslint-plugin"><img src="https://img.shields.io/npm/v/@stylistic/eslint-plugin?style=flat&colorA=1B3C4A&colorB=32A9C3" alt="npm version"></a>
<a href="https://npmjs.com/package/@stylistic/eslint-plugin"><img src="https://img.shields.io/npm/dm/@stylistic/eslint-plugin?style=flat&colorA=1B3C4A&colorB=32A9C3" alt="npm downloads"></a>
<a href="https://app.codecov.io/gh/eslint-stylistic/eslint-stylistic"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/eslint-stylistic/eslint-stylistic?token=B85J0E2I7I&style=flat&labelColor=1B3C4A&color=32A9C3&precision=1"></a>
</p>

Community-maintained stylistic/formatting ESLint rules for JavaScript and TypeScript.

This project was initiated as ESLint and `typescript-eslint` teams [decided to deprecate formatting/stylistic-related rules](https://github.com/eslint/eslint/issues/17522) from their core due to the maintenance cost. This repo ports those rules and distributes them as separate packages and will keep them maintained by the community.

## Quickstart (Flat Config)

```js
import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    plugins: { "@stylistic": stylistic },
    rules: {
      ...stylistic.configs.recommended.rules,
    },
  },
];
```

> Need even less boilerplate?
>
> ```js
> import { configs } from "@stylistic/eslint-plugin";
> export default [ configs.recommended ];
> ```

For more configuration options, see the [Getting Started Guide](https://eslint.style/guide/getting-started) and [Factory Guide](https://eslint.style/guide/config-presets#configuration-factory).

## License

[MIT](./LICENSE) License

&copy; OpenJS Foundation and other contributors, <www.openjsf.org><br>
&copy; 2023-PRESENT ESLint Stylistic contributors
