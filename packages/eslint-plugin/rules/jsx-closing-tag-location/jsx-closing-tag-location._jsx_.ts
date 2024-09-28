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
}

const DEFAULT_LOCATION = 'tag-aligned'

const MESSAGE_LOCATION = {
  'tag-aligned': 'matchIndent',
  'line-aligned': 'alignWithOpening',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-closing-tag-location',
  package: 'jsx',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce closing tag location for multiline JSX',
    },
    fixable: 'whitespace',
    messages,
    schema: [{
      anyOf: [
        {
          enum: ['tag-aligned', 'line-aligned'],
        },
        {
          type: 'object',
          properties: {
            location: {
              enum: ['tag-aligned', 'line-aligned'],
            },
          },
          additionalProperties: false,
        },
      ],
    }],
  },

  create(context) {
    const config = context.options[0]
    let option = DEFAULT_LOCATION

    if (typeof config === 'string') {
      option = config
    }
    else if (typeof config === 'object') {
      if (Object.hasOwn(config, 'location')) {
        option = config.location
      }
    }

    function getIndentation(openingStartOfLine, opening) {
      if (option === 'line-aligned')
        return openingStartOfLine.column
      if (option === 'tag-aligned')
        return opening.loc.start.column
    }

    function handleClosingElement(node: Tree.JSXClosingElement | Tree.JSXClosingFragment) {
      if (!node.parent)
        return

      const sourceCode = context.getSourceCode()

      let opening: ASTNode
      if ('openingFragment' in node.parent)
        opening = node.parent.openingFragment
      if ('openingElement' in node.parent)
        opening = node.parent.openingElement

      const openingLoc = sourceCode.getFirstToken(opening).loc.start
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

      const messageId = isNodeFirstInLine(context, node)
        ? MESSAGE_LOCATION[option as keyof typeof MESSAGE_LOCATION]
        : 'onOwnLine'

      context.report({
        node,
        messageId,
        loc: node.loc,
        fix(fixer) {
          const indent = new Array(getIndentation(openingStartOfLine, opening) + 1).join(' ')
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
