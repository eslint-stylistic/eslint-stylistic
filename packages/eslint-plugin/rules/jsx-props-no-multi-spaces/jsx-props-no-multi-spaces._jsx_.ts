/**
 * @fileoverview Disallow multiple spaces between inline JSX props
 * @author Adrian Moennich
 */

import type { MessageIds, RuleOptions } from './types._jsx_'
import type { Tree } from '#types'
import { createRule } from '#utils/create-rule'

const messages = {
  noLineGap: 'Expected no line gap between “{{prop1}}” and “{{prop2}}”',
  onlyOneSpace: 'Expected only one space between “{{prop1}}” and “{{prop2}}”',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-props-no-multi-spaces',
  package: 'jsx',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow multiple spaces between inline JSX props',
    },
    fixable: 'code',

    messages,

    schema: [],
  },

  create(context) {
    const sourceCode = context.sourceCode

    function getPropName(propNode: NodeType): string | Tree.JSXIdentifier {
      switch (propNode.type) {
        case 'JSXSpreadAttribute':
          return sourceCode.getText(propNode.argument)
        case 'JSXIdentifier':
          return propNode.name
        case 'JSXMemberExpression':
          return `${getPropName(propNode.object)}.${propNode.property.name}`
        default:
          return (propNode as Tree.JSXAttribute).name
            ? (propNode as Tree.JSXAttribute).name.name
            // needed for typescript-eslint parser
            : `${sourceCode.getText((propNode as Tree.JSXMemberExpression).object)}.${(propNode as Tree.JSXMemberExpression).property.name}`
      }
    }

    // First and second must be adjacent nodes
    function hasEmptyLines(first: NodeType, second: Tree.JSXAttribute | Tree.JSXSpreadAttribute) {
      const comments = sourceCode.getCommentsBefore ? sourceCode.getCommentsBefore(second) : []
      const nodes = ([] as (NodeType | Tree.Comment)[]).concat(first, comments, second)

      for (let i = 1; i < nodes.length; i += 1) {
        const prev = nodes[i - 1]
        const curr = nodes[i]
        if (curr.loc.start.line - prev.loc.end.line >= 2)
          return true
      }

      return false
    }

    function checkSpacing(prev: NodeType, node: Tree.JSXAttribute | Tree.JSXSpreadAttribute) {
      if (hasEmptyLines(prev, node)) {
        context.report({
          messageId: 'noLineGap',
          node,
          data: {
            prop1: getPropName(prev),
            prop2: getPropName(node),
          },
        })
      }

      if (prev.loc.end.line !== node.loc.end.line)
        return

      const between = sourceCode.text.slice(prev.range[1], node.range[0])

      if (between !== ' ') {
        context.report({
          node,
          messageId: 'onlyOneSpace',
          data: {
            prop1: getPropName(prev),
            prop2: getPropName(node),
          },
          fix(fixer) {
            return fixer.replaceTextRange([prev.range[1], node.range[0]], ' ')
          },
        })
      }
    }

    function containsGenericType(node: Tree.JSXOpeningElement) {
      const containsTypeParams = typeof node.typeArguments !== 'undefined'
      return containsTypeParams && node.typeArguments?.type === 'TSTypeParameterInstantiation'
    }

    function getGenericNode(node: Tree.JSXOpeningElement) {
      const name = node.name
      if (containsGenericType(node)) {
        const type = node.typeArguments

        return Object.assign(
          {},
          node,
          {
            range: [
              name.range[0],
              type?.range[1],
            ],
          },
        )
      }

      return name
    }

    type NodeType = Tree.JSXAttribute | Tree.JSXSpreadAttribute | Tree.JSXIdentifier | Tree.JSXMemberExpression | Tree.JSXOpeningElement | Tree.JSXTagNameExpression

    return {
      JSXOpeningElement(node) {
        node.attributes.reduce<NodeType>((prev, prop) => {
          checkSpacing(prev, prop)
          return prop
        }, getGenericNode(node))
      },
    }
  },
})
