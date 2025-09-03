# Troubleshooting — Common Issues & Solutions

This guide covers the most frequently encountered problems when using ESLint Stylistic and their solutions.

### "I don't understand the difference between _preset_ and _factory_"

- **Preset** = a **set of rules** (`configs.recommended.rules`) to **inject** into a Flat Config block.
- **Factory** = **complete blocks** ready to **be inserted** into your config array (`configs.recommended`).

### "Indentation conflicts in JSX/TSX"

- Try to **activate only one** indentation rule. In Flat Config, prefer `@stylistic/indent` and **disable** `jsx-indent`/`jsx-indent-props` if you use them via other plugins.

```js
{
  plugins: { '@stylistic': stylistic },
  rules: {
    ...stylistic.configs.recommended.rules,
    "@stylistic/indent": ["error", 2],
    // If you had these rules elsewhere:
    "react/jsx-indent": "off",
    "react/jsx-indent-props": "off",
  }
}
```

### "Keyword spacing" vs "type annotation spacing"

- If you see conflicts around `as` or `:`, align the options of `@stylistic/type-annotation-spacing` and `@stylistic/keyword-spacing`.
- As a fallback, **disable one of the two** locally and open a minimal reproducible ticket.

### "Type errors when importing the plugin"

- In Flat Config, import **by default**:

  ```js
  import stylistic, { configs } from "@stylistic/eslint-plugin";
  ```

  and avoid importing undocumented internal paths.

For more advanced configuration options, see the [Factory Guide](/guide/config-presets#configuration-factory) and [Migration Guide](/guide/migration).

## Indentation Issues

### Inconsistent Indentation in JSX/TSX

**Symptoms**: Errors from `@stylistic/indent` on JSX elements or TypeScript constructs.

**Causes**: Multiple indentation rules conflicting with each other.

**Solutions**:

1. **Use only one indentation rule**. Disable conflicting rules:

   ```js
   // eslint.config.js
   export default [
     {
       plugins: { stylistic },
       rules: {
         ...stylistic.configs.recommended.rules,
         "@stylistic/indent": ["error", 2],
         // Disable conflicting rules
         "react/jsx-indent": "off",
         "react/jsx-indent-props": "off",
         "@typescript-eslint/indent": "off", // if using older TS-ESLint
       }
     }
   ];
   ```

2. **Configure indentation options** for complex cases:

   ```js
   {
     "@stylistic/indent": ["error", 2, {
       SwitchCase: 1,
       VariableDeclarator: 1,
       outerIIFEBody: 1,
       MemberExpression: 1,
       FunctionDeclaration: { parameters: 1, body: 1 },
       FunctionExpression: { parameters: 1, body: 1 },
       CallExpression: { arguments: 1 },
       ArrayExpression: 1,
       ObjectExpression: 1,
       ImportDeclaration: 1,
       flatTernaryExpressions: false,
       ignoreComments: false,
     }]
   }
   ```

### Switch Case Indentation

**Problem**: Inconsistent indentation in switch statements.

**Solution**: Configure the `SwitchCase` option:

```js
{
  "@stylistic/indent": ["error", 2, { SwitchCase: 1 }]
}
```

## Spacing Conflicts (TypeScript)

### Type Annotation Spacing Issues

**Symptoms**: Conflicts around `:`, `as`, `|`, `&` in TypeScript code.

**Causes**: Conflicting rules between `@stylistic/type-annotation-spacing` and `@stylistic/keyword-spacing`.

**Solutions**:

1. **Align the options** for both rules:

   ```js
   {
     "@stylistic/type-annotation-spacing": ["error", {
       before: false,
       after: true,
       overrides: {
         arrow: { before: true, after: true }
       }
     }],
     "@stylistic/keyword-spacing": ["error", {
       before: true,
       after: true,
       overrides: {
         as: { before: true, after: true }
       }
     }]
   }
   ```

2. **Disable one rule** for specific contexts:

   ```js
   {
     "@stylistic/keyword-spacing": ["error", {
       before: true,
       after: true,
       overrides: {
         as: { before: true, after: true },
         is: { before: true, after: true }
       }
     }],
     "@stylistic/space-infix-ops": "off", // if conflicts with type unions
   }
   ```

### Generic Type Spacing

**Problem**: Spacing issues with generics like `Array<T>` or `Promise<void>`.

**Solution**: Configure `@stylistic/type-generic-spacing`:

```js
{
  "@stylistic/type-generic-spacing": "error"
}
```

## Import and Type Errors

### "Cannot resolve module" or Type Import Errors

**Symptoms**: TypeScript compiler errors when importing the plugin in Flat Config.

**Causes**: Incorrect import syntax or missing type definitions.

**Solutions**:

1. **Use the correct import syntax**:

   ```js
   // Correct ✅
   import stylistic, { configs } from "@stylistic/eslint-plugin";

   // Incorrect ❌
   import * as stylistic from "@stylistic/eslint-plugin";
   import { default as stylistic } from "@stylistic/eslint-plugin";
   ```

2. **Avoid deep imports** from internal paths:

   ```js
   // Incorrect ❌
   import { rules } from "@stylistic/eslint-plugin/dist/rules";

   // Correct ✅
   import stylistic from "@stylistic/eslint-plugin";
   const rules = stylistic.rules;
   ```

3. **Check your TypeScript configuration** if using `eslint.config.ts`:

   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "moduleResolution": "node",
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true
     }
   }
   ```

## Configuration Issues

### Rules Not Applying

**Symptoms**: Stylistic rules don't seem to be active or aren't reporting violations.

**Causes**: Configuration ordering issues or incorrect plugin registration.

**Solutions**:

1. **Check plugin registration**:

   ```js
   export default [
     {
       plugins: {
         '@stylistic': stylistic, // Register under the '@stylistic' prefix
       },
       rules: {
         '@stylistic/semi': 'error', // Make sure to use the right prefix
       }
     }
   ];
   ```

2. **Verify configuration order** - rules are applied in the order they appear:

   ```js
   import { configs } from '@stylistic/eslint-plugin'
   export default [
     // Base configs first
     configs.recommended,

     // Your overrides last
     {
       rules: {
         '@stylistic/semi': 'always', // This will override the preset
       }
     }
   ];
   ```

3. **Check file patterns**:

   ```js
   export default [
     {
       files: ['**/*.{js,ts,jsx,tsx}'], // Ensure your files match
       plugins: { stylistic },
       rules: {
         '@stylistic/semi': 'error',
       }
     }
   ];
   ```

### Preset vs Factory Confusion

**Problem**: Not understanding when to use presets vs factory configs.

**Solution**: Choose based on your needs:

- **Use Factory** (`configs.recommended`) when you want simple, complete config blocks
- **Use Preset** (`...stylistic.configs.recommended.rules`) when you need fine control over merging rules

```js
// Factory approach - simpler
import { configs } from '@stylistic/eslint-plugin'
export default [
  configs.recommended,
];

