/**
 * @fileoverview Rule to disallow whitespace before properties
 * @author Kai Cataldo
 */

import type { MessageIds, RuleOptions } from './types'
import type { Token, Tree } from '#types'
import { isDecimalInteger, isOpeningBracketToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'no-whitespace-before-property',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow whitespace before properties',
    },

    fixable: 'whitespace',
    schema: [],

    messages: {
      unexpectedWhitespace: 'Unexpected whitespace before property {{propName}}.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    /**
     * Reports whitespace before property token
     * @param node the node to report in the event of an error
     * @param leftToken the left token
     * @param rightToken the right token
     * @private
     */
    function reportError(node: Tree.MemberExpression, leftToken: Token, rightToken: Token) {
      context.report({
        node,
        messageId: 'unexpectedWhitespace',
        data: {
          propName: sourceCode.getText(node.property),
        },
        fix(fixer) {
          let replacementText = ''

          if (!node.computed && !node.optional && isDecimalInteger(node.object)) {
            /**
             * If the object is a number literal, fixing it to something like 5.toString() would cause a SyntaxError.
             * Don't fix this case.
             */
            return null
          }

          // Don't fix if comments exist.
          if (sourceCode.commentsExistBetween(leftToken, rightToken))
            return null

          if (node.optional)
            replacementText = '?.'
          else if (!node.computed)
            replacementText = '.'

          return fixer.replaceTextRange([leftToken.range[1], rightToken.range[0]], replacementText)
        },
      })
    }

    return {
      MemberExpression(node: Tree.MemberExpression) {
        let rightToken: Token
        let leftToken: Token

        if (!isTokenOnSameLine(node.object, node.property))
          return

        if (node.computed) {
          rightToken = sourceCode.getTokenBefore(node.property, isOpeningBracketToken)!
          leftToken = sourceCode.getTokenBefore(rightToken, node.optional ? 1 : 0)!
        }
        else {
          rightToken = sourceCode.getFirstToken(node.property)!
          leftToken = sourceCode.getTokenBefore(rightToken, 1)!
        }

        if (sourceCode.isSpaceBetweenTokens(leftToken, rightToken))
          reportError(node, leftToken, rightToken)
      },
    }
  },
})
