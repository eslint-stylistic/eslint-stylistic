import type { MessageIds, RuleOptions } from './types'
import {
  isSingleLine,
  isTokenOnSameLine,
} from '#utils/ast'
import { getPropName } from '#utils/ast/jsx'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-props-style',
  meta: {
    type: 'layout',
    docs: {
      experimental: true,
      description: 'Enforce consistent line break styles for JSX props',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      additionalProperties: false,
      properties: {
        singleLine: {
          type: 'object',
          additionalProperties: false,
          properties: {
            maxItems: {
              type: 'integer',
              minimum: 0,
            },
          },
        },
        multiLine: {
          type: 'object',
          additionalProperties: false,
          properties: {
            minItems: {
              type: 'integer',
              minimum: 0,
            },
          },
        },
      },
    }],
    // #region defaultOptions
    defaultOptions: [{
      singleLine: {
        maxItems: Number.POSITIVE_INFINITY,
      },
      multiLine: {
        minItems: 0,
      },
    }],
    // #endregion defaultOptions
    messages: {
      shouldWrap: 'Prop `{{prop}}` must be placed on a new line',
      shouldNotWrap: 'Prop `{{prop}}` should not be placed on a new line',
    },
  },
  create(context, [option]) {
    const { sourceCode } = context
    const {
      singleLine,
      multiLine,
    } = option!

    return {
      JSXOpeningElement(node) {
        const attrs = node.attributes
        if (!attrs.length)
          return

        const needWrap = isSingleLine(node)
          ? attrs.length > singleLine!.maxItems!
          : attrs.length >= multiLine!.minItems! && node.loc.start.line !== attrs[0].loc.start.line

        for (let i = 0; i < attrs.length; i++) {
          const current = attrs[i]
          const prev = i === 0
            ? (node.typeArguments ?? node.name)
            : attrs[i - 1]

          if (isTokenOnSameLine(prev, current)) {
            if (!needWrap)
              continue

            context.report({
              node: current,
              messageId: 'shouldWrap',
              data: {
                prop: getPropName(sourceCode, current),
              },
              fix(fixer) {
                const prevToken = i === 0
                  ? sourceCode.getTokenBefore(current)!
                  : sourceCode.getLastToken(prev)!

                if (sourceCode.commentsExistBetween(prevToken, sourceCode.getFirstToken(current)!))
                  return null

                return fixer.replaceTextRange([prevToken.range[1], current.range[0]], '\n')
              },
            })
          }
          else {
            if (needWrap)
              continue

            context.report({
              node: current,
              messageId: 'shouldNotWrap',
              data: {
                prop: getPropName(sourceCode, current),
              },
              fix(fixer) {
                const prevToken = i === 0
                  ? sourceCode.getTokenBefore(current)!
                  : sourceCode.getLastToken(prev)!

                if (sourceCode.commentsExistBetween(prevToken, sourceCode.getFirstToken(current)!))
                  return null

                return fixer.replaceTextRange([prevToken.range[1], current.range[0]], ' ')
              },
            })
          }
        }
      },
    }
  },
})
