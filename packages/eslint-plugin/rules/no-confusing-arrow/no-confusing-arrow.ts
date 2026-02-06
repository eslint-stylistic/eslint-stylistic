/**
 * @fileoverview A rule to warn against using arrow functions when they could be
 * confused with comparisons
 * @author Jxck <https://github.com/Jxck>
 */

import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isParenthesised } from '#utils/ast'
import { createRule } from '#utils/create-rule'

/**
 * Checks whether or not a node is a conditional expression.
 * @param node node to test
 * @returns `true` if the node is a conditional expression.
 */
function isConditional(node: ASTNode) {
  return node.type === 'ConditionalExpression'
}

export default createRule<RuleOptions, MessageIds>({
  name: 'no-confusing-arrow',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow arrow functions where they could be confused with comparisons',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        allowParens: {
          type: 'boolean',
        },
        onlyOneSimpleParam: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    }],
    defaultOptions: [{
      allowParens: true,
      onlyOneSimpleParam: false,
    }],
    messages: {
      confusing: 'Arrow function used ambiguously with a conditional expression.',
    },
  },
  create(context, [options]) {
    const {
      allowParens,
      onlyOneSimpleParam,
    } = options!

    const sourceCode = context.sourceCode

    /**
     * Reports if an arrow function contains an ambiguous conditional.
     * @param node A node to check and report.
     */
    function checkArrowFunc(node: Tree.ArrowFunctionExpression) {
      const body = node.body

      if (isConditional(body)
        && !(allowParens && isParenthesised(sourceCode, body))
        && !(onlyOneSimpleParam && !(node.params.length === 1 && node.params[0].type === 'Identifier'))) {
        context.report({
          node,
          messageId: 'confusing',
          fix(fixer) {
            // if `allowParens` is not set to true don't bother wrapping in parens
            return allowParens ? fixer.replaceText(node.body, `(${sourceCode.getText(node.body)})`) : null
          },
        })
      }
    }

    return {
      ArrowFunctionExpression: checkArrowFunc,
    }
  },
})
