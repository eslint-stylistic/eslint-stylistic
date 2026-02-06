import type { RuleContext, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  hasCommentsBetween,
  isSingleLine,
  isTokenOnSameLine,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

function getPropName(context: RuleContext<MessageIds, RuleOptions>, propNode: Tree.JSXAttribute | Tree.JSXSpreadAttribute) {
  if (propNode.type === 'JSXSpreadAttribute')
    return `{...${context.sourceCode.getText(propNode.argument)}}`

  return String(propNode.name.name)
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-props-style',
  meta: {
    type: 'layout',
    docs: {
      experimental: true,
      description: 'Enforce consistent line break styles for JSX props',
    },
    fixable: 'code',
    messages: {
      newLine: 'Prop `{{prop}}` must be placed on a new line',
      singleLine: 'Prop `{{prop}}` should not be placed on a new line',
    },
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
  },
  defaultOptions: [{
    singleLine: {
      maxItems: Number.POSITIVE_INFINITY,
    },
    multiLine: {
      minItems: 0,
    },
  }],
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

        const isSingleLineTag = isSingleLine(node)

        const needWrap = isSingleLineTag
          ? attrs.length > singleLine!.maxItems!
          : attrs.length >= multiLine!.minItems! && node.loc.start.line !== attrs[0].loc.start.line

        for (let i = 0; i < attrs.length; i++) {
          const current = attrs[i]
          const prev = i === 0
            ? (node.typeArguments || node.name)
            : attrs[i - 1]

          if (isTokenOnSameLine(prev, current)) {
            if (!needWrap)
              continue

            if (i === 0 && prev.loc.end.line === current.loc.start.line && !needWrap)
              continue

            context.report({
              node: current,
              messageId: 'newLine',
              data: {
                prop: getPropName(context, current),
              },
              fix(fixer) {
                const prevToken = i === 0
                  ? sourceCode.getTokenBefore(current)!
                  : sourceCode.getLastToken(prev)!

                if (hasCommentsBetween(sourceCode, prevToken, sourceCode.getFirstToken(current)!))
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
              messageId: 'singleLine',
              data: {
                prop: getPropName(context, current),
              },
              fix(fixer) {
                const prevToken = i === 0
                  ? sourceCode.getTokenBefore(current)!
                  : sourceCode.getLastToken(prev)!

                if (hasCommentsBetween(sourceCode, prevToken, sourceCode.getFirstToken(current)!))
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
