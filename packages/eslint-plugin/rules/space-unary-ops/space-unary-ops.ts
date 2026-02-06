/**
 * @fileoverview This rule should require or disallow spaces before or after unary operations.
 * @author Marcin Kumorek
 */

import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { canTokensBeAdjacent, isKeywordToken } from '#utils/ast'
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
          words: {
            type: 'boolean',
          },
          nonwords: {
            type: 'boolean',
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
    defaultOptions: [{ words: true, nonwords: false }],
    messages: {
      unexpectedBefore: 'Unexpected space before unary operator \'{{operator}}\'.',
      unexpectedAfter: 'Unexpected space after unary operator \'{{operator}}\'.',
      unexpectedAfterWord: 'Unexpected space after unary word operator \'{{word}}\'.',
      requireAfterWord: 'Unary word operator \'{{word}}\' must be followed by whitespace.',
      requireAfter: 'Unary operator \'{{operator}}\' must be followed by whitespace.',
      requireBefore: 'Space is required before unary operator \'{{operator}}\'.',
    },
  },
  create(context, [options]) {
    const {
      words,
      nonwords,
      overrides = {},
    } = options!

    const sourceCode = context.sourceCode

    /**
     * Resolves the spacing override for an operator by checking keys in priority order.
     * @param keys Override keys to check in priority order
     * @returns The override boolean, or undefined if no override matches
     */
    function resolveOverride(keys: string[]): boolean | undefined {
      return keys.map(key => overrides[key]).find(override => override !== undefined)
    }

    /**
     * Check if the node is the first "!" in a "!!" convert to Boolean expression
     * @param node AST node
     * @returns Whether or not the node is first "!" in "!!"
     */
    function isFirstBangInBangBangExpression(node: ASTNode) {
      return node && node.type === 'UnaryExpression' && node.argument && node.argument.type === 'UnaryExpression' && node.argument.operator === '!'
    }

    /**
     * Verify Unary Word Operator has spaces after the word operator
     * @param node AST node
     * @param firstToken first token from the AST node
     * @param secondToken second token from the AST node
     * @param word The word to be used for reporting
     */
    function verifyWordHasSpaces(node: ASTNode, firstToken: Token, secondToken: Token, word: string) {
      if (secondToken.range[0] === firstToken.range[1]) {
        context.report({
          node,
          messageId: 'requireAfterWord',
          data: {
            word,
          },
          fix(fixer) {
            return fixer.insertTextAfter(firstToken, ' ')
          },
        })
      }
    }

    /**
     * Verify Unary Word Operator doesn't have spaces after the word operator
     * @param node AST node
     * @param firstToken first token from the AST node
     * @param secondToken second token from the AST node
     * @param word The word to be used for reporting
     */
    function verifyWordDoesntHaveSpaces(node: ASTNode, firstToken: Token, secondToken: Token, word: string) {
      if (canTokensBeAdjacent(firstToken, secondToken)) {
        if (secondToken.range[0] > firstToken.range[1]) {
          context.report({
            node,
            messageId: 'unexpectedAfterWord',
            data: {
              word,
            },
            fix(fixer) {
              return fixer.removeRange([firstToken.range[1], secondToken.range[0]])
            },
          })
        }
      }
    }

    /**
     * Check Unary Word Operators for spaces after the word operator
     * @param node AST node
     * @param firstToken first token from the AST node
     * @param secondToken second token from the AST node
     * @param word The word to be used for reporting
     */
    function checkUnaryWordOperatorForSpaces(node: ASTNode, firstToken: Token, secondToken: Token, word: string) {
      const shouldHaveSpace = resolveOverride([word]) ?? words

      if (shouldHaveSpace) {
        verifyWordHasSpaces(node, firstToken, secondToken, word)
      }
      else {
        verifyWordDoesntHaveSpaces(node, firstToken, secondToken, word)
      }
    }

    /**
     * Verifies TSNonNullExpression satisfy spacing requirements
     * @param node TSNonNullExpression AST node
     */
    function checkForSpacesAroundNonNull(node: Tree.TSNonNullExpression) {
      const operator = '!'
      const operatorToken = sourceCode.getLastToken(node, token => token.value === operator)!
      const prefixToken = sourceCode.getTokenBefore(operatorToken)!

      const shouldHaveSpace = resolveOverride(['ts-non-null', operator]) ?? nonwords

      if (shouldHaveSpace) {
        verifyNonWordsHaveSpaces(node, prefixToken, operatorToken)
      }
      else {
        verifyNonWordsDontHaveSpaces(node, prefixToken, operatorToken)
      }
    }

    /**
     * Verifies YieldExpressions satisfy spacing requirements
     * @param node AST node
     */
    function checkForSpacesAfterYield(node: Tree.YieldExpression) {
      const tokens = sourceCode.getFirstTokens(node, 3)
      const word = 'yield'

      if (!node.argument || node.delegate)
        return

      checkUnaryWordOperatorForSpaces(node, tokens[0], tokens[1], word)
    }

    /**
     * Verifies AwaitExpressions satisfy spacing requirements
     * @param node AwaitExpression AST node
     */
    function checkForSpacesAfterAwait(node: Tree.AwaitExpression) {
      const tokens = sourceCode.getFirstTokens(node, 3)

      checkUnaryWordOperatorForSpaces(node, tokens[0], tokens[1], 'await')
    }

    /**
     * Verifies UnaryExpression, UpdateExpression and NewExpression have spaces before or after the operator
     * @param node AST node
     * @param firstToken First token in the expression
     * @param secondToken Second token in the expression
     */
    function verifyNonWordsHaveSpaces(
      node:
        | Tree.UnaryExpression
        | Tree.UpdateExpression
        | Tree.NewExpression
        | Tree.TSNonNullExpression,
      firstToken: Token,
      secondToken: Token,
    ) {
      if ('prefix' in node && node.prefix) {
        if (isFirstBangInBangBangExpression(node))
          return

        if (firstToken.range[1] === secondToken.range[0]) {
          context.report({
            node,
            messageId: 'requireAfter',
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
            messageId: 'requireBefore',
            data: {
              operator: secondToken.value,
            },
            fix(fixer) {
              return fixer.insertTextBefore(secondToken, ' ')
            },
          })
        }
      }
    }

    /**
     * Verifies UnaryExpression, UpdateExpression and NewExpression don't have spaces before or after the operator
     * @param node AST node
     * @param firstToken First token in the expression
     * @param secondToken Second token in the expression
     */
    function verifyNonWordsDontHaveSpaces(
      node:
        | Tree.UnaryExpression
        | Tree.UpdateExpression
        | Tree.NewExpression
        | Tree.TSNonNullExpression,
      firstToken: Token,
      secondToken: Token,
    ) {
      if ('prefix' in node && node.prefix) {
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
     * Verifies UnaryExpression, UpdateExpression and NewExpression satisfy spacing requirements
     * @param node AST node
     */
    function checkForSpaces(
      node:
        | Tree.UnaryExpression
        | Tree.UpdateExpression
        | Tree.NewExpression,
    ) {
      const tokens = node.type === 'UpdateExpression' && !node.prefix
        ? sourceCode.getLastTokens(node, 2)
        : sourceCode.getFirstTokens(node, 2)
      const firstToken = tokens[0]
      const secondToken = tokens[1]

      if ((node.type === 'NewExpression' || node.prefix) && isKeywordToken(firstToken)) {
        checkUnaryWordOperatorForSpaces(node, firstToken, secondToken, firstToken.value)
        return
      }

      const operator = ('prefix' in node && node.prefix) ? tokens[0].value : tokens[1].value

      const shouldHaveSpace = resolveOverride([operator]) ?? nonwords

      if (shouldHaveSpace) {
        verifyNonWordsHaveSpaces(node, firstToken, secondToken)
      }
      else {
        verifyNonWordsDontHaveSpaces(node, firstToken, secondToken)
      }
    }

    return {
      UnaryExpression: checkForSpaces,
      UpdateExpression: checkForSpaces,
      NewExpression: checkForSpaces,
      YieldExpression: checkForSpacesAfterYield,
      AwaitExpression: checkForSpacesAfterAwait,
      TSNonNullExpression: checkForSpacesAroundNonNull,
    }
  },
})
