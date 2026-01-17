/**
 * @fileoverview Rule to enforce a single linebreak style.
 * @author Erik Mueller
 */

import type * as core from '@eslint/core'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'
import { hasLinesAndGetLocFromIndex, isTextSourceCode } from '#utils/eslint-core'

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
    // Language-agnostic SourceCode access
    const sourceCode = context.sourceCode as unknown as core.SourceCode

    if (!isTextSourceCode(sourceCode) || !hasLinesAndGetLocFromIndex(sourceCode)) {
      return {}
    }

    const source = sourceCode.text
    const lines = sourceCode.lines

    const linebreakStyle = context.options[0] || 'unix'
    const expectedLF = linebreakStyle === 'unix'
    const expectedLFChars = expectedLF ? '\n' : '\r\n'

    let currentIndex = 0
    for (const line of lines.slice(0, -1)) {
      const startIndex = currentIndex + line.length
      const startLoc = sourceCode.getLocFromIndex(startIndex)

      // Find linebreak end index
      // startIndex is at the beginning of linebreak chars
      let endIndex = startIndex + 1
      let endLoc = sourceCode.getLocFromIndex(endIndex)
      while (
        // Still in linebreak chars
        endLoc.line === startLoc.line
        && endIndex < source.length
      ) {
        endIndex++
        endLoc = sourceCode.getLocFromIndex(endIndex)
      }

      const linebreakChars = source.slice(startIndex, endIndex)
      if (linebreakChars !== expectedLFChars) {
        context.report({
          loc: {
            start: startLoc,
            end: endLoc,
          },
          messageId: expectedLF ? 'expectedLF' : 'expectedCRLF',
          fix: fixer => fixer.replaceTextRange([startIndex, endIndex], expectedLFChars),
        })
      }

      currentIndex = endIndex
    }

    return {}
  },
})
