/**
 * @fileoverview Comma spacing - validates spacing before and after comma
 * @author Vignesh Anand aka vegetableman.
 */

import type { Token, Tree } from '@shared/types'
import { AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { isClosingBraceToken, isClosingBracketToken, isClosingParenToken, isCommaToken, isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'
import { createTSRule } from '../../utils'
import type { MessageIds, RuleOptions } from './types'

export default createTSRule<RuleOptions, MessageIds>({
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
    messages: {
      missing: `A space is required {{loc}} ','.`,
      unexpected: `There should be no space {{loc}} ','.`,
    },
  },
  defaultOptions: [
    {
      before: false,
      after: true,
    },
  ],
  create(context, [options = {}]) {
    const { before: spaceBefore, after: spaceAfter } = options
    const sourceCode = context.sourceCode
    const tokensAndComments = sourceCode.tokensAndComments
    const ignoredTokens = new Set<Tree.PunctuatorToken>()

    /**
     * Adds null elements of the given ArrayExpression or ArrayPattern node to the ignore list.
     * @param node An ArrayExpression or ArrayPattern node.
     */
    function addNullElementsToIgnoreList(node: Tree.ArrayExpression | Tree.ArrayPattern) {
      let previousToken = sourceCode.getFirstToken(node)
      node.elements.forEach((element) => {
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
      })
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
      prevToken: Tree.Token | null,
      nextToken: Tree.Token | null,
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
        && !isClosingParenToken(nextToken) // controlled by space-in-parens
        && !isClosingBracketToken(nextToken) // controlled by array-bracket-spacing
        && !isClosingBraceToken(nextToken) // controlled by object-curly-spacing
        && !(!spaceAfter && nextToken.type === AST_TOKEN_TYPES.Line) // special case, allow space before line comment
        && isTokenOnSameLine(commaToken, nextToken)
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
      'Program:exit': function () {
        tokensAndComments.forEach((token, i) => {
          if (!isCommaToken(token) || ignoredTokens.has(token))
            return

          const prevToken = tokensAndComments[i - 1]
          const nextToken = tokensAndComments[i + 1]

          validateCommaSpacing(
            token,
            isCommaToken(prevToken)
              ? null
              : prevToken,
            nextToken && isCommaToken(nextToken)
              ? null
              : nextToken,
          )
        })
      },
      'ArrayExpression': addNullElementsToIgnoreList,
      'ArrayPattern': addNullElementsToIgnoreList,
      'TSTypeParameterDeclaration': addTypeParametersTrailingCommaToIgnoreList,
    }
  },
})
