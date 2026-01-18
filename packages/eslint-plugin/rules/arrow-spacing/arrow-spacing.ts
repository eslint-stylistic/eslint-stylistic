import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isArrowToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

type SupportedNode = Tree.ArrowFunctionExpression | Tree.TSFunctionType | Tree.TSConstructorType

export default createRule<RuleOptions, MessageIds>({
  name: 'arrow-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing before and after the arrow in arrow functions',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          before: {
            type: 'boolean',
            default: true,
          },
          after: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ before: true, after: true }],
    messages: {
      expectedBefore: 'Missing space before =>.',
      unexpectedBefore: 'Unexpected space before =>.',

      expectedAfter: 'Missing space after =>.',
      unexpectedAfter: 'Unexpected space after =>.',
    },
  },
  create(context, [option]) {
    const sourceCode = context.sourceCode

    function getArrow(node: SupportedNode) {
      if (node.type === 'ArrowFunctionExpression') {
        return sourceCode.getTokenBefore(node.body, isArrowToken)!
      }
      else {
        return sourceCode.getFirstToken(node.returnType!, isArrowToken)!
      }
    }

    /**
     * Determines whether space(s) before after arrow(`=>`) is satisfy rule.
     * if before/after value is `true`, there should be space(s).
     * if before/after value is `false`, there should be no space.
     * @param node The arrow function node.
     */
    function spaces(node: SupportedNode) {
      const arrowToken = getArrow(node)!

      const beforeToken = sourceCode.getTokenBefore(arrowToken, { includeComments: true })!
      const isSpacedBefore = sourceCode.isSpaceBetween(beforeToken, arrowToken)

      if (option!.before) {
        // should be space(s) before arrow
        if (!isSpacedBefore) {
          context.report({
            node: beforeToken,
            messageId: 'expectedBefore',
            fix(fixer) {
              return fixer.insertTextBefore(arrowToken, ' ')
            },
          })
        }
      }
      else {
        // should be no space before arrow
        if (isSpacedBefore) {
          context.report({
            node: beforeToken,
            messageId: 'unexpectedBefore',
            fix(fixer) {
              return fixer.removeRange([beforeToken.range[1], arrowToken.range[0]])
            },
          })
        }
      }

      const afterToken = sourceCode.getTokenAfter(arrowToken, { includeComments: true })!
      const isSpacedAfter = sourceCode.isSpaceBetween(arrowToken, afterToken)

      if (option!.after) {
        // should be space(s) after arrow
        if (!isSpacedAfter) {
          context.report({
            node: afterToken,
            messageId: 'expectedAfter',
            fix(fixer) {
              return fixer.insertTextAfter(arrowToken, ' ')
            },
          })
        }
      }
      else {
        // should be no space after arrow
        if (isSpacedAfter) {
          context.report({
            node: afterToken,
            messageId: 'unexpectedAfter',
            fix(fixer) {
              return fixer.removeRange([arrowToken.range[1], afterToken.range[0]])
            },
          })
        }
      }
    }

    return {
      ArrowFunctionExpression: spaces,
      TSFunctionType: spaces,
      TSConstructorType: spaces,
    }
  },
})
