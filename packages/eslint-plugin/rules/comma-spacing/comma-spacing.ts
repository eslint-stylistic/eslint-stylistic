import type { Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  AST_TOKEN_TYPES,
  isClosingBraceToken,
  isClosingBracketToken,
  isClosingParenToken,
  isCommaToken,
  isTokenOnSameLine,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'comma-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing before and after commas',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          before: {
            type: 'boolean',
            default: false,
          },
          after: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ before: false, after: true }],
    messages: {
      unexpected: `There should be no space {{loc}} ','.`,
      missing: `A space is required {{loc}} ','.`,
    },
  },
  create(context, [option]) {
    const { before: spaceBefore, after: spaceAfter } = option!

    const sourceCode = context.sourceCode
    const tokensAndComments = sourceCode.tokensAndComments
    const ignoredTokens = new Set<Tree.PunctuatorToken>()

    /**
     * Adds null elements of the ArrayExpression or ArrayPattern node to the ignore list
     * @param node node to evaluate
     */
    function addNullElementsToIgnoreList(
      node: Tree.ArrayExpression | Tree.ArrayPattern,
    ): void {
      let previousToken = sourceCode.getFirstToken(node)
      for (const element of node.elements) {
        let token: Token | null
        if (element == null) {
          token = sourceCode.getTokenAfter(previousToken!)
          if (token && isCommaToken(token))
            ignoredTokens.add(token)
        }
        else {
          token = sourceCode.getTokenAfter(element)
        }

        previousToken = token
      }
    }

    /**
     * Adds type parameters trailing comma token to the ignore list
     * @param node node to evaluate
     */
    function addTypeParametersTrailingCommaToIgnoreList(
      node: Tree.TSTypeParameterDeclaration,
    ): void {
      const paramLength = node.params.length
      if (paramLength) {
        const param = node.params[paramLength - 1]
        const afterToken = sourceCode.getTokenAfter(param)
        if (afterToken && isCommaToken(afterToken))
          ignoredTokens.add(afterToken)
      }
    }

    /**
     * Validates the spacing around a comma token.
     * @param commaToken The token representing the comma
     * @param prevToken The last token before the comma
     * @param nextToken The first token after the comma
     */
    function validateCommaSpacing(
      commaToken: Tree.PunctuatorToken,
      prevToken: Token | null,
      nextToken: Token | null,
    ): void {
      if (
        prevToken
        && isTokenOnSameLine(prevToken, commaToken)
        && spaceBefore !== sourceCode.isSpaceBetween(prevToken, commaToken)
      ) {
        context.report({
          node: commaToken,
          data: {
            loc: 'before',
          },
          messageId: spaceBefore ? 'missing' : 'unexpected',
          fix: fixer =>
            spaceBefore
              ? fixer.insertTextBefore(commaToken, ' ')
              : fixer.replaceTextRange(
                  [prevToken.range[1], commaToken.range[0]],
                  '',
                ),
        })
      }

      if (
        nextToken
        && isTokenOnSameLine(commaToken, nextToken)
        && !isClosingParenToken(nextToken) // controlled by space-in-parens
        && !isClosingBracketToken(nextToken) // controlled by array-bracket-spacing
        && !isClosingBraceToken(nextToken) // controlled by object-curly-spacing
        && !(!spaceAfter && nextToken.type === AST_TOKEN_TYPES.Line)
        && spaceAfter !== sourceCode.isSpaceBetween(commaToken, nextToken)
      ) {
        context.report({
          node: commaToken,
          data: {
            loc: 'after',
          },
          messageId: spaceAfter ? 'missing' : 'unexpected',
          fix: fixer =>
            spaceAfter
              ? fixer.insertTextAfter(commaToken, ' ')
              : fixer.replaceTextRange(
                  [commaToken.range[1], nextToken.range[0]],
                  '',
                ),
        })
      }
    }

    return {
      'ArrayExpression': addNullElementsToIgnoreList,
      'ArrayPattern': addNullElementsToIgnoreList,
      'TSTypeParameterDeclaration': addTypeParametersTrailingCommaToIgnoreList,

      'Program:exit': function (): void {
        tokensAndComments.forEach((token, i) => {
          if (!isCommaToken(token))
            return

          const prevToken = tokensAndComments[i - 1]
          const nextToken = tokensAndComments[i + 1]

          validateCommaSpacing(
            token,
            isCommaToken(prevToken) || ignoredTokens.has(token)
              ? null
              : prevToken,
            (nextToken && isCommaToken(nextToken)) || ignoredTokens.has(token)
              ? null
              : nextToken,
          )
        })
      },
    }
  },
})
