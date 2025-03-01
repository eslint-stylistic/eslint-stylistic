/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isNodeFirstInLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const messages = {
  onOwnLine: 'Closing tag of a multiline JSX expression must be on its own line.',
  matchIndent: 'Expected closing tag to match indentation of opening.',
  alignWithOpening: 'Expected closing tag to be aligned with the line containing the opening tag',
} as const

const DEFAULT_LOCATION = 'tag-aligned'

const MESSAGE_LOCATION = {
  'tag-aligned': 'matchIndent',
  'line-aligned': 'alignWithOpening',
} as const

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-closing-tag-location',
  package: 'jsx',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce closing tag location for multiline JSX',
      recommended: true,
    },
    fixable: 'whitespace',
    messages,
    schema: [{
      anyOf: [
        {
          type: 'string',
          enum: ['tag-aligned', 'line-aligned'],
          default: DEFAULT_LOCATION,
        },
      ],
    }],
  },

  defaultOptions: [
    DEFAULT_LOCATION,
  ],

  create(context) {
    const option: 'tag-aligned' | 'line-aligned' = context.options[0] || DEFAULT_LOCATION

    function getIndentation(
      openingStartOfLine: {
        column: number | undefined
        line: number
      },
      opening: ASTNode,
    ) {
      if (option === 'line-aligned')
        return openingStartOfLine.column
      else
        return opening.loc.start.column
    }

    function handleClosingElement(node: Tree.JSXClosingElement | Tree.JSXClosingFragment) {
      if (!node.parent)
        return

      const sourceCode = context.sourceCode

      const opening = ('openingFragment' in node.parent)
        ? node.parent.openingFragment
        : node.parent.openingElement

      const openingLoc = sourceCode.getFirstToken(opening)!.loc.start
      const openingLine = sourceCode.lines[openingLoc.line - 1]
      const openingStartOfLine = {
        column: /^\s*/.exec(openingLine)?.[0].length,
        line: openingLoc.line,
      }

      if (opening!.loc.start.line === node.loc.start.line)
        return

      if (
        opening.loc.start.column === node.loc.start.column
        && option === 'tag-aligned'
      ) {
        return
      }

      if (
        openingStartOfLine.column === node.loc.start.column
        && option === 'line-aligned'
      ) {
        return
      }

      const messageId: MessageIds = isNodeFirstInLine(context, node)
        ? MESSAGE_LOCATION[option as keyof typeof MESSAGE_LOCATION]
        : 'onOwnLine'

      context.report({
        node,
        messageId,
        loc: node.loc,
        fix(fixer) {
          const indent = new Array((getIndentation(openingStartOfLine, opening) || 0) + 1).join(' ')
          if (isNodeFirstInLine(context, node)) {
            return fixer.replaceTextRange(
              [node.range[0] - node.loc.start.column, node.range[0]],
              indent,
            )
          }

          return fixer.insertTextBefore(node, `\n${indent}`)
        },
      })
    }

    return {
      JSXClosingElement: handleClosingElement,
      JSXClosingFragment: handleClosingElement,
    }
  },
})
