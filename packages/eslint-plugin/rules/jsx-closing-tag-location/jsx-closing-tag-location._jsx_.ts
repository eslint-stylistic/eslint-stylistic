/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

import type { MessageIds, RuleOptions } from './types._jsx_'
import type { ASTNode, Tree } from '#types'
import { isNodeFirstInLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const messages = {
  onOwnLine: 'Closing tag of a multiline JSX expression must be on its own line.',
  matchIndent: 'Expected closing tag to match indentation of opening.',
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
    schema: [],
  },

  create(context) {
    function handleClosingElement(node: Tree.JSXClosingElement | Tree.JSXClosingFragment) {
      if (!node.parent)
        return

      let opening: ASTNode
      if ('openingFragment' in node.parent)
        opening = node.parent.openingFragment
      if ('openingElement' in node.parent)
        opening = node.parent.openingElement

      if (opening!.loc.start.line === node.loc.start.line)
        return

      if (opening!.loc.start.column === node.loc.start.column)
        return

      const messageId = isNodeFirstInLine(context, node)
        ? 'matchIndent'
        : 'onOwnLine'

      context.report({
        node,
        messageId,
        loc: node.loc,
        fix(fixer) {
          const indent = Array(opening.loc.start.column + 1).join(' ')
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
