/**
 * @fileoverview Rule to enforce a single linebreak style.
 * @author Erik Mueller
 */

import type { MessageIds, RuleOptions } from './types._js_'
import type { ReportFixFunction, Tree } from '#types'
import { createGlobalLinebreakMatcher } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'linebreak-style',
  package: 'js',
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

    /**
     * Builds a fix function that replaces text at the specified range in the source text.
     * @param range The range to replace
     * @param text The text to insert.
     * @returns Fixer function
     * @private
     */
    function createFix(range: Readonly<Tree.Range>, text: string): ReportFixFunction {
      return function (fixer) {
        return fixer.replaceTextRange(range, text)
      }
    }

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
            fix: createFix(range, expectedLFChars),
          })
        }
      },
    }
  },
})
