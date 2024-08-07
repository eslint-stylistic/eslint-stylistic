/**
 * @fileoverview Enforce spacing between rest and spread operators and their expressions.
 * @author Kai Cataldo
 */

import type { Tree } from '@shared/types'
import { createRule } from '../../utils/createRule'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce spacing between rest and spread operators and their expressions',
      url: 'https://eslint.style/rules/js/rest-spread-spacing',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
    ],

    messages: {
      unexpectedWhitespace: 'Unexpected whitespace after {{type}} operator.',
      expectedWhitespace: 'Expected whitespace after {{type}} operator.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const alwaysSpace = context.options[0] === 'always'

    /**
     * Checks whitespace between rest/spread operators and their expressions
     * @param node The node to check
     */
    function checkWhiteSpace(
      node:
        | Tree.SpreadElement
        | Tree.RestElement,
    ) {
      const operator = sourceCode.getFirstToken(node)!
      const nextToken = sourceCode.getTokenAfter(operator)!
      const hasWhitespace = sourceCode.isSpaceBetweenTokens(operator, nextToken)
      let type

      switch (node.type) {
        case 'SpreadElement':
          type = 'spread'
          if (node.parent.type === 'ObjectExpression')
            type += ' property'

          break
        case 'RestElement':
          type = 'rest'
          if (node.parent.type === 'ObjectPattern')
            type += ' property'

          break
        default:
          return
      }

      if (alwaysSpace && !hasWhitespace) {
        context.report({
          node,
          loc: operator.loc,
          messageId: 'expectedWhitespace',
          data: {
            type,
          },
          fix(fixer) {
            return fixer.replaceTextRange([operator.range[1], nextToken.range[0]], ' ')
          },
        })
      }
      else if (!alwaysSpace && hasWhitespace) {
        context.report({
          node,
          loc: {
            start: operator.loc.end,
            end: nextToken.loc.start,
          },
          messageId: 'unexpectedWhitespace',
          data: {
            type,
          },
          fix(fixer) {
            return fixer.removeRange([operator.range[1], nextToken.range[0]])
          },
        })
      }
    }

    return {
      SpreadElement: checkWhiteSpace,
      RestElement: checkWhiteSpace,
    }
  },
})
