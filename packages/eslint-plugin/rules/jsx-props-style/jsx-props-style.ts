import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  isSingleLine,
  isTokenOnSameLine,
} from '#utils/ast'
import { getPropName } from '#utils/ast/jsx'
import { createRule } from '#utils/create-rule'
import { safeReplaceTextBetween } from '#utils/fix'

type JsxProp = Tree.JSXAttribute | Tree.JSXSpreadAttribute

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
            maxItemsPerLine: {
              type: 'integer',
              minimum: 1,
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
        maxItemsPerLine: 1,
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

    function getPrevToken(node: JsxProp, prev: ASTNode, i: number) {
      return i === 0
        ? sourceCode.getTokenBefore(node)!
        : sourceCode.getLastToken(prev)!
    }

    function reportShouldWrap(node: JsxProp, prev: ASTNode, i: number) {
      const prevToken = getPrevToken(node, prev, i)
      context.report({
        node,
        messageId: 'shouldWrap',
        data: {
          prop: getPropName(sourceCode, node),
        },
        fix: safeReplaceTextBetween(sourceCode, prevToken, node, '\n'),
      })
    }

    function reportShouldNotWrap(node: JsxProp, prev: ASTNode, i: number) {
      const prevToken = getPrevToken(node, prev, i)
      context.report({
        node,
        messageId: 'shouldNotWrap',
        data: {
          prop: getPropName(sourceCode, node),
        },
        fix: safeReplaceTextBetween(sourceCode, prevToken, node, ' '),
      })
    }

    return {
      JSXOpeningElement(node) {
        const attrs = node.attributes
        if (!attrs.length)
          return

        const needWrap = isSingleLine(node)
          ? attrs.length > singleLine!.maxItems!
          : attrs.length >= multiLine!.minItems! && node.loc.start.line !== attrs[0].loc.start.line

        const maxPerLine = needWrap ? multiLine!.maxItemsPerLine! : Number.POSITIVE_INFINITY

        let itemsOnCurrentLine = 0

        for (let i = 0; i < attrs.length; i++) {
          const current = attrs[i]
          const prev = i === 0
            ? (node.typeArguments ?? node.name)
            : attrs[i - 1]

          const sameLine = isTokenOnSameLine(prev, current)

          if (sameLine) {
            itemsOnCurrentLine++

            if (!needWrap)
              continue

            if (i === 0) {
              reportShouldWrap(current, prev, i)
            }
            else if (itemsOnCurrentLine > maxPerLine) {
              reportShouldWrap(current, prev, i)
              itemsOnCurrentLine = 1
            }
          }
          else {
            itemsOnCurrentLine = 1

            if (needWrap)
              continue

            reportShouldNotWrap(current, prev, i)
          }
        }
      },
    }
  },
})
