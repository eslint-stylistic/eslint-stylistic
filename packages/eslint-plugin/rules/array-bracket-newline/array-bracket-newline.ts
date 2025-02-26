/**
 * @fileoverview Rule to enforce linebreaks after open and before close array brackets
 * @author Jan Peer Stöcklmair <https://github.com/JPeer264>
 */

import type { ASTNode, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isCommentToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'array-bracket-newline',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce linebreaks after opening and before closing array brackets',
    },

    fixable: 'whitespace',

    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['always', 'never', 'consistent'],
          },
          {
            type: 'object',
            properties: {
              multiline: {
                type: 'boolean',
              },
              minItems: {
                type: ['integer', 'null'],
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],

    messages: {
      unexpectedOpeningLinebreak: 'There should be no linebreak after \'[\'.',
      unexpectedClosingLinebreak: 'There should be no linebreak before \']\'.',
      missingOpeningLinebreak: 'A linebreak is required after \'[\'.',
      missingClosingLinebreak: 'A linebreak is required before \']\'.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    /**
     * Normalizes a given option value.
     * @param option An option value to parse.
     * @returns Normalized option object.
     */
    function normalizeOptionValue(option: RuleOptions[0]) {
      let consistent = false
      let multiline = false
      let minItems = 0

      if (option) {
        if (option === 'consistent') {
          consistent = true
          minItems = Number.POSITIVE_INFINITY
        }
        else if (option === 'always' || (typeof option !== 'string' && option.minItems === 0)) {
          minItems = 0
        }
        else if (option === 'never') {
          minItems = Number.POSITIVE_INFINITY
        }
        else {
          multiline = Boolean(option.multiline)
          minItems = option.minItems || Number.POSITIVE_INFINITY
        }
      }
      else {
        consistent = false
        multiline = true
        minItems = Number.POSITIVE_INFINITY
      }

      return { consistent, multiline, minItems }
    }

    /**
     * Normalizes a given option value.
     * @param options An option value to parse.
     * @returns Normalized option object.
     */
    function normalizeOptions(options: RuleOptions[0]) {
      const value = normalizeOptionValue(options)

      return { ArrayExpression: value, ArrayPattern: value }
    }

    /**
     * Reports that there shouldn't be a linebreak after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoBeginningLinebreak(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: 'unexpectedOpeningLinebreak',
        fix(fixer) {
          const nextToken = sourceCode.getTokenAfter(token, { includeComments: true })

          if (!nextToken || isCommentToken(nextToken))
            return null

          return fixer.removeRange([token.range[1], nextToken.range![0]])
        },
      })
    }

    /**
     * Reports that there shouldn't be a linebreak before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoEndingLinebreak(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: 'unexpectedClosingLinebreak',
        fix(fixer) {
          const previousToken = sourceCode.getTokenBefore(token, { includeComments: true })

          if (!previousToken || isCommentToken(previousToken))
            return null

          return fixer.removeRange([previousToken.range![1], token.range[0]])
        },
      })
    }

    /**
     * Reports that there should be a linebreak after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredBeginningLinebreak(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: 'missingOpeningLinebreak',
        fix(fixer) {
          return fixer.insertTextAfter(token, '\n')
        },
      })
    }

    /**
     * Reports that there should be a linebreak before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredEndingLinebreak(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: 'missingClosingLinebreak',
        fix(fixer) {
          return fixer.insertTextBefore(token, '\n')
        },
      })
    }

    /**
     * Reports a given node if it violated this rule.
     * @param node A node to check. This is an ArrayExpression node or an ArrayPattern node.
     */
    function check(node: ASTNode) {
      // @ts-expect-error type cast
      const elements = node.elements
      const normalizedOptions = normalizeOptions(context.options[0])
      // @ts-expect-error type cast
      const options = normalizedOptions[node.type]
      const openBracket = sourceCode.getFirstToken(node)!
      const closeBracket = sourceCode.getLastToken(node)!
      const firstIncComment = sourceCode.getTokenAfter(openBracket, { includeComments: true })!
      const lastIncComment = sourceCode.getTokenBefore(closeBracket, { includeComments: true })!
      const first = sourceCode.getTokenAfter(openBracket)!
      const last = sourceCode.getTokenBefore(closeBracket)!
      const needsLinebreaks = (
        elements.length >= options.minItems
        || (
          options.multiline
          && elements.length > 0
          && firstIncComment.loc!.start.line !== lastIncComment.loc!.end.line
        )
        || (
          elements.length === 0
          && firstIncComment.type === 'Block'
          && firstIncComment.loc!.start.line !== lastIncComment.loc!.end.line
          && firstIncComment === lastIncComment
        )
        || (
          options.consistent
          && openBracket.loc.end.line !== first.loc.start.line
        )
      )

      /**
       * Use tokens or comments to check multiline or not.
       * But use only tokens to check whether linebreaks are needed.
       * This allows:
       *     var arr = [ // eslint-disable-line foo
       *         'a'
       *     ]
       */

      if (needsLinebreaks) {
        if (isTokenOnSameLine(openBracket, first))
          reportRequiredBeginningLinebreak(node, openBracket)
        if (isTokenOnSameLine(last, closeBracket))
          reportRequiredEndingLinebreak(node, closeBracket)
      }
      else {
        if (!isTokenOnSameLine(openBracket, first))
          reportNoBeginningLinebreak(node, openBracket)
        if (!isTokenOnSameLine(last, closeBracket))
          reportNoEndingLinebreak(node, closeBracket)
      }
    }

    return {
      ArrayPattern: check,
      ArrayExpression: check,
    }
  },
})
