/**
 * @fileoverview Rule to flag when regex literals are not wrapped in parens
 * @author Matt DuVall <http://www.mattduvall.com>
 */

import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'wrap-regex',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require parenthesis around regex literals',
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireParens: 'Wrap the regexp literal in parens to disambiguate the slash.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    return {

      Literal(node) {
        const token = sourceCode.getFirstToken(node)!
        const nodeType = token.type

        if (nodeType === 'RegularExpression') {
          const beforeToken = sourceCode.getTokenBefore(node)
          const afterToken = sourceCode.getTokenAfter(node)
          const { parent } = node

          if (parent.type === 'MemberExpression' && parent.object === node
            && !(beforeToken && beforeToken.value === '(' && afterToken && afterToken.value === ')')) {
            context.report({
              node,
              messageId: 'requireParens',
              fix: fixer => fixer.replaceText(node, `(${sourceCode.getText(node)})`),
            })
          }
        }
      },
    }
  },
})
