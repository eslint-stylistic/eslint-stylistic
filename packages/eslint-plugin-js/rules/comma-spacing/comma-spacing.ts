/**
 * @fileoverview Comma spacing - validates spacing before and after comma
 * @author Vignesh Anand aka vegetableman.
 */

import { isClosingBraceToken, isClosingBracketToken, isClosingParenToken, isCommaToken, isTokenOnSameLine } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'
import type { ASTNode, Token, Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent spacing before and after commas',
      url: 'https://eslint.style/rules/js/comma-spacing',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'object',
        properties: {
          before: {
            type: 'boolean',
            default: false,
          },
          after: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      missing: 'A space is required {{loc}} \',\'.',
      unexpected: 'There should be no space {{loc}} \',\'.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const tokensAndComments = sourceCode.tokensAndComments

    const options = {
      before: context.options[0] ? context.options[0].before : false,
      after: context.options[0] ? context.options[0].after : true,
    }

    // list of comma tokens to ignore for the check of leading whitespace
    const commaTokensToIgnore: Token[] = []

    /**
     * Reports a spacing error with an appropriate message.
     * @param {ASTNode} node The binary expression node to report.
     * @param {string} loc Is the error "before" or "after" the comma?
     * @param {ASTNode} otherNode The node at the left or right of `node`
     * @returns {void}
     * @private
     */
    function report(node: ASTNode | Token, loc: 'before' | 'after', otherNode: ASTNode | Token) {
      context.report({
        node,
        fix(fixer) {
          if (options[loc]) {
            if (loc === 'before')
              return fixer.insertTextBefore(node, ' ')

            return fixer.insertTextAfter(node, ' ')
          }
          let start, end
          const newText = ''

          if (loc === 'before') {
            start = otherNode.range[1]
            end = node.range[0]
          }
          else {
            start = node.range[1]
            end = otherNode.range[0]
          }

          return fixer.replaceTextRange([start, end], newText)
        },
        messageId: options[loc] ? 'missing' : 'unexpected',
        data: {
          loc,
        },
      })
    }

    /**
     * Adds null elements of the given ArrayExpression or ArrayPattern node to the ignore list.
     * @param {ASTNode} node An ArrayExpression or ArrayPattern node.
     * @returns {void}
     */
    function addNullElementsToIgnoreList(node: Tree.ArrayExpression | Tree.ArrayPattern) {
      let previousToken = sourceCode.getFirstToken(node)!

      node.elements.forEach((element) => {
        let token: Token

        if (element === null) {
          token = sourceCode.getTokenAfter(previousToken)!

          if (isCommaToken(token))
            commaTokensToIgnore.push(token)
        }
        else {
          token = sourceCode.getTokenAfter(element)!
        }

        previousToken = token
      })
    }

    return {
      'Program:exit': function () {
        tokensAndComments.forEach((token, i) => {
          if (!isCommaToken(token))
            return

          const previousToken = tokensAndComments[i - 1]
          const nextToken = tokensAndComments[i + 1]

          if (
            previousToken
            && !isCommaToken(previousToken) // ignore spacing between two commas

            /**
             * `commaTokensToIgnore` are ending commas of `null` elements (array holes/elisions).
             * In addition to spacing between two commas, this can also ignore:
             *
             *   - Spacing after `[` (controlled by array-bracket-spacing)
             *       Example: [ , ]
             *                 ^
             *   - Spacing after a comment (for backwards compatibility, this was possibly unintentional)
             *       Example: [a, /* * / ,]
             *                          ^
             */
            && !commaTokensToIgnore.includes(token)

            && isTokenOnSameLine(previousToken, token)
            && options.before !== sourceCode.isSpaceBetweenTokens(previousToken, token)
          )
            report(token, 'before', previousToken)

          if (
            nextToken
            && !isCommaToken(nextToken) // ignore spacing between two commas
            && !isClosingParenToken(nextToken) // controlled by space-in-parens
            && !isClosingBracketToken(nextToken) // controlled by array-bracket-spacing
            && !isClosingBraceToken(nextToken) // controlled by object-curly-spacing
            && !(!options.after && nextToken.type === 'Line') // special case, allow space before line comment
            && isTokenOnSameLine(token, nextToken)
            && options.after !== sourceCode.isSpaceBetweenTokens(token, nextToken)
          )
            report(token, 'after', nextToken)
        })
      },
      'ArrayExpression': addNullElementsToIgnoreList,
      'ArrayPattern': addNullElementsToIgnoreList,

    }
  },
})
