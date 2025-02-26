/**
 * @fileoverview A rule to ensure consistent quotes used in jsx syntax.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isStringLiteral, isSurroundedBy } from '#utils/ast'
import { createRule } from '#utils/create-rule'

interface QuoteSetting {
  quote: string
  description: string
  convert: (str: string) => string
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

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-quotes',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce the consistent use of either double or single quotes in JSX attributes',
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
