import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

// This list is taken from https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements

// Note: 'br' is not included because whitespace around br tags is inconsequential to the rendered output
const INLINE_ELEMENTS = new Set([
  'a',
  'abbr',
  'acronym',
  'b',
  'bdo',
  'big',
  'button',
  'cite',
  'code',
  'dfn',
  'em',
  'i',
  'img',
  'input',
  'kbd',
  'label',
  'map',
  'object',
  'q',
  'samp',
  'script',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'textarea',
  'tt',
  'var',
])

const messages = {
  spacingAfterPrev: 'Ambiguous spacing after previous element {{element}}',
  spacingBeforeNext: 'Ambiguous spacing before next element {{element}}',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-child-element-spacing',
  package: 'jsx',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce or disallow spaces inside of curly braces in JSX attributes and expressions',
    },
    messages,
    schema: [],
  },
  create(context) {
    const TEXT_FOLLOWING_ELEMENT_PATTERN = /^[\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n\s*\S/
    const TEXT_PRECEDING_ELEMENT_PATTERN = /\S[\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n\s*$/

    const elementName = (node: Tree.JSXElement) => (
      node.openingElement
      && node.openingElement.name
      && node.openingElement.name.type === 'JSXIdentifier'
      && node.openingElement.name.name
    ) || ''

    const isInlineElement = (node: ASTNode) => (
      node.type === 'JSXElement'
      && INLINE_ELEMENTS.has(elementName(node))
    )

    const handleJSX = (node: Tree.JSXElement | Tree.JSXFragment) => {
      let lastChild: ASTNode | null = null
      let child: ASTNode | null = null

      ;[...node.children, null].forEach((nextChild) => {
        if (
          (lastChild || nextChild)
          && (!lastChild || isInlineElement(lastChild))
          && (child && (child.type === 'Literal' || child.type === 'JSXText'))
          && (!nextChild || isInlineElement(nextChild))
          && true
        ) {
          if (lastChild && String(child.value).match(TEXT_FOLLOWING_ELEMENT_PATTERN)) {
            context.report({
              messageId: 'spacingAfterPrev',
              node: lastChild,
              loc: lastChild.loc.end,
              data: {
                element: elementName(lastChild as Tree.JSXElement),
              },
            })
          }
          else if (nextChild && String(child.value).match(TEXT_PRECEDING_ELEMENT_PATTERN)) {
            context.report({
              messageId: 'spacingBeforeNext',
              node: nextChild,
              loc: nextChild.loc.start,
              data: {
                element: elementName(nextChild as Tree.JSXElement),
              },
            })
          }
        }
        lastChild = child
        child = nextChild
      })
    }

    return {
      JSXElement: handleJSX,
      JSXFragment: handleJSX,
    }
  },
})
