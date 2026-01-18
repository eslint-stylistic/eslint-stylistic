/**
 * @fileoverview Rule to enforce line breaks between arguments of a function call
 * @author Alexey Gonchar <https://github.com/finico>
 */

import type { ReportFixFunction, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

interface Checker {
  messageId: 'unexpectedLineBreak' | 'missingLineBreak'
  check: (prevToken: Token, currentToken: Token) => boolean
  createFix: (token: Token, tokenBefore: Token) => ReportFixFunction
}

export default createRule<RuleOptions, MessageIds>({
  name: 'function-call-argument-newline',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce line breaks between arguments of a function call',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'string',
        enum: ['always', 'never', 'consistent'],
      },
    ],
    defaultOptions: [],
    messages: {
      unexpectedLineBreak: 'There should be no line break here.',
      missingLineBreak: 'There should be a line break after this argument.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    const checkers = {
      unexpected: {
        messageId: 'unexpectedLineBreak',
        check: (prevToken, currentToken) => !isTokenOnSameLine(prevToken, currentToken),
        createFix: (token, tokenBefore) => fixer =>
          fixer.replaceTextRange([tokenBefore.range[1], token.range[0]], ' '),
      },
      missing: {
        messageId: 'missingLineBreak',
        check: (prevToken, currentToken) => isTokenOnSameLine(prevToken, currentToken),
        createFix: (token, tokenBefore) => fixer =>
          fixer.replaceTextRange([tokenBefore.range[1], token.range[0]], '\n'),
      },
    } as const satisfies Record<string, Checker>

    /**
     * Check all arguments for line breaks in the CallExpression
     * @param argumentNodes arguments to evaluate
     * @param checker selected checker
     * @private
     */
    function checkArguments(argumentNodes: Tree.CallExpressionArgument[], checker: Checker) {
      for (let i = 1; i < argumentNodes.length; i++) {
        const argumentNode = argumentNodes[i - 1]
        const prevArgToken = sourceCode.getLastToken(argumentNode)!
        const currentArgToken = sourceCode.getFirstToken(argumentNodes[i])!

        if (checker.check(prevArgToken, currentArgToken)) {
          const tokenBefore = sourceCode.getTokenBefore(
            currentArgToken,
            { includeComments: true },
          )!

          const hasLineCommentBefore = tokenBefore.type === 'Line'

          context.report({
            node: argumentNodes[i - 1],
            loc: {
              start: tokenBefore.loc.end,
              end: currentArgToken.loc.start,
            },
            messageId: checker.messageId,
            fix: hasLineCommentBefore ? null : checker.createFix(currentArgToken, tokenBefore),
          })
        }
      }
    }

    /**
     * Check if open space is present in a function name
     * @param argumentNodes arguments to evaluate
     * @private
     */
    function check(argumentNodes: Tree.CallExpressionArgument[]) {
      if (argumentNodes.length < 2)
        return

      const option = context.options[0] || 'always'

      if (option === 'never') {
        checkArguments(argumentNodes, checkers.unexpected)
      }
      else if (option === 'always') {
        checkArguments(argumentNodes, checkers.missing)
      }
      else if (option === 'consistent') {
        const firstArgToken = sourceCode.getLastToken(argumentNodes[0])!
        const secondArgToken = sourceCode.getFirstToken(argumentNodes[1])!

        if (isTokenOnSameLine(firstArgToken, secondArgToken))
          checkArguments(argumentNodes, checkers.unexpected)
        else
          checkArguments(argumentNodes, checkers.missing)
      }
    }

    return {
      CallExpression: node => check(node.arguments),
      NewExpression: node => check(node.arguments),
      ImportExpression: (node) => {
        if (node.options)
          check([node.source, node.options])
      },
    }
  },
})
