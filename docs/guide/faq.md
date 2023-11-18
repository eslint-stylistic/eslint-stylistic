# FAQ

## Why use ESLint for formatting?

Refer to [Why](/guide/why).

## What are Stylistic Rules?

According to [`typescript-eslint`'s definition](https://typescript-eslint.io/linting/troubleshooting/formatting/#eslint-core-and-formatting), most lint rules fall into one of two to three categories:

---

- **Logical**: Rules that are concerned with the logic and runtime behavior of code (such as missing awaits or invalid logical checks).
- **Stylistic**: Rules that focus on style concerns which do not generally impact the runtime behavior of code. These are mostly about naming or which roughly equivalent syntax constructs to use (such as function declarations vs. arrow functions).
  - **Formatting**: A subset of Stylistic rules that are solely concerned with trivia (semicolons, whitespace, etc.) and do not affect the runtime behavior of the code. These rules may conflict with dedicated formatters such as Prettier.

---

For ESLint Stylistic, our primary focus is on the **formatting** and **stylistic** rules inherited from `eslint` and `typescript-eslint`. We will maintain some stylistic rules; however, not all will be included. Their inclusion depends on whether the upstream projects choose to retain them. We welcome new rules proposed by the community for the future when we move into the maintenance phase and develop the infrastructure to introduce experimental rules. For more details, track the [Project Progress](/contribute/project-progress).

## What's the requirements for ESLint Stylistic?

Since majority of the rules are migreated from ESLint v8 and `typescript-eslint` v6, we inherit the same requirements:

- Node.js >=v16.0.0
- ESLint >=v8.0.0

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
##### JetBrains IDEs

- Open the Settings dialog (`Ctrl + Alt + S`)
- Go to `Languages & Frameworks -> JavaScript -> Code Quality Tools -> ESLint`
- Select the `Run eslint --fix on save` checkbox.

Refer to [JetBrains Docs](https://www.jetbrains.com/help/idea/eslint.html#ws_eslint_configure_run_eslint_on_save)

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
