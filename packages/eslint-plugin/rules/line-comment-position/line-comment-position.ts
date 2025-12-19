import type { MessageIds, RuleOptions } from './types'
import { COMMENTS_IGNORE_PATTERN, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

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
              applyDefaultIgnorePatterns: {
                type: 'boolean',
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      above: 'Expected comment to be above code.',
      beside: 'Expected comment to be beside code.',
    },
    defaultOptions: ['above'],
  },

  create(context, [options]) {
    let above
    let applyDefaultIgnorePatterns = true
    let customIgnoreRegExp: RegExp | undefined

    if (!options || typeof options === 'string') {
      above = options === 'above'
    }
    else {
      above = !options.position || options.position === 'above'
      if (options.ignorePattern)
        customIgnoreRegExp = new RegExp(options.ignorePattern, 'u')

      if (Object.hasOwn(options, 'applyDefaultIgnorePatterns'))
        applyDefaultIgnorePatterns = options.applyDefaultIgnorePatterns!
    }

    const defaultIgnoreRegExp = COMMENTS_IGNORE_PATTERN
    const fallThroughRegExp = /^\s*falls?\s?through/u
    const sourceCode = context.sourceCode

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.forEach((node) => {
          if (node.type !== 'Line')
            return

          if (applyDefaultIgnorePatterns && (defaultIgnoreRegExp.test(node.value) || fallThroughRegExp.test(node.value)))
            return

          if (customIgnoreRegExp && customIgnoreRegExp.test(node.value))
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
