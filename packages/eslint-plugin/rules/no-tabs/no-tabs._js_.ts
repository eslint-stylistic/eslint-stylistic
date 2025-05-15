/**
 * @fileoverview Rule to check for tabs inside a file
 * @author Gyandeep Singh
 */

import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

const tabRegex = /\t+/gu
const anyNonWhitespaceRegex = /\S/u

export default createRule<RuleOptions, MessageIds>({
  name: 'no-tabs',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow all tabs',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        allowIndentationTabs: {
          type: 'boolean',
          default: false,
        },
        tabSize: {
          oneOf: [
            { type: 'integer' },
            { type: 'boolean', enum: [false] },
          ],
          default: 4,
        },
      },
      additionalProperties: false,
    }],
    defaultOptions: [{
      allowIndentationTabs: false,
      tabSize: false,
    }],
    messages: {
      unexpectedTab: 'Unexpected tab character.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const allowIndentationTabs = context.options && context.options[0] && context.options[0].allowIndentationTabs
    const tabSize = context.options && context.options[0] && context.options[0].tabSize

    return {
      Program(node) {
        sourceCode.getLines().forEach((line, index) => {
          let match

          while ((match = tabRegex.exec(line)) !== null) {
            if (allowIndentationTabs && !anyNonWhitespaceRegex.test(line.slice(0, match.index)))
              continue

            const loc = {
              start: {
                line: index + 1,
                column: match.index,
              },
              end: {
                line: index + 1,
                column: match.index + match[0].length,
              },
            }
            if (tabSize !== undefined && tabSize !== false) {
              const tabCount = match[0].split('\t').length - 1
              context.report({
                node,
                loc,
                messageId: 'unexpectedTab',
                fix(fixer) {
                  return fixer.replaceTextRange([sourceCode.getIndexFromLoc(loc.start), sourceCode.getIndexFromLoc(loc.end)], ' '.repeat(tabSize).repeat(tabCount))
                },
              })
            }
            else {
              context.report({
                node,
                loc,
                messageId: 'unexpectedTab',
              })
            }
          }
        })
      },
    }
  },
})
