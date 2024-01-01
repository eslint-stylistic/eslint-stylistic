/* eslint perfectionist/sort-objects: "error" */

import type { Linter } from 'eslint'
import type { RuleOptions } from '../dts/rule-options'
import plugin from '../src/plugin'

export interface StylisticCustomizeOptions<Flat extends boolean = true> {
  /**
   * Get a flat config
   * @default true
   */
  flat?: Flat
  /**
   * The name of the registered plugin, used to prefix rule IDs
   * @default '@stylistic'
   */
  pluginName?: string
  /**
   * Indentation level
   * Similar to the `tabWidth` and `useTabs` options in Prettier
   *
   * @default 2
   */
  indent?: number | 'tab'
  /**
   * Quote style
   * Similar to `singleQuote` option in Prettier
   *
   * @default 'single'
   */
  quotes?: 'single' | 'double'
  /**
   * Whether to enable semicolons
   * Similar to `semi` option in Prettier
   *
   * @default false
   */
  semi?: boolean
  /**
   * Enable JSX support
   * @default true
   */
  jsx?: boolean
  /**
   * When to enable arrow parenthesis
   * Similar to `arrowParens` option in Prettier
   *
   * @default false
   */
  arrowParens?: boolean
  /**
   * Which brace style to use
   * @default 'stroustrup'
   */
  braceStyle?: '1tbs' | 'stroustrup' | 'allman'
  /**
   * Whether to require spaces around braces
   * Similar to `bracketSpacing` option in Prettier
   *
   * @default true
   */
  blockSpacing?: boolean
  /**
   * When to enable prop quoting
   * Similar to `quoteProps` option in Prettier
   *
   * @default 'consistent-as-needed'
   */
  quoteProps?: 'always' | 'as-needed' | 'consistent' | 'consistent-as-needed'
  /**
   * When to enable comma dangles
   * Similar to `trailingComma` option in Prettier
   *
   * @default 'always-multiline'
   */
  commaDangle?: 'never' | 'always' | 'always-multiline' | 'only-multiline'
}

type Rules = Partial<{
  [K in keyof RuleOptions]: Linter.RuleLevel | [Linter.RuleLevel, ...RuleOptions[K]]
}>

/**
 * A factory function to customize the recommended config
 */
