/**
 * @fileoverview Require or prevent a new line after jsx elements and expressions.
 * @author Johnny Zabala
 * @author Joseph Stiles
 */

import { createRule } from '../../utils/createRule'
import { docsUrl } from '../../utils/docsUrl'
import type { ASTNode, Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

function normalizeOptions(options: RuleOptions[0]) {
  return {
    allowMultilines: options?.allowMultilines ?? false,
    prevent: options?.allowMultilines && typeof options?.prevent === 'undefined' ? true : options?.prevent ?? false,
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const messages = {
  require: 'JSX element should start in a new line',
  prevent: 'JSX element should not start in a new line',
  allowMultilines: 'Multiline JSX elements should start in a new line',
}

function isMultilined(node: ASTNode | undefined) {
  return node && node.loc.start.line !== node.loc.end.line
}

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Require or prevent a new line after jsx elements and expressions.',
      recommended: 'stylistic',
      url: docsUrl('jsx-newline'),
    },
    fixable: 'code',

    messages,
    schema: [
      {
        type: 'object',
        properties: {
          prevent: {
            default: false,
            type: 'boolean',
          },
          allowMultilines: {
            default: false,
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const jsxElementParents = new Set<Tree.JSXElement>()
    const sourceCode = context.sourceCode

    function isBlockCommentInCurlyBraces(element: ASTNode) {
      const elementRawValue = sourceCode.getText(element)
      return /^\s*{\/\*/.test(elementRawValue)
    }

    function isNonBlockComment(element: ASTNode) {
      return !isBlockCommentInCurlyBraces(element) && (element.type === 'JSXElement' || element.type === 'JSXExpressionContainer')
    }

    return {
      'Program:exit': function () {
        jsxElementParents.forEach((parent) => {
          parent.children.forEach((element, index, elements) => {
            if (element.type === 'JSXElement' || element.type === 'JSXExpressionContainer') {
              const configuration = normalizeOptions(context.options[0] || {})
              const prevent = configuration.prevent || false
              const allowMultilines = configuration.allowMultilines || false

              const firstAdjacentSibling = elements[index + 1]
              const secondAdjacentSibling = elements[index + 2]

              const hasSibling = firstAdjacentSibling
                && secondAdjacentSibling
                // @ts-expect-error maybe `ASTNode`
                && (firstAdjacentSibling.type === 'Literal' || firstAdjacentSibling.type === 'JSXText')

              if (!hasSibling)
                return

              // Check adjacent sibling has the proper amount of newlines
              const isWithoutNewLine = !/\n\s*\n/.test(firstAdjacentSibling.value)

              if (isBlockCommentInCurlyBraces(element))
                return
              if (
                allowMultilines
                && (
                  isMultilined(element)
                  || isMultilined(elements.slice(index + 2).find(isNonBlockComment))
                )
              ) {
                if (!isWithoutNewLine)
                  return

                const regex = /(\n)(?!.*\1)/g
                const replacement = '\n\n'
                const messageId = 'allowMultilines'

                context.report({
                  messageId,
                  node: secondAdjacentSibling,
                  fix(fixer) {
                    return fixer.replaceText(
                      firstAdjacentSibling,
                      sourceCode.getText(firstAdjacentSibling)
                        .replace(regex, replacement),
                    )
                  },
                })

                return
              }

              if (isWithoutNewLine === prevent)
                return

              const messageId = prevent
                ? 'prevent'
                : 'require'

              const regex = prevent
                ? /(\n\n)(?!.*\1)/g
                : /(\n)(?!.*\1)/g

              const replacement = prevent
                ? '\n'
                : '\n\n'

              context.report({
                messageId,
                node: secondAdjacentSibling,
                fix(fixer) {
                  return fixer.replaceText(
                    firstAdjacentSibling,
                    sourceCode.getText(firstAdjacentSibling)
                      .replace(regex, replacement),
                  )
                },
              })
            }
          })
        })
      },
      ':matches(JSXElement, JSXFragment) > :matches(JSXElement, JSXExpressionContainer)': (node: Tree.JSXElement) => {
        jsxElementParents.add(<Tree.JSXElement>node.parent)
      },
    }
  },
})
