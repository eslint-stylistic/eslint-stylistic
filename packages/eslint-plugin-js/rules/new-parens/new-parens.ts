/**
 * @fileoverview Rule to flag when using constructor without parentheses
 * @author Ilya Volodin
 */

import { isClosingParenToken, isOpeningParenToken } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'

export default createRule({
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce or disallow parentheses when invoking a constructor with no arguments',
      url: 'https://eslint.style/rules/js/new-parens',
    },

    fixable: 'code',
    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
    ],
    messages: {
      missing: 'Missing \'()\' invoking a constructor.',
      unnecessary: 'Unnecessary \'()\' invoking a constructor with no arguments.',
    },
  },

  create(context) {
    const options = context.options
    const always = options[0] !== 'never' // Default is always

    const sourceCode = context.sourceCode

    return {
      NewExpression(node) {
        if (node.arguments.length !== 0)
          return // if there are arguments, there have to be parens

        const lastToken = sourceCode.getLastToken(node)!
        const hasLastParen = lastToken && isClosingParenToken(lastToken)
        const tokenBeforeLastToken = sourceCode.getTokenBefore(lastToken)!

        // `hasParens` is true only if the new expression ends with its own parens, e.g., new new foo() does not end with its own parens
        const hasParens = hasLastParen
          && isOpeningParenToken(tokenBeforeLastToken)
          && node.callee.range[1] < node.range[1]

        if (always) {
          if (!hasParens) {
            context.report({
              node,
              messageId: 'missing',
              fix: fixer => fixer.insertTextAfter(node, '()'),
            })
          }
        }
        else {
          if (hasParens) {
            context.report({
              node,
              messageId: 'unnecessary',
              fix: fixer => [
                fixer.remove(tokenBeforeLastToken),
                fixer.remove(lastToken),
                fixer.insertTextBefore(node, '('),
                fixer.insertTextAfter(node, ')'),
              ],
            })
          }
        }
      },
    }
  },
})
