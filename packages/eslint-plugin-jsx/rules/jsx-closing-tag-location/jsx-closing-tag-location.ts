/**
 * @fileoverview Validate closing tag location in JSX
 * @author Ross Solomon
 */

import { isNodeFirstInLine } from '../../utils/ast'
import { createRule } from '../../utils/createRule'
import { docsUrl } from '../../utils/docsUrl'
import report from '../../utils/report'
import type { RuleFixer, Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  onOwnLine: 'Closing tag of a multiline JSX expression must be on its own line.',
  matchIndent: 'Expected closing tag to match indentation of opening.',
}

export default createRule<MessageIds, RuleOptions>({
  meta: {
    docs: {
      description: 'Enforce closing tag location for multiline JSX',
      // @ts-expect-error typescript-eslint typedef does not include this
      category: 'Stylistic Issues',
      url: docsUrl('jsx-closing-tag-location'),
    },
    fixable: 'whitespace',
    messages,
  },

  create(context) {
    function handleClosingElement(node: Tree.JSXClosingElement | Tree.JSXClosingFragment) {
      if (!node.parent)
        return

      let opening: Tree.Node
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
      report(context, messages[messageId], messageId, {
        node,
        loc: node.loc,
        fix(fixer: RuleFixer) {
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
