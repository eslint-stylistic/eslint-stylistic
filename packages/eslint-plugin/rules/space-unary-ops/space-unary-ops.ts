/**
 * @fileoverview This rule should require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 */

import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { AST_NODE_TYPES, canTokensBeAdjacent, isKeywordToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'space-unary-ops',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent spacing before or after unary operators',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'object',
        properties: {
          nonwords: {
            type: 'boolean',
            default: false,
          },
          overrides: {
            type: 'object',
            additionalProperties: {
              type: 'boolean',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      unexpectedBefore: 'Unexpected space before unary operator \'{{operator}}\'.',
      unexpectedAfter: 'Unexpected space after unary operator \'{{operator}}\'.',
      operator: 'Unary operator \'{{operator}}\' must be followed by whitespace.',
      beforeUnaryExpressions: 'Space is required before unary expressions \'{{token}}\'.',
    },
  },

  create(context) {
    const options = context.options[0] || { nonwords: false }

    const sourceCode = context.sourceCode

    /**
     * Check if the node is the first "!" in a "!!" convert to Boolean expression
     * @param node AST node
     * @returns Whether or not the node is first "!" in "!!"
     */
    function isFirstBangInBangBangExpression(node: ASTNode) {
      return node && node.type === 'UnaryExpression' && node.argument && node.argument.type === 'UnaryExpression' && node.argument.operator === '!'
    }

    /**
     * Checks if an override exists for a given operator.
     * @param operator Operator
     * @returns Whether or not an override has been provided for the operator
     */
    function overrideExistsForOperator(operator: string) {
      return options.overrides && Object.prototype.hasOwnProperty.call(options.overrides, operator)
    }

    /**
     * Gets the value that the override was set to for this operator
     * @param operator Operator
     * @returns Whether or not an override enforces a space with this operator
     */
    function overrideEnforcesSpaces(operator: string) {
      return options.overrides?.[operator]
    }

    /**
     * Verifies TSNonNullExpression satisfy spacing requirements
     * @param node TSNonNullExpression AST node
     */
    function checkForSpacesAroundNonNull(node: Tree.TSNonNullExpression) {
      const tokens = sourceCode.getTokens(node)
      const lastToken = tokens[tokens.length - 1] // The ! token
      const secondLastToken = tokens[tokens.length - 2] // The token before !

      if (!lastToken || !secondLastToken || lastToken.value !== '!') {
        return
      }

      const operator = '!'

      if (overrideExistsForOperator(operator)) {
        if (overrideEnforcesSpaces(operator))
          verifyNonWordsHaveSpaces(node, secondLastToken, lastToken)
        else
          verifyNonWordsDontHaveSpaces(node, secondLastToken, lastToken)
      }
      else if (options.nonwords) {
        verifyNonWordsHaveSpaces(node, secondLastToken, lastToken)
      }
      else {
        verifyNonWordsDontHaveSpaces(node, secondLastToken, lastToken)
      }
    }

    /**
     * Verifies UnaryExpression, UpdateExpression have spaces before or after the operator
     * @param node AST node
     * @param firstToken First token in the expression
     * @param secondToken Second token in the expression
     */
    function verifyNonWordsHaveSpaces(
      node:
        | Tree.UnaryExpression
        | Tree.UpdateExpression
        | Tree.TSNonNullExpression,
      firstToken: Token,
      secondToken: Token,
    ) {
      if (('prefix' in node && node.prefix) || node.type === AST_NODE_TYPES.TSNonNullExpression) {
        if (isFirstBangInBangBangExpression(node))
          return

        if (firstToken.range[1] === secondToken.range[0]) {
          context.report({
            node,
            messageId: 'operator',
            data: {
              operator: firstToken.value,
            },
            fix(fixer) {
              return fixer.insertTextAfter(firstToken, ' ')
            },
          })
        }
      }
      else {
        if (firstToken.range[1] === secondToken.range[0]) {
          context.report({
            node,
            messageId: 'beforeUnaryExpressions',
            data: {
              token: secondToken.value,
            },
            fix(fixer) {
              return fixer.insertTextBefore(secondToken, ' ')
            },
          })
        }
      }
    }

    /**
     * Verifies UnaryExpression, UpdateExpression don't have spaces before or after the operator
     * @param node AST node
     * @param firstToken First token in the expression
     * @param secondToken Second token in the expression
     */
    function verifyNonWordsDontHaveSpaces(
      node:
        | Tree.UnaryExpression
        | Tree.UpdateExpression
        | Tree.TSNonNullExpression,
      firstToken: Token,
      secondToken: Token,
    ) {
      if (('prefix' in node && node.prefix) || node.type === AST_NODE_TYPES.TSNonNullExpression) {
        if (secondToken.range[0] > firstToken.range[1]) {
          context.report({
            node,
            messageId: 'unexpectedAfter',
            data: {
              operator: firstToken.value,
            },
            fix(fixer) {
              if (canTokensBeAdjacent(firstToken, secondToken))
                return fixer.removeRange([firstToken.range[1], secondToken.range[0]])

              return null
            },
          })
        }
      }
      else {
        if (secondToken.range[0] > firstToken.range[1]) {
          context.report({
            node,
            messageId: 'unexpectedBefore',
            data: {
              operator: secondToken.value,
            },
            fix(fixer) {
              return fixer.removeRange([firstToken.range[1], secondToken.range[0]])
            },
          })
        }
      }
    }

    /**
     * Verifies UnaryExpression, UpdateExpression satisfy spacing requirements
     * @param node AST node
     */
    function checkForSpaces(
      node:
        | Tree.UnaryExpression
        | Tree.UpdateExpression,
    ) {
      const tokens = node.type === 'UpdateExpression' && !node.prefix
        ? sourceCode.getLastTokens(node, 2)
        : sourceCode.getFirstTokens(node, 2)
      const firstToken = tokens[0]
      const secondToken = tokens[1]

      if (node.prefix && isKeywordToken(firstToken)) {
        return
      }

      const operator = ('prefix' in node && node.prefix) ? tokens[0].value : tokens[1].value

      if (overrideExistsForOperator(operator)) {
        if (overrideEnforcesSpaces(operator))
          verifyNonWordsHaveSpaces(node, firstToken, secondToken)
        else
          verifyNonWordsDontHaveSpaces(node, firstToken, secondToken)
      }
      else if (options.nonwords) {
        verifyNonWordsHaveSpaces(node, firstToken, secondToken)
      }
      else {
        verifyNonWordsDontHaveSpaces(node, firstToken, secondToken)
      }
    }

    return {
      UnaryExpression: checkForSpaces,
      UpdateExpression: checkForSpaces,
      TSNonNullExpression: checkForSpacesAroundNonNull,
    }
  },
})
