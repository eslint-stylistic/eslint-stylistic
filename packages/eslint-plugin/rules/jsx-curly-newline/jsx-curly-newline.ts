import type { ASTNode, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isSingleLine, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { safeReplaceTextBetween } from '#utils/fix'

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
    messages: {
      expectedBefore: 'Expected newline before \'}\'.',
      expectedAfter: 'Expected newline after \'{\'.',
      unexpectedBefore: 'Unexpected newline before \'}\'.',
      unexpectedAfter: 'Unexpected newline after \'{\'.',
    },
  },
  defaultOptions: ['consistent'],
  create(context, [options]) {
    const sourceCode = context.sourceCode
    const {
      multiline = 'consistent',
      singleline = 'consistent',
    } = options === 'never'
      ? { multiline: 'forbid', singleline: 'forbid' }
      : typeof options === 'string'
        ? { multiline: options, singleline: options }
        : options!

    /**
     * Determines whether there should be newlines inside curlys
     * @param expression The expression contained in the curlys
     * @param hasLeftNewline `true` if the left curly has a newline in the current code.
     * @returns `true` if there should be newlines inside the function curlys
     */
    function shouldHaveNewlines(expression: ASTNode, hasLeftNewline: boolean) {
      switch (!isSingleLine(expression) ? multiline : singleline) {
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
      const tokenAfterLeftCurly = sourceCode.getTokenAfter(leftCurly)!
      const tokenBeforeRightCurly = sourceCode.getTokenBefore(rightCurly)!
      const hasLeftNewline = !isTokenOnSameLine(leftCurly, tokenAfterLeftCurly)
      const hasRightNewline = !isTokenOnSameLine(tokenBeforeRightCurly, rightCurly)
      const needsNewlines = shouldHaveNewlines(expression, hasLeftNewline)

      if (hasLeftNewline && !needsNewlines) {
        context.report({
          node: leftCurly,
          messageId: 'unexpectedAfter',
          fix: safeReplaceTextBetween(sourceCode, leftCurly, tokenAfterLeftCurly, ''),
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
          fix: safeReplaceTextBetween(sourceCode, tokenBeforeRightCurly, rightCurly, ''),
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
