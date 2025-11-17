/**
 * @fileoverview Rule to enforce a single linebreak style.
 * @author Erik Mueller
 */

import type * as core from '@eslint/core'
import type * as pluginKit from '@eslint/plugin-kit'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

type TextSourceCode
  = Pick<pluginKit.TextSourceCodeBase, 'getLocFromIndex' | 'lines'>
    & core.TextSourceCode

function isTextSourceCode(sourceCode: core.SourceCode & Partial<TextSourceCode>): sourceCode is TextSourceCode {
  if (typeof sourceCode.text !== 'string') {
    // BinarySourceCode is ignored
    // ESLint can specify binary source code using type annotations,
    // but it seems that there is no plugin yet that can actually use binary source code.
    return false
  }
  return (
    // If it is not a plugin kit's TextSourceCodeBase, the rule will be ignored.
    // For the rule to work, SourceCode must implement at least `lines` and `getLocFromIndex()`.
    typeof sourceCode.getLocFromIndex === 'function'
    && Array.isArray(sourceCode.lines)
  )
}

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

    if (!isTextSourceCode(sourceCode)) {
      return {}
    }

    const source = sourceCode.text
    const lines = sourceCode.lines

    const linebreakStyle = context.options[0] || 'unix'
    const expectedLF = linebreakStyle === 'unix'
    const expectedLFChars = expectedLF ? '\n' : '\r\n'

    let currentIndex = 0
    for (let lineIndex = 0; lineIndex < lines.length - 1; lineIndex++) {
      const line = lines[lineIndex]
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
