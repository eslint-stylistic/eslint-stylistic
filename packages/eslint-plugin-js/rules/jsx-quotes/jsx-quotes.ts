/**
 * @fileoverview A rule to ensure consistent quotes used in jsx syntax.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

import { isStringLiteral, isSurroundedBy } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'
import type { Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

interface QuoteSetting {
  quote: string
  description: string
  convert(str: string): string
}

const QUOTE_SETTINGS: Record<string, QuoteSetting> = {
  'prefer-double': {
    quote: '"',
    description: 'singlequote',
    convert(str) {
      return str.replace(/'/gu, '"')
    },
  },
  'prefer-single': {
    quote: '\'',
    description: 'doublequote',
    convert(str) {
      return str.replace(/"/gu, '\'')
    },
  },
}

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce the consistent use of either double or single quotes in JSX attributes',
      url: 'https://eslint.style/rules/js/jsx-quotes',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'string',
        enum: ['prefer-single', 'prefer-double'],
      },
    ],
    messages: {
      unexpected: 'Unexpected usage of {{description}}.',
    },
  },

  create(context) {
    const quoteOption = context.options[0] || 'prefer-double'
    const setting = QUOTE_SETTINGS[quoteOption]

    /**
     * Checks if the given string literal node uses the expected quotes
     * @param node A string literal node.
     * @returns Whether or not the string literal used the expected quotes.
     * @public
     */
    function usesExpectedQuotes(node: Tree.StringLiteral) {
      return node.value.includes(setting.quote) || isSurroundedBy(node.raw, setting.quote)
    }

    return {
      JSXAttribute(node) {
        const attributeValue = node.value

        if (attributeValue && isStringLiteral(attributeValue) && !usesExpectedQuotes(attributeValue)) {
          context.report({
            node: attributeValue,
            messageId: 'unexpected',
            data: {
              description: setting.description,
            },
            fix(fixer) {
              return fixer.replaceText(attributeValue, setting.convert(attributeValue.raw))
            },
          })
        }
      },
    }
  },
})
