/**
 * @fileoverview Require or disallow newline at the end of files
 * @author Nodeca Team <https://github.com/nodeca>
 */

import type * as core from '@eslint/core'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'
import { hasLinesAndGetLocFromIndex, isTextSourceCode } from '#utils/eslint-core'
import { warnDeprecation } from '#utils/index'

export default createRule<RuleOptions, MessageIds>({
  name: 'eol-last',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow newline at the end of files',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'string',
        enum: ['always', 'never', 'unix', 'windows'],
      },
    ],
    messages: {
      missing: 'Newline required at end of file but not found.',
      unexpected: 'Newline not allowed at end of file.',
    },
  },
  create(context) {
    // Language-agnostic SourceCode access
    const sourceCode = context.sourceCode as unknown as core.SourceCode

    if (!isTextSourceCode(sourceCode) || !hasLinesAndGetLocFromIndex(sourceCode)) {
      return {}
    }

    const src = sourceCode.text
    const LF = '\n'
    const CRLF = `\r${LF}`
    const endsWithNewline = src.endsWith(LF)

    /**
     * Empty source is always valid: No content in file so we don't
     * need to lint for a newline on the last line of content.
     */
    if (!src.length)
      return {}

    let mode = context.options[0] || 'always'
    let appendCRLF = false

    if (mode === 'unix') {
      warnDeprecation('option("unix")', '"always" and "@stylistic/eslint-plugin/rules/linebreak-style"', 'eol-last')
      // `"unix"` should behave exactly as `"always"`
      mode = 'always'
    }
    if (mode === 'windows') {
      warnDeprecation('option("windows")', '"always" and "@stylistic/eslint-plugin/rules/linebreak-style"', 'eol-last')
      // `"windows"` should behave exactly as `"always"`, but append CRLF in the fixer for backwards compatibility
      mode = 'always'
      appendCRLF = true
    }
    if (mode === 'always' && !endsWithNewline) {
      // File is not newline-terminated, but should be
      context.report({
        loc: sourceCode.getLocFromIndex(src.length),
        messageId: 'missing',
        fix(fixer) {
          return fixer.insertTextAfterRange([0, src.length], appendCRLF ? CRLF : LF)
        },
      })
    }
    else if (mode === 'never' && endsWithNewline) {
      const startLoc = sourceCode.getLocFromIndex(src.length - (src.endsWith(CRLF) ? 2 : 1))
      const endLoc = sourceCode.getLocFromIndex(src.length)

      // File is newline-terminated, but shouldn't be
      context.report({
        loc: {
          start: startLoc,
          end: endLoc,
        },
        messageId: 'unexpected',
        fix(fixer) {
          const finalEOLs = /(?:\r?\n)+$/u
          const match = finalEOLs.exec(src)! // endsWithNewline is true
          const start = match.index
          const end = src.length

          return fixer.replaceTextRange([start, end], '')
        },
      })
    }

    return {}
  },
})
