import type { Linter } from 'eslint'
import { customize } from './customize'

const base = /* @__PURE__ */ customize({
  arrowParens: true,
  braceStyle: '1tbs',
  quoteProps: 'as-needed',
  quotes: 'double',
  semi: true,
})

/**
 * The recommended config, adjusted so that code formatted by Prettier with its default options passes as is.
 * Rules that Prettier handles differently are configured to match it, or turned off when that's not possible.
 */
const config: Linter.Config = {
  ...base,
  rules: {
    ...base.rules,
    '@stylistic/brace-style': ['error', '1tbs'],
    // Prettier doesn't add a trailing comma to multiline `import()` calls
    '@stylistic/comma-dangle': ['error', {
      arrays: 'always-multiline',
      dynamicImports: 'never',
      enums: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
      generics: 'always-multiline',
      importAttributes: 'always-multiline',
      imports: 'always-multiline',
      objects: 'always-multiline',
      tuples: 'always-multiline',
    }],
    // `function* foo() {}`, but `*foo() {}` and `static *foo() {}` for methods
    '@stylistic/generator-star-spacing': ['error', {
      after: true,
      before: false,
      method: { after: false, before: true },
    }],
    // Prettier's indentation differs in several places, e.g. ternaries and binary expressions
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/845
    '@stylistic/indent': 'off',
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/676
    '@stylistic/indent-binary-ops': 'off',
    // Prettier keeps braces around string literals, e.g. `a={"b"}`
    '@stylistic/jsx-curly-brace-presence': 'off',
    // Prettier fills JSX text and inline elements up to the print width
    '@stylistic/jsx-one-expression-per-line': 'off',
    // Prettier doesn't wrap multiline JSX attribute values in parens
    '@stylistic/jsx-wrap-multilines': ['error', {
      arrow: 'parens-new-line',
      assignment: 'parens-new-line',
      condition: 'parens-new-line',
      declaration: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'ignore',
      propertyValue: 'parens-new-line',
      return: 'parens-new-line',
    }],
    // Prettier keeps class members as they are written, with or without blank lines between them
    '@stylistic/lines-between-class-members': 'off',
    // Prettier hugs the last call argument (`foo((a) =>\n  b,\n)`) and fills arrays of numbers
    '@stylistic/list-style': ['error', {
      overrides: {
        ArrayExpression: 'off',
        CallExpression: 'off',
        NewExpression: 'off',
      },
    }],
    // Prettier keeps `cond ? (` on one line when the branches are multiline JSX
    '@stylistic/multiline-ternary': 'off',
    // Prettier puts `|` first in multiline union types but other operators last,
    // and keeps comments right after an operator, e.g. `? // comment`
    // https://github.com/eslint-stylistic/eslint-stylistic/issues/870
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/quotes': ['error', 'double', { allowTemplateLiterals: 'always', avoidEscape: true }],
    // Prettier keeps comments as they are written, e.g. `/*****/` or `//////`
    '@stylistic/spaced-comment': 'off',
  },
}

export default config
