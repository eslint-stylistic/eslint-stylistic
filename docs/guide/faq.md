# FAQ

## Why use ESLint for formatting?

Refer to [Why](/guide/why).

## What are Stylistic Rules?

According to [TypeScript ESLint's definition](https://typescript-eslint.io/linting/troubleshooting/formatting/#eslint-core-and-formatting), most lint rules fall into one of two to three categories:

---

- **Logical**: Rules that care about the logic in runtime behavior of code (such as missing awaits or invalid logical checks).
- **Stylistic**: Rules that care about style concerns which do impact runtime behavior of code, but generally not logic. These are mostly around naming or which roughly-equivalent syntax constructs to use (such as function declarations vs. arrow functions).
  - **Formatting**: Stylistic rules that care only about trivia (semicolons, whitespace, etc.) without impacting the runtime behavior of the code. These rules conflict with dedicated formatters such as Prettier.

---

For ESLint Stylistic, our main scope is the **formatting** and **stylistic** rules inherited from `eslint` / `@typescript-eslint`. We will maintain some stylistic rules, but not all stylistic rules will be included, depends whether the upstream projects want to keep them or not. We are welcoming new rules proposed by the community in the future when we move to the maintenance stage and developed the infrastructure for introducing experimental rules. Track on [Project Progress](/contribute/project-progress) for more details.

## How to auto-format on save?

##### VS Code

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
```

## The error messages (squiggly lines) for code style are annoying

If you are using VS Code, you can override them with the following settings in your `.vscode/settings.json`:

```jsonc
{
  "eslint.rules.customizations": [
    {
      "rule": "@stylistic/*",
      "severity": "off"
    }
  ]
}
```

This tells VS Code to not show errors in your editor, but still have the ability to auto-fix them.

## How can I migrate?

Refer to [Migration Guide](/guide/migration).

## When should I migrate?

Also refer to [Migration Guide](/guide/migration#when-should-i-migrate).