// Preset approach - more control
import stylistic from '@stylistic/eslint-plugin'
export default [
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      ...stylistic.configs.recommended.rules,
      // Easy to add overrides here
      '@stylistic/semi': 'always',
    }
  }
];
```

## Performance Issues

### Slow Linting

**Symptoms**: ESLint takes significantly longer to run after adding Stylistic.

**Solutions**:

1. **Enable caching**:

   ```bash
   eslint --cache --cache-location .eslintcache
   ```

2. **Use specific file patterns** to avoid linting unnecessary files:

   ```js
   import stylistic from '@stylistic/eslint-plugin'
   export default [
     {
       files: ['src/**/*.{js,ts,jsx,tsx}'], // Be specific
       plugins: { '@stylistic': stylistic },
       rules: stylistic.configs.recommended.rules,
     }
   ];
   ```

3. **Consider using fewer rules** - start with `recommended` instead of `all`:

   ```js
   // Better performance
   import { configs } from '@stylistic/eslint-plugin'
   configs.recommended

   // Slower
   configs.all
   ```

## Integration with Other Tools

### Conflicts with Prettier

**Problem**: ESLint Stylistic and Prettier both trying to format the same code.

**Solutions**:

1. **Choose one tool**: Either use ESLint Stylistic OR Prettier, not both for the same rules.

2. **Use complementary rules**: Let Prettier handle formatting, Stylistic handle non-formatting style:

   ```js
   {
     plugins: { stylistic },
     rules: {
       // Keep these for code style (non-formatting)
       '@stylistic/prefer-template': 'error',
       '@stylistic/no-mixed-spaces-and-tabs': 'error',

       // Disable formatting rules that conflict with Prettier
       '@stylistic/indent': 'off',
       '@stylistic/quotes': 'off',
       '@stylistic/semi': 'off',
     }
   }
   ```

3. **Use eslint-config-prettier** to automatically disable conflicting rules:

   ```bash
   npm install --save-dev eslint-config-prettier
   ```

   ```js
   import { configs } from '@stylistic/eslint-plugin'
   import prettier from 'eslint-config-prettier'
   export default [
     configs.recommended,
     prettier, // This disables conflicting rules
   ];
   ```

### IDE Integration Issues

**Problem**: Your IDE (VS Code, WebStorm) isn't picking up the new rules.

**Solutions**:

1. **Restart the ESLint service** in your IDE
2. **Check the ESLint extension configuration**:
   - VS Code: Ensure "ESLint: Use Flat Config" is enabled for flat configs
   - Make sure the extension is looking in the right place for your config file

3. **Verify your config file name and location**:
   - `eslint.config.js` (flat config)
   - `.eslintrc.js` (legacy config, requires v3.x)

## Getting More Help

If you're still experiencing issues:

1. **Check the rule documentation** on the website for specific rule configurations
2. **Create a minimal reproducible example** to isolate the problem
3. **Search existing GitHub issues** at [eslint-stylistic/eslint-stylistic](https://github.com/eslint-stylistic/eslint-stylistic/issues)
4. **Open a new issue** with your minimal reproduction case

### Useful Debug Commands

```bash
# Check ESLint configuration
npx eslint --print-config src/index.js

# Run ESLint with debug output
DEBUG=eslint:* npx eslint src/

# Check which rules are enabled
npx eslint --print-config . | grep stylistic
```
