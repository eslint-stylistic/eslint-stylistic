# Migrating from Prettier

Migrating from using Prettier for code formatting to using this project is extremely straightforward, and this page will walk you through the process of getting set up. For more information as to why you might use this package in place of Prettier, refer to [Why](/guide/why).

The first step is to follow the [Getting Started](/guide/getting-started) guide. This will walk you through the process of getting setup to use this package, as well as adding it to your config.

## Options

### Supported Options

The following Prettier options are supported:

- `arrowParens`
  - default: `false`
  - supported values:
    - `true`: always use parenthesis around arrow functions
    - `false`: avoid parenthesis around arrow functions
- `bracketSpacing` (use option `blockSpacing`)
  - default: `true`
  - supported values:
    - `true`: always use spaces
    - `false`: never use spaces
- `endOfLine` (see [printWidth and endOfLine](#printwidth-and-endofline))
- `printWidth` (see [printWidth and endOfLine](#printwidth-and-endofline))
- `quoteProps`
  - default: `'consistent-as-needed'`
  - supported values:
    - `'always'`: always quote object properties, whether required or not
    - `'as-needed'`: only quote object properties that require quotes
    - `'consistent-as-needed'`: only quote object properties that require quotes, but if any property in the object requires quotes, all properties require quotes
    - `'consistent'`: if one property is quoted, whether required or not, all properties must be quoted
- `quotes`
  - default: `'single'`
  - supported values: `'single'` `'double'`
- `semi`
  - default `false`
  - supported values:
    - `true`: require semicolons
    - `false`: don't require semicolons
- `tabWidth` and `useTabs` (use option `indent`)
  - default `2`
  - supported values:
    - `<number>`: the number of spaces to use for tabs, cannot be combined with hard tabs
    - `'tab'`: use hard tabs instead of spaces, cannot be combined with a number of spaces
- `trailingCommas` (use option `commaDangle`)
  - default: `'always-multiline'`
  - supported values:
    - `'never'`: never allow or require trailing commas
    - `'always'`: always require trailing commas
    - `'always-multiline'`: always require trailing commas for multiline statements (i.e. object definitions)
    - `'only-multiline'`: only allow trailing commas for multiline statements

### Unsupported Options

The following Prettier options are not supported (at this time):

- `bracketSameLine`
- `htmlWhitespaceSensitivity`
- `jsxSingleQuote`
- `singleAttributePerLine`

The following Prettier options are not supported because they relate to Prettier's parser system:

- `embeddedLanguageFormatting`
- `insertPragma`
- `overrides`
- `parser`
- `plugins`
- `range`
- `requirePragma`

## Configuration

Using the default options listed above will produce a config roughly equivalent to the following Prettier config

```json
{
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "quoteProps": "consistent",
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingCommas": "es5",
  "useTabs": false
}
```

### printWidth and endOfLine

To setup `printWidth` and `endOfLine`, you need to configure them manually because they are not included in the configuration factory. Thankfully, this is pretty simple.

For `printWidth` the eslint-stylistic rule [`max-len`](/rules/js/max-len) is used, and for `endOfLine` the appropriate rule is [`linebreak-style`](/rules/js/linebreak-style). Below is an example of how you can configure these rules

::: code-group

```js [Flat Config]
// eslint.config.js
import stylistic from '@stylistic/eslint-plugin'

// using the default values
const stylisticConfig = stylistic.configs.customize()

// assuming unix line endings
stylisticConfig.rules['@stylistic/linebreak-style'] = ['error', 'unix']

// assuming a max length of 80 characters
stylisticConfig.rules['@stylistic/max-len'] = ['error', { code: 80 }]

export default [stylisticConfig]
```

```js [Legacy Config]
const stylistic = require('@stylistic/eslint-plugin')

// using the default values
const customized = stylistic.configs.customize()

module.exports = {
  plugins: ['@stylistic'],
  rules: {
    ...customized.rules,

    // assuming unix line endings
    '@stylistic/linebreak-style': ['error', 'unix']

    // assuming max length of 80 characters
    '@stylistic/max-len': ['error', { code: 80 }]
  }
}
```

:::

The above configs would both be roughly equivalent to the following Prettier configuration:

```json
{
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "printWidth": 80,
  "quoteProps": "consistent",
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingCommas": "es5",
  "useTabs": false
}
```

### Further steps

Once you have configured this package to handle the formatting of your source code, it may be necessary to tell Prettier to ignore your source files (assuming you still need Prettier for other things, such as markdown or JSON). This can be accomplished in a few ways.

First, you could configure Prettier to require pragmas, and simply not put pragmas into your source code. Alternatively, you can use a `.prettierignore` file to ignore your source code. Assuming you have a React project using TypeScript, your `.prettierignore` file may contain the following:

```txt
**/*.js
**/*.jsx
**/*.ts
**/*.tsx
```

Ultimately, what is listed above is merely a suggestion; and you can tackle the problem however you see fit, including just not using Prettier at all.
