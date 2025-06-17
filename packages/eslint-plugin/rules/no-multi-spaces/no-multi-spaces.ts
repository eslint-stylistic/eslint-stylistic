/**
 * @fileoverview Disallow use of multiple spaces.
 * @author Nicholas C. Zakas
 */

import type { Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isCommentToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'no-multi-spaces',
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow multiple spaces',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'object',
            patternProperties: {
              '^([A-Z][a-z]*)+$': {
                type: 'boolean',
              },
            },
            additionalProperties: false,
          },
          ignoreEOLComments: {
            type: 'boolean',
            default: false,
          },
          includeTabs: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      multipleSpaces: 'Multiple spaces found before \'{{displayValue}}\'.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const options = context.options[0] || {}
    const ignoreEOLComments = options.ignoreEOLComments
    const exceptions = Object.assign({ Property: true, ImportAttribute: true }, options.exceptions)
    const hasExceptions = Object.keys(exceptions).some(key => exceptions[key])

    const spacesRe = options.includeTabs === false ? / {2}/ : /[ \t]{2}/

    /**
     * Formats value of given comment token for error message by truncating its length.
     * @param token comment token
     * @returns formatted value
     * @private
     */
    function formatReportedCommentValue(token: Token): string {
      const valueLines = token.value.split('\n')
      const value = valueLines[0]
      const formattedValue = `${value.slice(0, 12)}...`

      return valueLines.length === 1 && value.length <= 12 ? value : formattedValue
    }

    return {
      Program() {
        sourceCode.tokensAndComments.forEach((leftToken, leftIndex, tokensAndComments) => {
          if (leftIndex === tokensAndComments.length - 1)
            return

          const rightToken = tokensAndComments[leftIndex + 1]

          // Ignore tokens that don't have 2 spaces between them or are on different lines
          if (
            !spacesRe.test(sourceCode.text.slice(leftToken.range[1], rightToken.range[0]))
            || leftToken.loc.end.line < rightToken.loc.start.line
          ) {
            return
          }

          // Ignore comments that are the last token on their line if `ignoreEOLComments` is active.
          if (
            ignoreEOLComments
            && isCommentToken(rightToken)
            && (
              leftIndex === tokensAndComments.length - 2
              || rightToken.loc.end.line < tokensAndComments[leftIndex + 2].loc.start.line
            )
          ) {
            return
          }

          // Ignore tokens that are in a node in the "exceptions" object
          if (hasExceptions) {
            const parentNode = sourceCode.getNodeByRangeIndex(rightToken.range[0] - 1)

            if (parentNode && exceptions[parentNode.type])
              return
          }

          let displayValue

          if (rightToken.type === 'Block')
            displayValue = `/*${formatReportedCommentValue(rightToken)}*/`
          else if (rightToken.type === 'Line')
            displayValue = `//${formatReportedCommentValue(rightToken)}`
          else
            displayValue = rightToken.value

          context.report({
            node: rightToken,
            loc: { start: leftToken.loc.end, end: rightToken.loc.start },
            messageId: 'multipleSpaces',
            data: { displayValue },
            fix: fixer => fixer.replaceTextRange([leftToken.range[1], rightToken.range[0]], ' '),
          })
        })
      },
    }
  },
})
