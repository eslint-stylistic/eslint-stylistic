import type { MessageIds, RuleOptions } from './types'
import { AST_NODE_TYPES } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-shorthand-boolean',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce shorthand for boolean JSX attributes.',
    },
    fixable: 'code',
    schema: [],
    messages: {
      omitBooleanValue: 'Omit the value for boolean attributes.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const { value } = node
        if (value?.type !== AST_NODE_TYPES.JSXExpressionContainer)
          return

        if (value.expression.type !== AST_NODE_TYPES.Literal || value.expression.value !== true)
          return

        context.report({
          node,
          messageId: 'omitBooleanValue',
          fix: fixer => fixer.removeRange([node.name.range[1], value.range[1]]),
        })
      },
    }
  },
})
