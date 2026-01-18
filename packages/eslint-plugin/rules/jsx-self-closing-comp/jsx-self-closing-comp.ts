/**
 * @fileoverview Prevent extra closing tags for components without children
 * @author Yannick Croissant
 */

import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isDOMComponent } from '#utils/ast/jsx'
import { createRule } from '#utils/create-rule'

const optionDefaults = { component: true, html: true }

const messages = {
  notSelfClosing: 'Empty components are self-closing',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-self-closing-comp',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow extra closing tags for components without children',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          component: {
            default: optionDefaults.component,
            type: 'boolean',
          },
          html: {
            default: optionDefaults.html,
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages,
  },
  create(context) {
    function isComponent(node: Tree.JSXOpeningElement) {
      return (
        node.name
        && (node.name.type === 'JSXIdentifier' || node.name.type === 'JSXMemberExpression')
        && !isDOMComponent(node)
      )
    }

    function childrenIsEmpty(node: Tree.JSXOpeningElement) {
      return (<Tree.JSXElement>node.parent).children.length === 0
    }

    function childrenIsMultilineSpaces(node: Tree.JSXOpeningElement) {
      const childrens = (<Tree.JSXElement>node.parent).children

      return (
        childrens.length === 1
        && childrens[0].type === 'JSXText'
        && childrens[0].value.includes('\n')
        && childrens[0].value.replace(/(?!\xA0)\s/g, '') === ''
      )
    }

    function isShouldBeSelfClosed(node: Tree.JSXOpeningElement): node is Tree.JSXOpeningElement {
      const configuration = Object.assign({}, optionDefaults, context.options[0])
      return (
        (configuration.component && isComponent(node))
        || (configuration.html && isDOMComponent(node))
      ) && !node.selfClosing && (childrenIsEmpty(node) || childrenIsMultilineSpaces(node))
    }

    return {
      JSXOpeningElement(node) {
        if (!isShouldBeSelfClosed(node))
          return

        context.report({
          messageId: 'notSelfClosing',
          node,
          fix(fixer) {
            // Represents the last character of the JSXOpeningElement, the '>' character
            const openingElementEnding = node.range[1] - 1
            // Represents the last character of the JSXClosingElement, the '>' character
            const closingElementEnding = (<Tree.JSXElement>node.parent).closingElement?.range[1] ?? NaN

            // Replace />.*<\/.*>/ with '/>'
            const range: [number, number] = [openingElementEnding, closingElementEnding]
            return fixer.replaceTextRange(range, ' />')
          },
        })
      },
    }
  },
})