export function customize(options: StylisticCustomizeOptions<false>): Linter.BaseConfig
export function customize(options?: StylisticCustomizeOptions<true>): Linter.FlatConfig
export function customize(options: StylisticCustomizeOptions<boolean> = {}): Linter.FlatConfig | Linter.BaseConfig {
  const {
    arrowParens = false,
    blockSpacing = true,
    braceStyle = 'stroustrup',
    commaDangle = 'always-multiline',
    flat = true,
    indent = 2,
    jsx = true,
    pluginName = '@stylistic',
    quoteProps = 'consistent-as-needed',
    quotes = 'single',
    semi = false,
  } = options

  let rules: Rules = {
    '@stylistic/array-bracket-spacing': ['error', 'never'],
    '@stylistic/arrow-parens': ['error', arrowParens ? 'always' : 'as-needed', { requireForBlockBody: true }],
    '@stylistic/arrow-spacing': ['error', { after: true, before: true }],
    '@stylistic/block-spacing': ['error', blockSpacing ? 'always' : 'never'],
    '@stylistic/brace-style': ['error', braceStyle, { allowSingleLine: true }],
    '@stylistic/comma-dangle': ['error', commaDangle],
    '@stylistic/comma-spacing': ['error', { after: true, before: false }],
    '@stylistic/comma-style': ['error', 'last'],
    '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
    '@stylistic/dot-location': ['error', 'property'],
    '@stylistic/eol-last': 'error',
    '@stylistic/indent': ['error', indent, {
      ArrayExpression: 1,
      CallExpression: { arguments: 1 },
      flatTernaryExpressions: false,
      FunctionDeclaration: { body: 1, parameters: 1 },
      FunctionExpression: { body: 1, parameters: 1 },
      ignoreComments: false,
      ignoredNodes: [
        'TemplateLiteral *',
        'JSXElement',
        'JSXElement > *',
        'JSXAttribute',
        'JSXIdentifier',
        'JSXNamespacedName',
        'JSXMemberExpression',
        'JSXSpreadAttribute',
        'JSXExpressionContainer',
        'JSXOpeningElement',
        'JSXClosingElement',
        'JSXFragment',
        'JSXOpeningFragment',
        'JSXClosingFragment',
        'JSXText',
        'JSXEmptyExpression',
        'JSXSpreadChild',
        'TSUnionType',
        'TSIntersectionType',
        'TSTypeParameterInstantiation',
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
        'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
      ],
      ImportDeclaration: 1,
      MemberExpression: 1,
      ObjectExpression: 1,
      offsetTernaryExpressions: true,
      outerIIFEBody: 1,
      SwitchCase: 1,
      VariableDeclarator: 1,
    }],
    '@stylistic/indent-binary-ops': ['error', indent],
    '@stylistic/key-spacing': ['error', { afterColon: true, beforeColon: false }],
    '@stylistic/keyword-spacing': ['error', { after: true, before: true }],
    '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    '@stylistic/max-statements-per-line': ['error', { max: 1 }],
    '@stylistic/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none',
      },
      multilineDetection: 'brackets',
      overrides: {
        interface: {
          multiline: {
            delimiter: 'none',
          },
        },
      },
      singleline: {
        delimiter: 'comma',
      },
    }],
    '@stylistic/multiline-ternary': ['error', 'always-multiline'],
    '@stylistic/new-parens': 'error',
    '@stylistic/no-extra-parens': ['error', 'functions'],
    '@stylistic/no-floating-decimal': 'error',
    '@stylistic/no-mixed-operators': ['error', {
      allowSamePrecedence: true,
      groups: [
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
    }],
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/no-tabs': indent === 'tab' ? 'off' : 'error',
    '@stylistic/no-trailing-spaces': 'error',
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/operator-linebreak': ['error', 'before'],
    '@stylistic/padded-blocks': ['error', { blocks: 'never', classes: 'never', switches: 'never' }],
    '@stylistic/quote-props': ['error', quoteProps],
    '@stylistic/quotes': ['error', quotes, { allowTemplateLiterals: true, avoidEscape: false }],
    '@stylistic/rest-spread-spacing': ['error', 'never'],
    '@stylistic/semi': ['error', semi ? 'always' : 'never'],
    '@stylistic/semi-spacing': ['error', { after: true, before: false }],
    '@stylistic/space-before-blocks': ['error', 'always'],
    '@stylistic/space-before-function-paren': ['error', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
    '@stylistic/space-in-parens': ['error', 'never'],
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/space-unary-ops': ['error', { nonwords: false, words: true }],
    '@stylistic/spaced-comment': ['error', 'always', {
      block: {
        balanced: true,
        exceptions: ['*'],
        markers: ['!'],
      },
      line: {
        exceptions: ['/', '#'],
        markers: ['/'],
      },
    }],
    '@stylistic/template-curly-spacing': 'error',
    '@stylistic/template-tag-spacing': ['error', 'never'],
    '@stylistic/type-annotation-spacing': ['error', {}],
    '@stylistic/type-generic-spacing': 'error',
    '@stylistic/type-named-tuple-spacing': 'error',
    '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
    '@stylistic/yield-star-spacing': ['error', 'both'],

    ...jsx
      ? {
          '@stylistic/jsx-closing-bracket-location': 'error',
          '@stylistic/jsx-closing-tag-location': 'error',
          '@stylistic/jsx-curly-brace-presence': ['error', { propElementValues: 'always' }],
          '@stylistic/jsx-curly-newline': 'error',
          '@stylistic/jsx-curly-spacing': ['error', 'never'],
          '@stylistic/jsx-equals-spacing': 'error',
          '@stylistic/jsx-first-prop-new-line': 'error',
          '@stylistic/jsx-indent': ['error', indent, { checkAttributes: true, indentLogicalExpressions: true }],
          '@stylistic/jsx-indent-props': ['error', indent],
          '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
          '@stylistic/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
          '@stylistic/jsx-quotes': 'error',
          '@stylistic/jsx-tag-spacing': [
            'error',
            {
              afterOpening: 'never',
              beforeClosing: 'never',
              beforeSelfClosing: 'always',
              closingSlash: 'never',
            },
          ],
          '@stylistic/jsx-wrap-multilines': [
            'error',
            {
              arrow: 'parens-new-line',
              assignment: 'parens-new-line',
              condition: 'parens-new-line',
              declaration: 'parens-new-line',
              logical: 'parens-new-line',
              prop: 'parens-new-line',
              return: 'parens-new-line',
            },
          ],
        }
      : {},
  }

  if (pluginName !== '@stylistic') {
    const regex = /^@stylistic\//
    rules = Object.fromEntries(
      Object.entries(rules!)
        .map(([ruleName, ruleConfig]) => [
          ruleName.replace(regex, `${pluginName}/`),
          ruleConfig,
        ]),
    )
  }

  if (flat) {
    return {
      plugins: {
        [pluginName]: plugin,
      },
      rules,
    } satisfies Linter.FlatConfig
  }
  else {
    if (pluginName !== '@stylistic')
      throw new Error('PluginName in non-flat config can not be customized')

    return {
      plugins: ['@stylistic'],
      rules,
    } satisfies Linter.BaseConfig
  }
}
