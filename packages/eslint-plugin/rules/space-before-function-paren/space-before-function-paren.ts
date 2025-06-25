import type { Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { AST_NODE_TYPES, isOpeningParenToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

type FuncOption = 'always' | 'never' | 'ignore'

export default createRule<RuleOptions, MessageIds>({
  name: 'space-before-function-paren',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing before function parenthesis',
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
              catch: {
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
      unexpectedSpace: 'Unexpected space before function parentheses.',
      missingSpace: 'Missing space before function parentheses.',
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
    ): boolean {
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
    function getConfigForFunction(
      node:
        | Tree.ArrowFunctionExpression
        | Tree.FunctionDeclaration
        | Tree.FunctionExpression
        | Tree.TSDeclareFunction
        | Tree.TSEmptyBodyFunctionExpression,
    ): FuncOption {
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
      }
      // `generator-star-spacing` should warn anonymous generators. E.g. `function* () {}`
      else if (!node.generator) {
        return overrideConfig.anonymous ?? baseConfig
      }

      return 'ignore'
    }

    /**
     * Checks the parens of a function node
     * @param node A function node
     */
    function checkFunction(
      node:
        | Tree.ArrowFunctionExpression
        | Tree.FunctionDeclaration
        | Tree.FunctionExpression
        | Tree.TSDeclareFunction
        | Tree.TSEmptyBodyFunctionExpression,
    ): void {
      const functionConfig = getConfigForFunction(node)

      if (functionConfig === 'ignore')
        return

      if (functionConfig === 'always' && node.typeParameters && !node.id)
        return

      let leftToken: Token
      let rightToken: Token
      if (node.typeParameters) {
        leftToken = sourceCode.getLastToken(node.typeParameters)!
        rightToken = sourceCode.getTokenAfter(leftToken)!
      }
      else {
        rightToken = sourceCode.getFirstToken(node, isOpeningParenToken)!
        leftToken = sourceCode.getTokenBefore(rightToken)!
      }

      checkSpace(node, leftToken, rightToken, functionConfig)
    }

    function checkSpace(
      node:
        | Tree.ArrowFunctionExpression
        | Tree.FunctionDeclaration
        | Tree.FunctionExpression
        | Tree.CatchClause
        | Tree.TSDeclareFunction
        | Tree.TSEmptyBodyFunctionExpression,
      leftToken: Token,
      rightToken: Token,
      option: FuncOption,
    ) {
      const hasSpacing = sourceCode.isSpaceBetween(leftToken, rightToken)

      if (hasSpacing && option === 'never') {
        context.report({
          node,
          loc: {
            start: leftToken.loc.end,
            end: rightToken.loc.start,
          },
          messageId: 'unexpectedSpace',
          fix: (fixer) => {
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
      else if (!hasSpacing && option === 'always') {
        context.report({
          node,
          loc: rightToken.loc,
          messageId: 'missingSpace',
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
      CatchClause(node) {
        if (!node.param)
          return

        const option = overrideConfig.catch ?? baseConfig

        if (option === 'ignore')
          return

        const rightToken = sourceCode.getFirstToken(node, isOpeningParenToken)!
        const leftToken = sourceCode.getTokenBefore(rightToken)!

        checkSpace(node, leftToken, rightToken, option)
      },
    }
  },
})
