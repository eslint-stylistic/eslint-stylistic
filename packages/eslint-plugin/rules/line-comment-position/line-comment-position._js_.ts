/**
 * @fileoverview Rule to enforce the position of line comments
 * @author Alberto Rodríguez
 */
import type { MessageIds, RuleOptions } from './types._js_'
import { createRule } from '#utils/create-rule'
import { COMMENTS_IGNORE_PATTERN } from '#utils/ast'

export default createRule<RuleOptions, MessageIds>({
  name: 'line-comment-position',
  package: 'js',
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
    messages: {
      above: 'Expected comment to be above code.',
      beside: 'Expected comment to be beside code.',
    },
  },

  create(context) {
    const options = context.options[0]

    let above
    let ignorePattern: string
    let applyDefaultIgnorePatterns = true
    let customIgnoreRegExp: RegExp

    if (!options || typeof options === 'string') {
      above = !options || options === 'above'
    }
    else {
      above = !options.position || options.position === 'above'
      ignorePattern = options.ignorePattern!
      customIgnoreRegExp = new RegExp(ignorePattern, 'u')

      if (Object.hasOwn(options, 'applyDefaultIgnorePatterns'))
        applyDefaultIgnorePatterns = options.applyDefaultIgnorePatterns!
      else
        applyDefaultIgnorePatterns = options.applyDefaultPatterns !== false
    }

    const defaultIgnoreRegExp = COMMENTS_IGNORE_PATTERN
    const fallThroughRegExp = /^\s*falls?\s?through/u
    const sourceCode = context.sourceCode

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.filter(token => token.type === 'Line').forEach((node) => {
          if (applyDefaultIgnorePatterns && (defaultIgnoreRegExp.test(node.value) || fallThroughRegExp.test(node.value)))
            return

          if (ignorePattern && customIgnoreRegExp.test(node.value))
            return

          const previous = sourceCode.getTokenBefore(node, { includeComments: true })
          const isOnSameLine = previous && previous.loc.end.line === node.loc.start.line

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
