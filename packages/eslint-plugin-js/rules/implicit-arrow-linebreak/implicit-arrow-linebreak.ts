/**
 * @fileoverview enforce the location of arrow function bodies
 * @author Sharmila Jesupaul
 */

import type { Tree } from '@shared/types'
import { isCommentToken, isNotOpeningParenToken } from '../../utils/ast-utils'
import { createRule } from '../../../utils'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  name: 'implicit-arrow-linebreak',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce the location of arrow function bodies',
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
     * @param node The arrow function body
     */
    function validateExpression(node: Tree.ArrowFunctionExpression) {
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
    return {
      ArrowFunctionExpression: node => validateExpression(node),
    }
  },
})
