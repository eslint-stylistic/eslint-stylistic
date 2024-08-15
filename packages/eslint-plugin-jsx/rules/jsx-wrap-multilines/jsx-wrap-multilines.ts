/**
 * @fileoverview Prevent missing parentheses around multilines JSX
 * @author Yannick Croissant
 */

import type { ASTNode, Token } from '@shared/types'
import { isJSX } from '../../../utils/ast/jsx'
import { isParenthesized } from '../../../utils/ast'
import { createRule } from '../../../utils/create-rule'
import type { MessageIds, RuleOptions } from './types'

const DEFAULTS: Required<Exclude<RuleOptions[0], undefined>> = {
  declaration: 'parens',
  assignment: 'parens',
  return: 'parens',
  arrow: 'parens',
  condition: 'ignore',
  logical: 'ignore',
  prop: 'ignore',
  propertyValue: 'ignore',
}

const messages = {
  missingParens: 'Missing parentheses around multilines JSX',
  parensOnNewLines: 'Parentheses around JSX should be on separate lines',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-wrap-multilines',
  package: 'jsx',
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow missing parentheses around multiline JSX',
    },

    fixable: 'code',

    messages,

    schema: [{
      type: 'object',
      // true/false are for backwards compatibility
      properties: {
        declaration: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
        assignment: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
        return: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
        arrow: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
        condition: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
        logical: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
        prop: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
        propertyValue: {
          type: ['string', 'boolean'],
          enum: [true, false, 'ignore', 'parens', 'parens-new-line'],
        },
      },
      additionalProperties: false,
    }],
  },

  create(context) {
    function getOption(type: keyof typeof DEFAULTS) {
      const userOptions = context.options[0] || {}
      if (type in userOptions)
        return userOptions[type]
      return DEFAULTS[type]
    }

    function isEnabled(type: keyof typeof DEFAULTS) {
      const option = getOption(type)
      return option && option !== 'ignore'
    }

    function needsOpeningNewLine(node: ASTNode) {
      const previousToken = context.sourceCode.getTokenBefore(node)!

      if (!isParenthesized(context, node))
        return false

      if (previousToken.loc.end.line === node.loc.start.line)
        return true

      return false
    }

    function needsClosingNewLine(node: ASTNode) {
      const nextToken = context.sourceCode.getTokenAfter(node)!

      if (!isParenthesized(context, node))
        return false

      if (node.loc.end.line === nextToken.loc.end.line)
        return true

      return false
    }

    function isMultilines(node: ASTNode) {
      return node.loc.start.line !== node.loc.end.line
    }

    function trimTokenBeforeNewline(node: ASTNode, tokenBefore: Token) {
      // if the token before the jsx is a bracket or curly brace
      // we don't want a space between the opening parentheses and the multiline jsx
      const isBracket = tokenBefore.value === '{' || tokenBefore.value === '['
      return `${tokenBefore.value.trim()}${isBracket ? '' : ' '}`
    }

    function check(node: ASTNode | null, type: keyof typeof DEFAULTS) {
      if (!node || !isJSX(node))
        return

      const sourceCode = context.sourceCode
      const option = getOption(type)

      if ((option === true || option === 'parens') && !isParenthesized(context, node) && isMultilines(node)) {
        context.report({
          node,
          messageId: 'missingParens',
          fix: fixer => fixer.replaceText(node, `(${sourceCode.getText(node)})`),
        })
      }

      if (option === 'parens-new-line' && isMultilines(node)) {
        if (!isParenthesized(context, node)) {
          const tokenBefore = sourceCode.getTokenBefore(node, { includeComments: true })!
          const tokenAfter = sourceCode.getTokenAfter(node, { includeComments: true })!
          const start = node.loc.start
          if (tokenBefore.loc.end.line < start.line) {
            // Strip newline after operator if parens newline is specified
            context.report({
              node,
              messageId: 'missingParens',
              fix: fixer => fixer.replaceTextRange(
                [
                  tokenBefore.range[0],
                  tokenAfter && (tokenAfter.value === ';' || tokenAfter.value === '}') ? tokenAfter.range[0] : node.range[1],
                ],
                `${trimTokenBeforeNewline(node, tokenBefore)}(\n${start.column > 0 ? ' '.repeat(start.column) : ''}${sourceCode.getText(node)}\n${start.column > 0 ? ' '.repeat(start.column - 2) : ''})`,
              ),
            })
          }
          else {
            context.report({
              node,
              messageId: 'missingParens',
              fix: fixer => fixer.replaceText(node, `(\n${sourceCode.getText(node)}\n)`),
            })
          }
        }
        else {
          const needsOpening = needsOpeningNewLine(node)
          const needsClosing = needsClosingNewLine(node)
          if (needsOpening || needsClosing) {
            context.report({
              node,
              messageId: 'parensOnNewLines',
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
    }

    return {
      VariableDeclarator(node) {
        const type = 'declaration'
        if (!isEnabled(type))
          return

        if (!isEnabled('condition') && node.init && node.init.type === 'ConditionalExpression') {
          check(node.init.consequent, type)
          check(node.init.alternate, type)
          return
        }
        check(node.init, type)
      },

      AssignmentExpression(node) {
        const type = 'assignment'
        if (!isEnabled(type))
          return

        if (!isEnabled('condition') && node.right.type === 'ConditionalExpression') {
          check(node.right.consequent, type)
          check(node.right.alternate, type)
          return
        }
        check(node.right, type)
      },

      ReturnStatement(node) {
        const type = 'return'
        if (isEnabled(type))
          check(node.argument, type)
      },

      'ArrowFunctionExpression:exit': (node) => {
        const arrowBody = node.body
        const type = 'arrow'

        if (isEnabled(type) && arrowBody.type !== 'BlockStatement')
          check(arrowBody, type)
      },

      ConditionalExpression(node) {
        const type = 'condition'
        if (isEnabled(type)) {
          check(node.consequent, type)
          check(node.alternate, type)
        }
      },

      LogicalExpression(node) {
        const type = 'logical'
        if (isEnabled(type))
          check(node.right, type)
      },

      JSXAttribute(node) {
        const type = 'prop'
        if (isEnabled(type) && node.value && node.value.type === 'JSXExpressionContainer')
          check(node.value.expression, type)
      },

      ObjectExpression(node) {
        const type = 'propertyValue'
        if (isEnabled(type)) {
          node.properties.forEach((property) => {
            if (property.type === 'Property' && property.value.type === 'JSXElement')
              check(property.value, type)
          })
        }
      },
    }
  },
})
