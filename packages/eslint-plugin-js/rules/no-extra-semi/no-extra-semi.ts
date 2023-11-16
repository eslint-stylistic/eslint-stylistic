/**
 * @fileoverview Rule to flag use of unnecessary semicolons
 * @author Nicholas C. Zakas
 */

import { isClosingBraceToken, isSemicolonToken, isTopLevelExpressionStatement } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'
import FixTracker from '../../utils/fix-tracker'
import type { ASTNode, Token } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow unnecessary semicolons',
      url: 'https://eslint.style/rules/js/no-extra-semi',
    },

    fixable: 'code',
    schema: [],

    messages: {
      unexpected: 'Unnecessary semicolon.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    /**
     * Checks if a node or token is fixable.
     * A node is fixable if it can be removed without turning a subsequent statement into a directive after fixing other nodes.
     * @param {Token} nodeOrToken The node or token to check.
     * @returns {boolean} Whether or not the node is fixable.
     */
    function isFixable(nodeOrToken: Token) {
      const nextToken = sourceCode.getTokenAfter(nodeOrToken)

      if (!nextToken || nextToken.type !== 'String')
        return true

      const stringNode = sourceCode.getNodeByRangeIndex(nextToken.range[0])

      return !isTopLevelExpressionStatement(stringNode!.parent!)
    }

    /**
     * Reports an unnecessary semicolon error.
     * @param {ASTNode|Token} nodeOrToken A node or a token to be reported.
     * @returns {void}
     */
    function report(nodeOrToken: Token | ASTNode) {
      context.report({
        node: nodeOrToken,
        messageId: 'unexpected',
        fix: isFixable(nodeOrToken as Token)
          /**
           * Expand the replacement range to include the surrounding
           * tokens to avoid conflicting with semi.
           * https://github.com/eslint/eslint/issues/7928
           */
          ? (fixer: any) => new FixTracker(fixer, context.sourceCode as any)
              .retainSurroundingTokens(nodeOrToken as any)
              .remove(nodeOrToken as ASTNode)
          : null,
      })
    }

    /**
     * Checks for a part of a class body.
     * This checks tokens from a specified token to a next MethodDefinition or the end of class body.
     * @param {Token} firstToken The first token to check.
     * @returns {void}
     */
    function checkForPartOfClassBody(firstToken: Token) {
      for (let token = firstToken;
        token.type === 'Punctuator' && !isClosingBraceToken(token);
        token = sourceCode.getTokenAfter(token)!
      ) {
        if (isSemicolonToken(token))
          report(token)
      }
    }

    return {
      /**
       * Reports this empty statement, except if the parent node is a loop.
       * @param {ASTNode} node A EmptyStatement node to be reported.
       * @returns {void}
       */
      EmptyStatement(node: ASTNode) {
        const parent = node.parent
        const allowedParentTypes = [
          'ForStatement',
          'ForInStatement',
          'ForOfStatement',
          'WhileStatement',
          'DoWhileStatement',
          'IfStatement',
          'LabeledStatement',
          'WithStatement',
        ]

        if (!allowedParentTypes.includes(parent!.type))
          report(node)
      },

      /**
       * Checks tokens from the head of this class body to the first MethodDefinition or the end of this class body.
       * @param {ASTNode} node A ClassBody node to check.
       * @returns {void}
       */
      ClassBody(node: ASTNode) {
        checkForPartOfClassBody(sourceCode.getFirstToken(node, 1)!) // 0 is `{`.
      },

      /**
       * Checks tokens from this MethodDefinition to the next MethodDefinition or the end of this class body.
       * @param {ASTNode} node A MethodDefinition node of the start point.
       * @returns {void}
       */
      'MethodDefinition, PropertyDefinition, StaticBlock': function (node: ASTNode) {
        checkForPartOfClassBody(sourceCode.getTokenAfter(node)!)
      },
    }
  },
})
