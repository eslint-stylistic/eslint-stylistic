/**
 * @fileoverview Rule to enforce a single linebreak style.
 * @author Erik Mueller
 */

import type { MessageIds, RuleOptions } from './types'
import { createGlobalLinebreakMatcher } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'linebreak-style',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent linebreak style',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'string',
        enum: ['unix', 'windows'],
      },
    ],
    messages: {
      expectedLF: 'Expected linebreaks to be \'LF\' but found \'CRLF\'.',
      expectedCRLF: 'Expected linebreaks to be \'CRLF\' but found \'LF\'.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    return {
      Program: function checkForLinebreakStyle(node) {
        const linebreakStyle = context.options[0] || 'unix'
        const expectedLF = linebreakStyle === 'unix'
        const expectedLFChars = expectedLF ? '\n' : '\r\n'
        const source = sourceCode.getText()
        const pattern = createGlobalLinebreakMatcher()
        let match

        let i = 0

        while ((match = pattern.exec(source)) !== null) {
          i++
          if (match[0] === expectedLFChars)
            continue

          const index = match.index
          const range = [index, index + match[0].length] as const

          context.report({
            node,
            loc: {
              start: {
                line: i,
                column: sourceCode.lines[i - 1].length,
              },
              end: {
                line: i + 1,
                column: 0,
              },
            },
            messageId: expectedLF ? 'expectedLF' : 'expectedCRLF',
            fix: fixer => fixer.replaceTextRange(range, expectedLFChars),
          })
        }
      },
    }
  },
})
