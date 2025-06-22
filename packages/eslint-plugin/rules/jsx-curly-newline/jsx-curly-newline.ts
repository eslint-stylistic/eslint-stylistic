/**
 * @fileoverview enforce consistent line breaks inside jsx curly
 */

import type { ASTNode, RuleContext, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isSingleLine, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

function getNormalizedOption(context: Readonly<RuleContext<MessageIds, RuleOptions>>) {
  const rawOption = context.options[0] || 'consistent'

  if (rawOption === 'consistent') {
    return {
      multiline: 'consistent',
      singleline: 'consistent',
    }
  }

  if (rawOption === 'never') {
    return {
      multiline: 'forbid',
      singleline: 'forbid',
    }
  }

  return {
    multiline: rawOption.multiline || 'consistent',
    singleline: rawOption.singleline || 'consistent',
  }
}

const messages = {
  expectedBefore: 'Expected newline before \'}\'.',
  expectedAfter: 'Expected newline after \'{\'.',
  unexpectedBefore: 'Unexpected newline before \'}\'.',
  unexpectedAfter: 'Unexpected newline after \'{\'.',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-curly-newline',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent linebreaks in curly braces in JSX attributes and expressions',
    },

    fixable: 'whitespace',

    schema: [
      {
        anyOf: [
          {
            type: 'string',
            enum: ['consistent', 'never'],
          },
          {
            type: 'object',
            properties: {
              singleline: {
                type: 'string',
                enum: ['consistent', 'require', 'forbid'],
              },
              multiline: {
                type: 'string',
                enum: ['consistent', 'require', 'forbid'],
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],

    messages,
  },

  create(context) {
    const sourceCode = context.sourceCode
    const option = getNormalizedOption(context)

    /**
     * Determines whether there should be newlines inside curlys
     * @param expression The expression contained in the curlys
     * @param hasLeftNewline `true` if the left curly has a newline in the current code.
     * @returns `true` if there should be newlines inside the function curlys
     */
    function shouldHaveNewlines(expression: ASTNode, hasLeftNewline: boolean) {
      switch (!isSingleLine(expression) ? option.multiline : option.singleline) {
        case 'forbid': return false
        case 'require': return true
        case 'consistent':
        default: return hasLeftNewline
      }
    }

    /**
     * Validates curlys
     * @param curlys An object with keys `leftParen` for the left paren token, and `rightParen` for the right paren token
     * @param expression The expression inside the curly
     */
    function validateCurlys(curlys: { leftCurly: Token, rightCurly: Token }, expression: ASTNode) {
      const leftCurly = curlys.leftCurly
      const rightCurly = curlys.rightCurly
      const tokenAfterLeftCurly = sourceCode.getTokenAfter(leftCurly)
      const tokenBeforeRightCurly = sourceCode.getTokenBefore(rightCurly)
      const hasLeftNewline = !isTokenOnSameLine(leftCurly, tokenAfterLeftCurly!)
      const hasRightNewline = !isTokenOnSameLine(tokenBeforeRightCurly!, rightCurly)
      const needsNewlines = shouldHaveNewlines(expression, hasLeftNewline)

      if (hasLeftNewline && !needsNewlines) {
        context.report({
          node: leftCurly,
          messageId: 'unexpectedAfter',
          fix(fixer) {
            return sourceCode
              .getText()
              .slice(leftCurly.range[1], tokenAfterLeftCurly?.range[0])
              .trim()
              ? null // If there is a comment between the { and the first element, don't do a fix.
              : fixer.removeRange([leftCurly.range[1], tokenAfterLeftCurly!.range[0]!])
          },
        })
      }
      else if (!hasLeftNewline && needsNewlines) {
        context.report({
          node: leftCurly,
          messageId: 'expectedAfter',
          fix: fixer => fixer.insertTextAfter(leftCurly, '\n'),
        })
      }

      if (hasRightNewline && !needsNewlines) {
        context.report({
          node: rightCurly,
          messageId: 'unexpectedBefore',
          fix(fixer) {
            return sourceCode
              .getText()
              .slice(tokenBeforeRightCurly!.range[1], rightCurly.range[0])
              .trim()
              ? null // If there is a comment between the last element and the }, don't do a fix.
              : fixer.removeRange([
                  tokenBeforeRightCurly!.range[1],
                  rightCurly.range[0],
                ])
          },
        })
      }
      else if (!hasRightNewline && needsNewlines) {
        context.report({
          node: rightCurly,
          messageId: 'expectedBefore',
          fix: fixer => fixer.insertTextBefore(rightCurly, '\n'),
        })
      }
    }

    return {
      JSXExpressionContainer(node) {
        const curlyTokens = {
          leftCurly: sourceCode.getFirstToken(node)!,
          rightCurly: sourceCode.getLastToken(node)!,
        }
        validateCurlys(curlyTokens, node.expression)
      },
    }
  },
})
