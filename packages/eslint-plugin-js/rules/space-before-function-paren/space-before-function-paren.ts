/**
 * @fileoverview Rule to validate spacing before function paren.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

import type { Tree } from '@shared/types'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { isOpeningParenToken } from '../../utils/ast-utils'
import { createTSRule } from '../../utils'
import type { MessageIds, RuleOptions } from './types'

export default createTSRule<RuleOptions, MessageIds>({
  name: 'space-before-function-paren',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing before `function` definition opening parenthesis',
    },
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['always', 'never'],
          },
          {
            type: 'object',
            properties: {
              anonymous: {
                type: 'string',
                enum: ['always', 'never', 'ignore'],
              },
              named: {
                type: 'string',
                enum: ['always', 'never', 'ignore'],
              },
              asyncArrow: {
                type: 'string',
                enum: ['always', 'never', 'ignore'],
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      unexpected: 'Unexpected space before function parentheses.',
      missing: 'Missing space before function parentheses.',
    },
  },
  defaultOptions: ['always'],

  create(context, [firstOption]) {
    const sourceCode = context.sourceCode
    const baseConfig = typeof firstOption === 'string' ? firstOption : 'always'
    const overrideConfig = typeof firstOption === 'object' ? firstOption : {}

    /**
     * Determines whether a function has a name.
     * @param node The function node.
     * @returns Whether the function has a name.
     */
    function isNamedFunction(
      node:
        | Tree.ArrowFunctionExpression
        | Tree.FunctionDeclaration
        | Tree.FunctionExpression
        | Tree.TSDeclareFunction
        | Tree.TSEmptyBodyFunctionExpression,
    ) {
      if (node.id != null)
        return true

      const parent = node.parent

      return (
        parent.type === AST_NODE_TYPES.MethodDefinition
        || parent.type === AST_NODE_TYPES.TSAbstractMethodDefinition
        || (
          parent.type === AST_NODE_TYPES.Property
          && (parent.kind === 'get' || parent.kind === 'set' || parent.method)
        )
      )
    }

    /**
     * Gets the config for a given function
     * @param node The function node
     * @returns "always", "never", or "ignore"
     */
    function getConfigForFunction(node:
      | Tree.ArrowFunctionExpression
      | Tree.FunctionDeclaration
      | Tree.FunctionExpression
      | Tree.TSDeclareFunction
      | Tree.TSEmptyBodyFunctionExpression,
    ) {
      if (node.type === AST_NODE_TYPES.ArrowFunctionExpression) {
        // Always ignore non-async functions and arrow functions without parens, e.g. async foo => bar
        if (
          node.async
          && isOpeningParenToken(sourceCode.getFirstToken(node, { skip: 1 })!)
        ) {
          return overrideConfig.asyncArrow ?? baseConfig
        }
      }
      else if (isNamedFunction(node)) {
        return overrideConfig.named ?? baseConfig

        // `generator-star-spacing` should warn anonymous generators. E.g. `function* () {}`
      }
      else if (!node.generator) {
        return overrideConfig.anonymous ?? baseConfig
      }

      return 'ignore'
    }

    /**
     * Checks the parens of a function node
     * @param node A function node
     */
    function checkFunction(node:
      | Tree.ArrowFunctionExpression
      | Tree.FunctionDeclaration
      | Tree.FunctionExpression
      | Tree.TSDeclareFunction
      | Tree.TSEmptyBodyFunctionExpression,
    ) {
      const functionConfig = getConfigForFunction(node)

      if (functionConfig === 'ignore')
        return

      let leftToken: Tree.Token
      let rightToken: Tree.Token
      if (node.typeParameters) {
        leftToken = sourceCode.getLastToken(node.typeParameters)!
        rightToken = sourceCode.getTokenAfter(leftToken)!
      }
      else {
        rightToken = sourceCode.getFirstToken(node, isOpeningParenToken)!
        leftToken = sourceCode.getTokenBefore(rightToken)!
      }

      const hasSpacing = sourceCode.isSpaceBetween(leftToken, rightToken)

      if (hasSpacing && functionConfig === 'never') {
        context.report({
          node,
          loc: {
            start: leftToken.loc.end,
            end: rightToken.loc.start,
          },
          messageId: 'unexpected',
          fix(fixer) {
            const comments = sourceCode.getCommentsBefore(rightToken)

            // Don't fix anything if there's a single line comment between the left and the right token
            if (comments.some(comment => comment.type === 'Line'))
              return null

            return fixer.replaceTextRange(
              [leftToken.range[1], rightToken.range[0]],
              comments.reduce((text, comment) => text + sourceCode.getText(comment), ''),
            )
          },
        })
      }
      else if (!hasSpacing && functionConfig === 'always') {
        context.report({
          node,
          loc: rightToken.loc,
          messageId: 'missing',
          fix: fixer => fixer.insertTextAfter(leftToken, ' '),
        })
      }
    }

    return {
      ArrowFunctionExpression: checkFunction,
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      TSEmptyBodyFunctionExpression: checkFunction,
      TSDeclareFunction: checkFunction,
    }
  },
})
