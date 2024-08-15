/**
 * @fileoverview Rule to check the spacing around the * in yield* expressions.
 * @author Bryan Smith
 */

import type { MessageIds, RuleOptions } from './types'
import type { ASTNode, Token } from '#types'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'yield-star-spacing',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Require or disallow spacing around the `*` in `yield*` expressions',
    },

    fixable: 'whitespace',

    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['before', 'after', 'both', 'neither'],
          },
          {
            type: 'object',
            properties: {
              before: { type: 'boolean' },
              after: { type: 'boolean' },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      missingBefore: 'Missing space before *.',
      missingAfter: 'Missing space after *.',
      unexpectedBefore: 'Unexpected space before *.',
      unexpectedAfter: 'Unexpected space after *.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    const mode = (function (option = 'after') {
      if (typeof option === 'string') {
        return {
          before: { before: true, after: false },
          after: { before: false, after: true },
          both: { before: true, after: true },
          neither: { before: false, after: false },
        }[option]
      }
      return option
    }(context.options[0])) as { before: boolean, after: boolean }

    /**
     * Checks the spacing between two tokens before or after the star token.
     * @param side Either "before" or "after".
     * @param leftToken `function` keyword token if side is "before", or
     *     star token if side is "after".
     * @param rightToken Star token if side is "before", or identifier
     *     token if side is "after".
     */
    function checkSpacing(side: 'before' | 'after', leftToken: Token, rightToken: Token) {
      if (sourceCode.isSpaceBetweenTokens(leftToken, rightToken) !== mode[side]) {
        const after = leftToken.value === '*'
        const spaceRequired = mode[side]
        const node = after ? leftToken : rightToken

        const messageId = spaceRequired
          ? (side === 'before' ? 'missingBefore' : 'missingAfter')
          : (side === 'before' ? 'unexpectedBefore' : 'unexpectedAfter')

        context.report({
          node,
          messageId,
          fix(fixer) {
            if (spaceRequired) {
              if (after)
                return fixer.insertTextAfter(node, ' ')

              return fixer.insertTextBefore(node, ' ')
            }
            return fixer.removeRange([leftToken.range[1], rightToken.range[0]])
          },
        })
      }
    }

    /**
     * Enforces the spacing around the star if node is a yield* expression.
     * @param node A yield expression node.
     */
    function checkExpression(node: ASTNode) {
      if (!('delegate' in node && node.delegate))
        return

      const tokens = sourceCode.getFirstTokens(node, 3)
      const yieldToken = tokens[0]
      const starToken = tokens[1]
      const nextToken = tokens[2]

      checkSpacing('before', yieldToken, starToken)
      checkSpacing('after', starToken, nextToken)
    }

    return {
      YieldExpression: checkExpression,
    }
  },
})
