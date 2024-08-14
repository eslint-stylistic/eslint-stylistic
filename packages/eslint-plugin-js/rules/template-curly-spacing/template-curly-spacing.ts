/**
 * @fileoverview Rule to enforce spacing around embedded expressions of template strings
 * @author Toru Nagashima
 */

import type { Token } from '@shared/types'
import { isTokenOnSameLine } from '../../../utils/ast'
import { createRule } from '../../../utils'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  name: 'template-curly-spacing',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Require or disallow spacing around embedded expressions of template strings',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
    ],
    messages: {
      expectedBefore: 'Expected space(s) before \'}\'.',
      expectedAfter: 'Expected space(s) after \'${\'.',
      unexpectedBefore: 'Unexpected space(s) before \'}\'.',
      unexpectedAfter: 'Unexpected space(s) after \'${\'.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const always = context.options[0] === 'always'

    /**
     * Checks spacing before `}` of a given token.
     * @param token A token to check. This is a Template token.
     */
    function checkSpacingBefore(token: Token) {
      if (!token.value.startsWith('}'))
        return // starts with a backtick, this is the first template element in the template literal

      const prevToken = sourceCode.getTokenBefore(token, { includeComments: true })!
      const hasSpace = sourceCode.isSpaceBetween!(prevToken, token)

      if (!isTokenOnSameLine(prevToken, token))
        return

      if (always && !hasSpace) {
        context.report({
          loc: {
            start: token.loc.start,
            end: {
              line: token.loc.start.line,
              column: token.loc.start.column + 1,
            },
          },
          messageId: 'expectedBefore',
          fix: fixer => fixer.insertTextBefore(token, ' '),
        })
      }

      if (!always && hasSpace) {
        context.report({
          loc: {
            start: prevToken.loc.end,
            end: token.loc.start,
          },
          messageId: 'unexpectedBefore',
          fix: fixer => fixer.removeRange([prevToken.range[1], token.range[0]]),
        })
      }
    }

    /**
     * Checks spacing after `${` of a given token.
     * @param token A token to check. This is a Template token.
     */
    function checkSpacingAfter(token: Token) {
      if (!token.value.endsWith('${'))
        return // ends with a backtick, this is the last template element in the template literal

      const nextToken = sourceCode.getTokenAfter(token, { includeComments: true })!
      const hasSpace = sourceCode.isSpaceBetween!(token, nextToken)

      if (!isTokenOnSameLine(token, nextToken))
        return

      if (always && !hasSpace) {
        context.report({
          loc: {
            start: {
              line: token.loc.end.line,
              column: token.loc.end.column - 2,
            },
            end: token.loc.end,
          },
          messageId: 'expectedAfter',
          fix: fixer => fixer.insertTextAfter(token, ' '),
        })
      }

      if (!always && hasSpace) {
        context.report({
          loc: {
            start: token.loc.end,
            end: nextToken.loc.start,
          },
          messageId: 'unexpectedAfter',
          fix: fixer => fixer.removeRange([token.range[1], nextToken.range[0]]),
        })
      }
    }

    return {
      TemplateElement(node) {
        const token = sourceCode.getFirstToken(node)!

        checkSpacingBefore(token)
        checkSpacingAfter(token)
      },
    }
  },
})
