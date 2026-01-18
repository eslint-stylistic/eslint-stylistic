import type { MessageIds, RuleOptions } from './types'
import { COMMENTS_IGNORE_PATTERN, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { warnDeprecatedOptions } from '#utils/index'

export default createRule<RuleOptions, MessageIds>({
  name: 'line-comment-position',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce position of line comments',
    },
    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['above', 'beside'],
          },
          {
            type: 'object',
            properties: {
              position: {
                type: 'string',
                enum: ['above', 'beside'],
              },
              ignorePattern: {
                type: 'string',
              },
              applyDefaultPatterns: {
                type: 'boolean',
              },
              applyDefaultIgnorePatterns: {
                type: 'boolean',
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    defaultOptions: ['above'],
    messages: {
      above: 'Expected comment to be above code.',
      beside: 'Expected comment to be beside code.',
    },
  },
  create(context, [options]) {
    const sourceCode = context.sourceCode

    if (typeof options !== 'string') {
      warnDeprecatedOptions(options, 'applyDefaultPatterns', 'applyDefaultIgnorePatterns', 'line-comment-position')
    }

    const {
      position = 'above',
      ignorePattern,
      applyDefaultPatterns = true,
      applyDefaultIgnorePatterns = applyDefaultPatterns,
    } = typeof options === 'string' ? { position: options } : options!

    const above = position === 'above'
    const customIgnoreRegExp = ignorePattern ? new RegExp(ignorePattern, 'u') : null

    const defaultIgnoreRegExp = COMMENTS_IGNORE_PATTERN
    const fallThroughRegExp = /^\s*falls?\s?through/u

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.forEach((node) => {
          if (node.type !== 'Line')
            return

          if (applyDefaultIgnorePatterns && (defaultIgnoreRegExp.test(node.value) || fallThroughRegExp.test(node.value)))
            return

          if (customIgnoreRegExp?.test(node.value))
            return

          const previous = sourceCode.getTokenBefore(node, { includeComments: true })
          const isOnSameLine = previous && isTokenOnSameLine(previous, node)

          if (above) {
            if (isOnSameLine) {
              context.report({
                node,
                messageId: 'above',
              })
            }
          }
          else {
            if (!isOnSameLine) {
              context.report({
                node,
                messageId: 'beside',
              })
            }
          }
        })
      },
    }
  },
})
