/**
 * @fileoverview Disallow mixed spaces and tabs for indentation
 * @author Jary Niebur
 */

import { createRule } from '../../utils/createRule'
import type { MessageIds, RuleOptions } from './types'

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow mixed spaces and tabs for indentation',
      url: 'https://eslint.style/rules/js/no-mixed-spaces-and-tabs',
    },

    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['smart-tabs'],
          },
          {
            type: 'boolean',
          },
        ],
      },
    ],

    messages: {
      mixedSpacesAndTabs: 'Mixed spaces and tabs.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    let smartTabs: boolean

    switch (context.options[0]) {
      case true: // Support old syntax, maybe add deprecation warning here
      case 'smart-tabs':
        smartTabs = true
        break
      default:
        smartTabs = false
    }

    return {

      'Program:exit': function (node) {
        const lines = sourceCode.lines
        const comments = sourceCode.getAllComments()
        const ignoredCommentLines = new Set()

        // Add all lines except the first ones.
        comments.forEach((comment) => {
          for (let i = comment.loc.start.line + 1; i <= comment.loc.end.line; i++)
            ignoredCommentLines.add(i)
        })

        /**
         * At least one space followed by a tab
         * or the reverse before non-tab/-space
         * characters begin.
         */
        let regex = /^(?=( +|\t+))\1(?:\t| )/u

        if (smartTabs) {
          /**
           * At least one space followed by a tab
           * before non-tab/-space characters begin.
           */
          regex = /^(?=(\t*))\1(?=( +))\2\t/u
        }

        lines.forEach((line, i) => {
          const match = regex.exec(line)

          if (match) {
            const lineNumber = i + 1
            const loc = {
              start: {
                line: lineNumber,
                column: match[0].length - 2,
              },
              end: {
                line: lineNumber,
                column: match[0].length,
              },
            }

            if (!ignoredCommentLines.has(lineNumber)) {
              const containingNode = sourceCode.getNodeByRangeIndex(sourceCode.getIndexFromLoc(loc.start))

              if (!(containingNode && ['Literal', 'TemplateElement'].includes(containingNode.type))) {
                context.report({
                  node,
                  loc,
                  messageId: 'mixedSpacesAndTabs',
                })
              }
            }
          }
        })
      },
    }
  },
})
