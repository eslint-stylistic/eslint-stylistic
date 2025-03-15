/* eslint perfectionist/sort-objects: "error" */

import type { Linter } from 'eslint'
import type { StylisticCustomizeOptions } from '../dts/options'
import type { RuleOptions } from '../dts/rule-options'
import plugin from '../src/plugin'

type Rules = Partial<{
  [K in keyof RuleOptions]: Linter.RuleSeverity | [Linter.RuleSeverity, ...RuleOptions[K]]
}>

/**
 * A factory function to customize the recommended config
 */
export function customize(options: StylisticCustomizeOptions = {}): Linter.Config {
  const {
    arrowParens = false,
    blockSpacing = true,
    braceStyle = 'stroustrup',
    commaDangle = 'always-multiline',
    indent = 2,
    jsx = true,
    pluginName = '@stylistic',
    quoteProps = 'consistent-as-needed',
    quotes = 'single',
    semi = false,
    severity = 'error',
  } = options

  let rules: Rules = {
    '@stylistic/array-bracket-spacing': [severity, 'never'],
    '@stylistic/arrow-parens': [severity, arrowParens ? 'always' : 'as-needed', { requireForBlockBody: true }],
    '@stylistic/arrow-spacing': [severity, { after: true, before: true }],
    '@stylistic/block-spacing': [severity, blockSpacing ? 'always' : 'never'],
    '@stylistic/brace-style': [severity, braceStyle, { allowSingleLine: true }],
    '@stylistic/comma-dangle': [severity, commaDangle],
    '@stylistic/comma-spacing': [severity, { after: true, before: false }],
    '@stylistic/comma-style': [severity, 'last'],
    '@stylistic/computed-property-spacing': [severity, 'never', { enforceForClassMembers: true }],
    '@stylistic/dot-location': [severity, 'property'],
    '@stylistic/eol-last': severity,
    '@stylistic/generator-star-spacing': [severity, { after: true, before: false }],
    '@stylistic/indent': [severity, indent, {
      ArrayExpression: 1,
      CallExpression: { arguments: 1 },
      flatTernaryExpressions: false,
      FunctionDeclaration: { body: 1, parameters: 1 },
      FunctionExpression: { body: 1, parameters: 1 },
      ignoreComments: false,
      ignoredNodes: [
        'TSUnionType',
        'TSIntersectionType',
        'TSTypeParameterInstantiation',
        'FunctionExpression > .params[decorators.length > 0]',
        'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
      ],
      ImportDeclaration: 1,
      MemberExpression: 1,
      ObjectExpression: 1,
      offsetTernaryExpressions: true,
      outerIIFEBody: 1,
      SwitchCase: 1,
      tabLength: indent === 'tab' ? 4 : indent,
      VariableDeclarator: 1,
    }],
    '@stylistic/indent-binary-ops': [severity, indent],
    '@stylistic/key-spacing': [severity, { afterColon: true, beforeColon: false }],
    '@stylistic/keyword-spacing': [severity, { after: true, before: true }],
    '@stylistic/lines-between-class-members': [severity, 'always', { exceptAfterSingleLine: true }],
    '@stylistic/max-statements-per-line': [severity, { max: 1 }],
    '@stylistic/member-delimiter-style': [severity, {
      multiline: {
        delimiter: semi ? 'semi' : 'none',
        requireLast: semi,
      },
      multilineDetection: 'brackets',
      overrides: {
        interface: {
          multiline: {
            delimiter: semi ? 'semi' : 'none',
            requireLast: semi,
          },
        },
      },
      singleline: {
        delimiter: semi ? 'semi' : 'comma',
      },
    }],
    '@stylistic/multiline-ternary': [severity, 'always-multiline'],
    '@stylistic/new-parens': severity,
    '@stylistic/no-extra-parens': [severity, 'functions'],
    '@stylistic/no-floating-decimal': severity,
    '@stylistic/no-mixed-operators': [severity, {
      allowSamePrecedence: true,
      groups: [
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
    }],
    '@stylistic/no-mixed-spaces-and-tabs': severity,
    '@stylistic/no-multi-spaces': severity,
    '@stylistic/no-multiple-empty-lines': [severity, { max: 1, maxBOF: 0, maxEOF: 0 }],
    '@stylistic/no-tabs': indent === 'tab' ? 'off' : severity,
    '@stylistic/no-trailing-spaces': severity,
    '@stylistic/no-whitespace-before-property': severity,
    '@stylistic/object-curly-spacing': [severity, 'always'],
    '@stylistic/operator-linebreak': [severity, 'before'],
    '@stylistic/padded-blocks': [severity, { blocks: 'never', classes: 'never', switches: 'never' }],
    '@stylistic/quote-props': [severity, quoteProps],
    '@stylistic/quotes': [severity, quotes, { allowTemplateLiterals: true, avoidEscape: false }],
    '@stylistic/rest-spread-spacing': [severity, 'never'],
    '@stylistic/semi': [severity, semi ? 'always' : 'never'],
    '@stylistic/semi-spacing': [severity, { after: true, before: false }],
    '@stylistic/space-before-blocks': [severity, 'always'],
    '@stylistic/space-before-function-paren': [severity, { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
    '@stylistic/space-in-parens': [severity, 'never'],
    '@stylistic/space-infix-ops': severity,
    '@stylistic/space-unary-ops': [severity, { nonwords: false, words: true }],
    '@stylistic/spaced-comment': [severity, 'always', {
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
    '@stylistic/template-curly-spacing': severity,
    '@stylistic/template-tag-spacing': [severity, 'never'],
    '@stylistic/type-annotation-spacing': [severity, {}],
    '@stylistic/type-generic-spacing': severity,
    '@stylistic/type-named-tuple-spacing': severity,
    '@stylistic/wrap-iife': [severity, 'any', { functionPrototypeMethods: true }],
    '@stylistic/yield-star-spacing': [severity, { after: true, before: false }],

    ...jsx
      ? {
          '@stylistic/jsx-closing-bracket-location': severity,
          '@stylistic/jsx-closing-tag-location': severity,
          '@stylistic/jsx-curly-brace-presence': [severity, { propElementValues: 'always' }],
          '@stylistic/jsx-curly-newline': severity,
          '@stylistic/jsx-curly-spacing': [severity, 'never'],
          '@stylistic/jsx-equals-spacing': severity,
          '@stylistic/jsx-first-prop-new-line': severity,
          '@stylistic/jsx-function-call-newline': [severity, 'multiline'],
          '@stylistic/jsx-indent-props': [severity, indent],
          '@stylistic/jsx-max-props-per-line': [severity, { maximum: 1, when: 'multiline' }],
          '@stylistic/jsx-one-expression-per-line': [severity, { allow: 'single-child' }],
          '@stylistic/jsx-quotes': severity,
          '@stylistic/jsx-tag-spacing': [
            severity,
            {
              afterOpening: 'never',
              beforeClosing: 'never',
              beforeSelfClosing: 'always',
              closingSlash: 'never',
            },
          ],
          '@stylistic/jsx-wrap-multilines': [
            severity,
            {
              arrow: 'parens-new-line',
              assignment: 'parens-new-line',
              condition: 'parens-new-line',
              declaration: 'parens-new-line',
              logical: 'parens-new-line',
              prop: 'parens-new-line',
              propertyValue: 'parens-new-line',
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

  return {
    plugins: {
      [pluginName]: plugin,
    },
    rules,
  } satisfies Linter.Config
}
