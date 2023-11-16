/**
 * @fileoverview Rule to require or disallow line breaks inside braces.
 * @author Toru Nagashima
 */

import { isCommentToken, isTokenOnSameLine } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'
import type { JSONSchema, Token, Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

// Schema objects.
const OPTION_VALUE: JSONSchema.JSONSchema4 = {
  oneOf: [
    {
      type: 'string',
      enum: ['always', 'never'],
    },
    {
      type: 'object',
      properties: {
        multiline: {
          type: 'boolean',
        },
        minProperties: {
          type: 'integer',
          minimum: 0,
        },
        consistent: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
      minProperties: 1,
    },
  ],
}

/**
 * Normalizes a given option value.
 * @param {string | object | undefined} value An option value to parse.
 * @returns {{multiline: boolean, minProperties: number, consistent: boolean}} Normalized option object.
 */
function normalizeOptionValue(value: any) {
  let multiline = false
  let minProperties = Number.POSITIVE_INFINITY
  let consistent = false

  if (value) {
    if (value === 'always') {
      minProperties = 0
    }
    else if (value === 'never') {
      minProperties = Number.POSITIVE_INFINITY
    }
    else {
      multiline = Boolean(value.multiline)
      minProperties = value.minProperties || Number.POSITIVE_INFINITY
      consistent = Boolean(value.consistent)
    }
  }
  else {
    consistent = true
  }

  return { multiline, minProperties, consistent }
}

/**
 * Checks if a value is an object.
 * @param {any} value The value to check
 * @returns {boolean} `true` if the value is an object, otherwise `false`
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * Checks if an option is a node-specific option
 * @param {any} option The option to check
 * @returns {boolean} `true` if the option is node-specific, otherwise `false`
 */
function isNodeSpecificOption(option: unknown) {
  return isObject(option) || typeof option === 'string'
}

/**
 * Normalizes a given option value.
 * @param {string | object | undefined} options An option value to parse.
 * @returns {{
 *   ObjectExpression: {multiline: boolean, minProperties: number, consistent: boolean},
 *   ObjectPattern: {multiline: boolean, minProperties: number, consistent: boolean},
 *   ImportDeclaration: {multiline: boolean, minProperties: number, consistent: boolean},
 *   ExportNamedDeclaration : {multiline: boolean, minProperties: number, consistent: boolean}
 * }} Normalized option object.
 */
function normalizeOptions(options: any) {
  if (isObject(options) && Object.values(options).some(isNodeSpecificOption)) {
    return {
      ObjectExpression: normalizeOptionValue(options.ObjectExpression),
      ObjectPattern: normalizeOptionValue(options.ObjectPattern),
      ImportDeclaration: normalizeOptionValue(options.ImportDeclaration),
      ExportNamedDeclaration: normalizeOptionValue(options.ExportDeclaration),
    }
  }

  const value = normalizeOptionValue(options)

  return { ObjectExpression: value, ObjectPattern: value, ImportDeclaration: value, ExportNamedDeclaration: value }
}

/**
 * Determines if ObjectExpression, ObjectPattern, ImportDeclaration or ExportNamedDeclaration
 * node needs to be checked for missing line breaks
 * @param {ASTNode} node Node under inspection
 * @param {object} options option specific to node type
 * @param {Token} first First object property
 * @param {Token} last Last object property
 * @returns {boolean} `true` if node needs to be checked for missing line breaks
 */
function areLineBreaksRequired(
  node:
    | Tree.ObjectExpression
    | Tree.ObjectPattern
    | Tree.ImportDeclaration
    | Tree.ExportNamedDeclaration,
  options: { multiline: boolean, minProperties: number, consistent: boolean },
  first: Token,
  last: Token,
) {
  let objectProperties

  if (node.type === 'ObjectExpression' || node.type === 'ObjectPattern') {
    objectProperties = node.properties
  }
  else {
    // is ImportDeclaration or ExportNamedDeclaration
    objectProperties = node.specifiers
      .filter(s => s.type === 'ImportSpecifier' || s.type === 'ExportSpecifier')
  }

  return objectProperties.length >= options.minProperties
    || (
      options.multiline
      && objectProperties.length > 0
      && first.loc.start.line !== last.loc.end.line
    )
}

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent line breaks after opening and before closing braces',
      url: 'https://eslint.style/rules/js/object-curly-newline',
    },

    fixable: 'whitespace',

    schema: [
      {
        oneOf: [
          OPTION_VALUE,
          {
            type: 'object',
            properties: {
              ObjectExpression: OPTION_VALUE,
              ObjectPattern: OPTION_VALUE,
              ImportDeclaration: OPTION_VALUE,
              ExportDeclaration: OPTION_VALUE,
            },
            additionalProperties: false,
            minProperties: 1,
          },
        ],
      },
    ],

    messages: {
      unexpectedLinebreakBeforeClosingBrace: 'Unexpected line break before this closing brace.',
      unexpectedLinebreakAfterOpeningBrace: 'Unexpected line break after this opening brace.',
      expectedLinebreakBeforeClosingBrace: 'Expected a line break before this closing brace.',
      expectedLinebreakAfterOpeningBrace: 'Expected a line break after this opening brace.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const normalizedOptions = normalizeOptions(context.options[0])

    /**
     * Reports a given node if it violated this rule.
     * @param {ASTNode} node A node to check. This is an ObjectExpression, ObjectPattern, ImportDeclaration or ExportNamedDeclaration node.
     * @returns {void}
     */
    function check(
      node:
        | Tree.ObjectExpression
        | Tree.ObjectPattern
        | Tree.ImportDeclaration
        | Tree.ExportNamedDeclaration,
    ) {
      const options = normalizedOptions[node.type]

      if (
        (node.type === 'ImportDeclaration'
        && !node.specifiers.some(specifier => specifier.type === 'ImportSpecifier'))
        || (node.type === 'ExportNamedDeclaration'
        && !node.specifiers.some(specifier => specifier.type === 'ExportSpecifier'))
      )
        return

      const openBrace = sourceCode.getFirstToken(node, token => token.value === '{')!

      let closeBrace: Token

      if (node.type === 'ObjectPattern' && node.typeAnnotation)
        closeBrace = sourceCode.getTokenBefore(node.typeAnnotation)!
      else
        closeBrace = sourceCode.getLastToken(node, token => token.value === '}')!

      let first = sourceCode.getTokenAfter(openBrace, { includeComments: true })!
      let last = sourceCode.getTokenBefore(closeBrace, { includeComments: true })!

      const needsLineBreaks = areLineBreaksRequired(node, options, first, last)

      const hasCommentsFirstToken = isCommentToken(first)
      const hasCommentsLastToken = isCommentToken(last)

      /**
       * Use tokens or comments to check multiline or not.
       * But use only tokens to check whether line breaks are needed.
       * This allows:
       *     var obj = { // eslint-disable-line foo
       *         a: 1
       *     }
       */
      first = sourceCode.getTokenAfter(openBrace)!
      last = sourceCode.getTokenBefore(closeBrace)!

      if (needsLineBreaks) {
        if (isTokenOnSameLine(openBrace, first)) {
          context.report({
            messageId: 'expectedLinebreakAfterOpeningBrace',
            node,
            loc: openBrace.loc,
            fix(fixer) {
              if (hasCommentsFirstToken)
                return null

              return fixer.insertTextAfter(openBrace, '\n')
            },
          })
        }
        if (isTokenOnSameLine(last, closeBrace)) {
          context.report({
            messageId: 'expectedLinebreakBeforeClosingBrace',
            node,
            loc: closeBrace.loc,
            fix(fixer) {
              if (hasCommentsLastToken)
                return null

              return fixer.insertTextBefore(closeBrace, '\n')
            },
          })
        }
      }
      else {
        const consistent = options.consistent
        const hasLineBreakBetweenOpenBraceAndFirst = !isTokenOnSameLine(openBrace, first)
        const hasLineBreakBetweenCloseBraceAndLast = !isTokenOnSameLine(last, closeBrace)

        if (
          (!consistent && hasLineBreakBetweenOpenBraceAndFirst)
          || (consistent && hasLineBreakBetweenOpenBraceAndFirst && !hasLineBreakBetweenCloseBraceAndLast)
        ) {
          context.report({
            messageId: 'unexpectedLinebreakAfterOpeningBrace',
            node,
            loc: openBrace.loc,
            fix(fixer) {
              if (hasCommentsFirstToken)
                return null

              return fixer.removeRange([
                openBrace.range[1],
                first.range[0],
              ])
            },
          })
        }
        if (
          (!consistent && hasLineBreakBetweenCloseBraceAndLast)
          || (consistent && !hasLineBreakBetweenOpenBraceAndFirst && hasLineBreakBetweenCloseBraceAndLast)
        ) {
          context.report({
            messageId: 'unexpectedLinebreakBeforeClosingBrace',
            node,
            loc: closeBrace.loc,
            fix(fixer) {
              if (hasCommentsLastToken)
                return null

              return fixer.removeRange([
                last.range[1],
                closeBrace.range[0],
              ])
            },
          })
        }
      }
    }

    return {
      ObjectExpression: check,
      ObjectPattern: check,
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
    }
  },
})
