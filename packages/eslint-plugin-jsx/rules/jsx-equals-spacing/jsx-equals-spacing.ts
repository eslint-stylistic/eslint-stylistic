/**
 * @fileoverview Disallow or enforce spaces around equal signs in JSX attributes.
 * @author ryym
 */

import { createRule } from '../../utils/createRule'
import { docsUrl } from '../../utils/docsUrl'
import type { Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

const messages = {
  noSpaceBefore: 'There should be no space before \'=\'',
  noSpaceAfter: 'There should be no space after \'=\'',
  needSpaceBefore: 'A space is required before \'=\'',
  needSpaceAfter: 'A space is required after \'=\'',
}

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce or disallow spaces around equal signs in JSX attributes',
      url: docsUrl('jsx-equals-spacing'),
    },
    fixable: 'code',

    messages,

    schema: [{
      type: 'string',
      enum: ['always', 'never'],
    }],
  },

  create(context) {
    const config = context.options[0] || 'never'

    /**
     * Determines a given attribute node has an equal sign.
     * @param {ASTNode} attrNode - The attribute node.
     * @returns {boolean} Whether or not the attriute node has an equal sign.
     */
    function hasEqual(attrNode: Tree.JSXAttribute | Tree.JSXSpreadAttribute): attrNode is Tree.JSXAttribute {
      return attrNode.type !== 'JSXSpreadAttribute' && attrNode.value !== null
    }

    return {
      JSXOpeningElement(node) {
        node.attributes.forEach((attrNode) => {
          if (!hasEqual(attrNode))
            return

          const sourceCode = context.sourceCode
          const equalToken = sourceCode.getTokenAfter(attrNode.name)!
          const spacedBefore = sourceCode.isSpaceBetween?.(attrNode.name, equalToken)
          const spacedAfter = sourceCode.isSpaceBetween?.(equalToken, attrNode.value!)

          if (config === 'never') {
            if (spacedBefore) {
              context.report({
                messageId: 'noSpaceBefore',
                node: attrNode,
                loc: equalToken.loc.start,
                fix(fixer) {
                  return fixer.removeRange([attrNode.name.range[1], equalToken.range[0]])
                },
              })
            }
            if (spacedAfter) {
              context.report({
                messageId: 'noSpaceAfter',
                node: attrNode,
                loc: equalToken.loc.start,
                fix(fixer) {
                  return fixer.removeRange([equalToken.range[1], attrNode.value!.range[0]])
                },
              })
            }
          }
          else if (config === 'always') {
            if (!spacedBefore) {
              context.report({
                messageId: 'needSpaceBefore',
                node: attrNode,
                loc: equalToken.loc.start,
                fix(fixer) {
                  return fixer.insertTextBefore(equalToken, ' ')
                },
              })
            }
            if (!spacedAfter) {
              context.report({
                messageId: 'needSpaceAfter',
                node: attrNode,
                loc: equalToken.loc.start,
                fix(fixer) {
                  return fixer.insertTextAfter(equalToken, ' ')
                },
              })
            }
          }
        })
      },
    }
  },
})
