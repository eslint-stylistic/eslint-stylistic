import type { JSONSchema, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isCommentToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

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

const defaultOptionValue = { multiline: false, minProperties: Number.POSITIVE_INFINITY, consistent: true }

interface NormalizedOptions {
  ObjectExpression: { multiline: boolean, minProperties: number, consistent: boolean }
  ObjectPattern: { multiline: boolean, minProperties: number, consistent: boolean }
  ImportDeclaration: { multiline: boolean, minProperties: number, consistent: boolean }
  ExportNamedDeclaration: { multiline: boolean, minProperties: number, consistent: boolean }
  TSTypeLiteral: { multiline: boolean, minProperties: number, consistent: boolean }
  TSInterfaceBody: { multiline: boolean, minProperties: number, consistent: boolean }
  TSEnumBody: { multiline: boolean, minProperties: number, consistent: boolean }
}

export default createRule<RuleOptions, MessageIds>({
  name: 'object-curly-newline',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent line breaks after opening and before closing braces',
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
              TSTypeLiteral: OPTION_VALUE,
              TSInterfaceBody: OPTION_VALUE,
              TSEnumBody: OPTION_VALUE,
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
  defaultOptions: [
    {
      ObjectExpression: defaultOptionValue,
      ObjectPattern: defaultOptionValue,
      ImportDeclaration: defaultOptionValue,
      ExportDeclaration: defaultOptionValue,
      TSTypeLiteral: defaultOptionValue,
      TSInterfaceBody: defaultOptionValue,
    },
  ],

  create(context) {
    const sourceCode = context.sourceCode

    /**
     * Normalizes a given option value.
     * @param value An option value to parse.
     * @returns Normalized option object.
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
     * @param value The value to check
     * @returns `true` if the value is an object, otherwise `false`
     */
    function isObject(value: unknown): value is Record<string, unknown> {
      return typeof value === 'object' && value !== null
    }

    /**
     * Checks if an option is a node-specific option
     * @param option The option to check
     * @returns `true` if the option is node-specific, otherwise `false`
     */
    function isNodeSpecificOption(option: unknown) {
      return isObject(option) || typeof option === 'string'
    }

    /**
     * Normalizes a given option value.
     * @param options An option value to parse.
     * @returns Normalized option object.
     */
    function normalizeOptions(options: any): NormalizedOptions {
      if (isObject(options) && Object.values(options).some(isNodeSpecificOption)) {
        return {
          ObjectExpression: normalizeOptionValue(options.ObjectExpression),
          ObjectPattern: normalizeOptionValue(options.ObjectPattern),
          ImportDeclaration: normalizeOptionValue(options.ImportDeclaration),
          ExportNamedDeclaration: normalizeOptionValue(options.ExportDeclaration),
          TSTypeLiteral: normalizeOptionValue(options.TSTypeLiteral),
          TSInterfaceBody: normalizeOptionValue(options.TSInterfaceBody),
          TSEnumBody: normalizeOptionValue(options.TSEnumBody),
        }
      }

      const value = normalizeOptionValue(options)

      return { ObjectExpression: value, ObjectPattern: value, ImportDeclaration: value, ExportNamedDeclaration: value, TSTypeLiteral: value, TSInterfaceBody: value, TSEnumBody: value }
    }

    const normalizedOptions = normalizeOptions(context.options[0])

    /**
     * Determines if ObjectExpression, ObjectPattern, ImportDeclaration, ExportNamedDeclaration, TSTypeLiteral or TSInterfaceBody
     * node needs to be checked for missing line breaks
     * @param node Node under inspection
     * @param options option specific to node type
     * @param first First object property
     * @param last Last object property
     * @returns `true` if node needs to be checked for missing line breaks
     */
    function areLineBreaksRequired(
      node:
        | Tree.ObjectExpression
        | Tree.ObjectPattern
        | Tree.ImportDeclaration
        | Tree.ExportNamedDeclaration
        | Tree.TSTypeLiteral
        | Tree.TSInterfaceBody
        | Tree.TSEnumBody,
      options: { multiline: boolean, minProperties: number, consistent: boolean },
      first: Token,
      last: Token,
    ) {
      let objectProperties

      if (node.type === 'ObjectExpression' || node.type === 'ObjectPattern') {
        objectProperties = node.properties
      }
      else if (node.type === 'TSTypeLiteral') {
        objectProperties = node.members
      }
      else if (node.type === 'TSInterfaceBody') {
        objectProperties = node.body
      }
      else if (node.type === 'TSEnumBody') {
        objectProperties = node.members
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
          && !isTokenOnSameLine(last, first)
        )
    }

    /**
     * Reports a given node if it violated this rule.
     * @param node A node to check. This is an ObjectExpression, ObjectPattern, ImportDeclaration, ExportNamedDeclaration, TSTypeLiteral or TSInterfaceBody node.
     */
    function check(
      node:
        | Tree.ObjectExpression
        | Tree.ObjectPattern
        | Tree.ImportDeclaration
        | Tree.ExportNamedDeclaration
        | Tree.TSTypeLiteral
        | Tree.TSInterfaceBody
        | Tree.TSEnumBody,
    ) {
      const options = normalizedOptions[node.type]

      if (
        (node.type === 'ImportDeclaration'
          && !node.specifiers.some(specifier => specifier.type === 'ImportSpecifier'))
        || (node.type === 'ExportNamedDeclaration'
          && !node.specifiers.some(specifier => specifier.type === 'ExportSpecifier'))
      ) {
        return
      }

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
      TSTypeLiteral: check,
      TSInterfaceBody: check,
      TSEnumBody: check,
    }
  },
})
