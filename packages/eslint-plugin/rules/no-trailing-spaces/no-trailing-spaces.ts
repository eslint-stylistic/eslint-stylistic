/**
 * @fileoverview Disallow trailing spaces at the end of lines.
 * @author Nodeca Team <https://github.com/nodeca>
 */

import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createGlobalLinebreakMatcher } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'no-trailing-spaces',
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow trailing whitespace at the end of lines',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'object',
        properties: {
          skipBlankLines: {
            type: 'boolean',
            default: false,
          },
          ignoreComments: {
            type: 'boolean',
            default: false,
          },
          ignoreMarkdownLineBreaks: {
            type: 'string',
            enum: ['never', 'always', 'comments'],
            default: 'never',
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      trailingSpace: 'Trailing spaces not allowed.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    const BLANK_CLASS = '[ \t\u00A0\u2000-\u200B\u3000]'
    // eslint-disable-next-line regexp/no-obscure-range
    const SKIP_BLANK = `^${BLANK_CLASS}*$`
    // eslint-disable-next-line regexp/no-obscure-range
    const NONBLANK = `${BLANK_CLASS}+$`

    const options = context.options[0] || {}
    const skipBlankLines = options.skipBlankLines || false
    const ignoreComments = options.ignoreComments || false
    const ignoreMarkdownLineBreaks = options.ignoreMarkdownLineBreaks || 'never'

    /**
     * Report the error message
     * @param node node to report
     * @param location range information
     * @param fixRange Range based on the whole program
     */
    function report(node: ASTNode, location: Tree.Position | Tree.SourceLocation, fixRange: Readonly<Tree.Range>) {
      /**
       * Passing node is a bit dirty, because message data will contain big
       * text in `source`. But... who cares :) ?
       * One more kludge will not make worse the bloody wizardry of this
       * plugin.
       */
      context.report({
        node,
        loc: location,
        messageId: 'trailingSpace',
        fix(fixer) {
          return fixer.removeRange(fixRange)
        },
      })
    }

    /**
     * Given a list of comment nodes, return the line numbers for those comments.
     * @param comments An array of comment nodes.
     * @returns An array of line numbers containing comments.
     */
    function getCommentLineNumbers(comments: Tree.Comment[]) {
      const lines = new Set<number>()

      comments.forEach((comment) => {
        const endLine = comment.type === 'Block'
          ? comment.loc.end.line - 1
          : comment.loc.end.line

        for (let i = comment.loc.start.line; i <= endLine; i++)
          lines.add(i)
      })

      return lines
    }

    /**
     * Given a list of comment nodes, return the line numbers for block comments only.
     * Block comments are multiline comments (starting with /* or /**).
     * @param comments An array of comment nodes.
     * @returns A set of line numbers that are inside block comments.
     */
    function getBlockCommentLineNumbers(comments: Tree.Comment[]) {
      const lines = new Set<number>()

      comments.forEach((comment) => {
        if (comment.type !== 'Block')
          return

        // Exclude the last line (closing */) as markdown line break before it doesn't make sense
        const endLine = comment.loc.end.line - 1

        for (let i = comment.loc.start.line; i <= endLine; i++)
          lines.add(i)
      })

      return lines
    }

    return {

      Program: function checkTrailingSpaces(node) {
        /**
         * Let's hack. Since Espree does not return whitespace nodes,
         * fetch the source code and do matching via regexps.
         */

        const re = new RegExp(NONBLANK, 'u')
        const skipMatch = new RegExp(SKIP_BLANK, 'u')
        const lines = sourceCode.lines
        const linebreaks = sourceCode.getText().match(createGlobalLinebreakMatcher())
        const comments = sourceCode.getAllComments()
        const commentLineNumbers = getCommentLineNumbers(comments)
        const blockCommentLineNumbers = getBlockCommentLineNumbers(comments)

        let totalLength = 0

        for (let i = 0, ii = lines.length; i < ii; i++) {
          const lineNumber = i + 1

          /**
           * Always add linebreak length to line length to accommodate for line break (\n or \r\n)
           * Because during the fix time they also reserve one spot in the array.
           * Usually linebreak length is 2 for \r\n (CRLF) and 1 for \n (LF)
           */
          const linebreakLength = linebreaks && linebreaks[i] ? linebreaks[i].length : 1
          const lineLength = lines[i].length + linebreakLength

          const matches = re.exec(lines[i])

          if (matches) {
            const location = {
              start: {
                line: lineNumber,
                column: matches.index,
              },
              end: {
                line: lineNumber,
                column: lineLength - linebreakLength,
              },
            }

            const rangeStart = totalLength + location.start.column
            const rangeEnd = totalLength + location.end.column
            const containingNode = sourceCode.getNodeByRangeIndex(rangeStart)

            if (containingNode && containingNode.type === 'TemplateElement'
              && rangeStart > containingNode.parent.range[0]
              && rangeEnd < containingNode.parent.range[1]) {
              totalLength += lineLength
              continue
            }

            /**
             * If the line has only whitespace, and skipBlankLines
             * is true, don't report it
             */
            if (skipBlankLines && skipMatch.test(lines[i])) {
              totalLength += lineLength
              continue
            }

            /**
             * If ignoreMarkdownLineBreaks is set, allow exactly two trailing spaces
             * when the next line is not empty (markdown line break syntax).
             * - "never": no markdown line breaks allowed (default)
             * - "always": allow everywhere (for .md files)
             * - "comments": only allow in block/multiline comments (for JSDoc in .js/.ts files)
             */
            if (ignoreMarkdownLineBreaks !== 'never') {
              const isInBlockComment = blockCommentLineNumbers.has(lineNumber)
              const shouldCheck = ignoreMarkdownLineBreaks === 'always'
                || (ignoreMarkdownLineBreaks === 'comments' && isInBlockComment)

              if (shouldCheck) {
                const trailingWhitespace = matches[0]
                const nextLine = lines[i + 1]
                const isExactlyTwoSpaces = trailingWhitespace === '  '

                // Check if next line has actual content
                // For block comments, strip the comment prefix (* or */) to check for real content
                let nextLineHasContent = nextLine !== undefined && nextLine.trim() !== ''
                if (nextLineHasContent && isInBlockComment) {
                  // In block comments, lines like " *" or " *   " or " */" are effectively empty
                  const commentContent = nextLine.replace(/^\s*\*\/?/, '')
                  nextLineHasContent = commentContent.trim() !== ''
                }

                if (isExactlyTwoSpaces && nextLineHasContent) {
                  totalLength += lineLength
                  continue
                }
              }
            }

            const fixRange = [rangeStart, rangeEnd] as const

            if (!ignoreComments || !commentLineNumbers.has(lineNumber))
              report(node, location, fixRange)
          }

          totalLength += lineLength
        }
      },

    }
  },
})
