/**
 * @fileoverview Rule to disallow whitespace before properties
 * @author Kai Cataldo
 */

import { isDecimalInteger, isOpeningBracketToken, isTokenOnSameLine } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'
import type { Token, Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow whitespace before properties',
      url: 'https://eslint.style/rules/js/no-whitespace-before-property',
    },

    fixable: 'whitespace',
    schema: [],

    messages: {
      unexpectedWhitespace: 'Unexpected whitespace before property {{propName}}.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    // --------------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------------

    /**
     * Reports whitespace before property token
     * @param {ASTNode} node the node to report in the event of an error
     * @param {Token} leftToken the left token
     * @param {Token} rightToken the right token
     * @returns {void}
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
            /*
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

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

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
