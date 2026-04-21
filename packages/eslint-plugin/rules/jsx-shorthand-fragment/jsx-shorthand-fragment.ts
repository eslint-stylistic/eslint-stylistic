import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { AST_NODE_TYPES } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-shorthand-fragment',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce shorthand fragment syntax.',
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferShorthandFragment: 'Use shorthand fragment syntax `<>...</>` instead of `<{{pattern}}>...</{{pattern}}>`.',
    },
  },
  create(context) {
    function reportSyntaxPreferred(node: Tree.JSXOpeningElement, pattern: string) {
      if (node.attributes.length > 0)
        return
      context.report({
        node,
        messageId: 'preferShorthandFragment',
        data: { pattern },
        fix(fixer) {
          const closing = (node.parent as Tree.JSXElement | undefined)?.closingElement
          if (!closing)
            return null
          return [fixer.replaceText(node, '<>'), fixer.replaceText(closing, '</>')]
        },
      })
    }

    return {
      JSXOpeningElement(node) {
        const { name } = node
        if (name.type === AST_NODE_TYPES.JSXIdentifier && name.name === 'Fragment') {
          reportSyntaxPreferred(node, 'Fragment')
          return
        }
        if (name.type !== AST_NODE_TYPES.JSXMemberExpression)
          return
        if (name.object.type !== AST_NODE_TYPES.JSXIdentifier || name.object.name !== 'React')
          return
        if (name.property.type !== AST_NODE_TYPES.JSXIdentifier || name.property.name !== 'Fragment')
          return
        reportSyntaxPreferred(node, 'React.Fragment')
      },
    }
  },
})
