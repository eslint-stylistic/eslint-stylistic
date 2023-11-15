/**
 * @fileoverview enforce the location of arrow function bodies
 * @author Sharmila Jesupaul
 */

import type { TSESTree } from '@typescript-eslint/utils'
import { isCommentToken, isNotOpeningParenToken } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export default createRule({
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce the location of arrow function bodies',
      url: 'https://eslint.style/rules/js/implicit-arrow-linebreak',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'string',
        enum: ['beside', 'below'],
      },
    ],
    messages: {
      expected: 'Expected a linebreak before this expression.',
      unexpected: 'Expected no linebreak before this expression.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const option = context.options[0] || 'beside'

    /**
     * Validates the location of an arrow function body
     * @param {ASTNode} node The arrow function body
     * @returns {void}
     */
    function validateExpression(node: TSESTree.ArrowFunctionExpression) {
      if (node.body.type === 'BlockStatement')
        return

      const arrowToken = sourceCode.getTokenBefore(node.body, isNotOpeningParenToken)!
      const firstTokenOfBody = sourceCode.getTokenAfter(arrowToken)!

      if (arrowToken.loc.end.line === firstTokenOfBody.loc.start.line && option === 'below') {
        context.report({
          node: firstTokenOfBody,
          messageId: 'expected',
          fix: fixer => fixer.insertTextBefore(firstTokenOfBody, '\n'),
        })
      }
      else if (arrowToken.loc.end.line !== firstTokenOfBody.loc.start.line && option === 'beside') {
        context.report({
          node: firstTokenOfBody,
          messageId: 'unexpected',
          fix(fixer) {
            if (sourceCode.getFirstTokenBetween(arrowToken, firstTokenOfBody, { includeComments: true, filter: isCommentToken }))
              return null

            return fixer.replaceTextRange([arrowToken.range[1], firstTokenOfBody.range[0]], ' ')
          },
        })
      }
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------
    return {
      ArrowFunctionExpression: node => validateExpression(node),
    }
  },
})
