/**
 * @fileoverview Enforce line breaks before and after JSX elements when they are used as arguments to a function
 * @author Riri
 */

import type { ASTNode, RuleContext, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isTokenOnSameLine } from '#utils/ast'
import { isJSX } from '#utils/ast/jsx'
import { createRule } from '#utils/create-rule'

const messages = {
  missingLineBreak: 'Missing line break around JSX',
}

function endWithComma(context: RuleContext<any, any>, node: ASTNode) {
  const sourceCode = context.sourceCode
  const nextToken = sourceCode.getTokenAfter(node)

  return !!nextToken
    && nextToken.value === ',' && nextToken.range[0] >= node.range![1]
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-function-call-newline',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce line breaks before and after JSX elements when they are used as arguments to a function.',
    },

    fixable: 'whitespace',

    messages,

    schema: [{
      type: 'string',
      enum: ['always', 'multiline'],
    }],
  },

  create(context) {
    const option = context.options[0] || 'multiline'

    function needsOpeningNewLine(node: ASTNode) {
      const previousToken = context.sourceCode.getTokenBefore(node)!

      if (isTokenOnSameLine(previousToken, node))
        return true

      return false
    }

    function needsClosingNewLine(node: ASTNode) {
      const nextToken = context.sourceCode.getTokenAfter(node)!

      if (endWithComma(context, node))
        return false

      if (node.loc.end.line === nextToken.loc.end.line)
        return true

      return false
    }

    function isMultilines(node: ASTNode) {
      return node.loc.start.line !== node.loc.end.line
    }

    function check(node: ASTNode | null) {
      if (!node || !isJSX(node))
        return

      const sourceCode = context.sourceCode

      if (option === 'always' || isMultilines(node)) {
        const needsOpening = needsOpeningNewLine(node)
        const needsClosing = needsClosingNewLine(node)
        if (needsOpening || needsClosing) {
          context.report({
            node,
            messageId: 'missingLineBreak',
            fix: (fixer) => {
              const text = sourceCode.getText(node)
              let fixed = text
              if (needsOpening)
                fixed = `\n${fixed}`

              if (needsClosing)
                fixed = `${fixed}\n`

              return fixer.replaceText(node, fixed)
            },
          })
        }
      }
    }

    function handleCallExpression(node: Tree.CallExpression | Tree.NewExpression) {
      if (node.arguments.length === 0)
        return

      node.arguments.forEach(check)
    }

    return {
      CallExpression(node) {
        handleCallExpression(node)
      },
      NewExpression(node) {
        handleCallExpression(node)
      },
    }
  },
})
