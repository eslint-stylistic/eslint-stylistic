import type { ASTNode, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isParenthesized, isSingleLine, isTokenOnSameLine } from '#utils/ast'
import { isJSX } from '#utils/ast/jsx'
import { createRule } from '#utils/create-rule'

type Type = keyof Exclude<RuleOptions[0], undefined>

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-wrap-multilines',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow missing parentheses around multiline JSX',
    },
    fixable: 'code',
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
    messages: {
      missingParens: 'Missing parentheses around multilines JSX',
      parensOnNewLines: 'Parentheses around JSX should be on separate lines',
    },
  },
  defaultOptions: [
    {
      declaration: 'parens',
      assignment: 'parens',
      return: 'parens',
      arrow: 'parens',
      condition: 'ignore',
      logical: 'ignore',
      prop: 'ignore',
      propertyValue: 'ignore',
    },
  ],
  create(context, [options]) {
    function isEnabled(type: Type) {
      const option = options![type]
      return option && option !== 'ignore'
    }

    const { sourceCode } = context

    function needsOpeningNewLine(node: ASTNode) {
      const previousToken = sourceCode.getTokenBefore(node)!

      if (!isParenthesized(node, sourceCode))
        return false

      if (isTokenOnSameLine(previousToken, node))
        return true

      return false
    }

    function needsClosingNewLine(node: ASTNode) {
      const nextToken = sourceCode.getTokenAfter(node)!

      if (!isParenthesized(node, sourceCode))
        return false

      if (isTokenOnSameLine(node, nextToken))
        return true

      return false
    }

    function trimTokenBeforeNewline(tokenBefore: Token) {
      // if the token before the jsx is a bracket or curly brace
      // we don't want a space between the opening parentheses and the multiline jsx
      const isBracket = tokenBefore.value === '{' || tokenBefore.value === '['
      return `${tokenBefore.value.trim()}${isBracket ? '' : ' '}`
    }

    function check(node: ASTNode | null, type: Type) {
      if (!node || !isJSX(node))
        return

      const option = options![type]

      if ((option === true || option === 'parens') && !isParenthesized(node, sourceCode) && !isSingleLine(node)) {
        context.report({
          node,
          messageId: 'missingParens',
          fix: fixer => fixer.replaceText(node, `(${sourceCode.getText(node)})`),
        })
      }

      if (option === 'parens-new-line' && !isSingleLine(node)) {
        if (!isParenthesized(node, sourceCode)) {
          const tokenBefore = sourceCode.getTokenBefore(node)!
          const tokenAfter = sourceCode.getTokenAfter(node)!
          const start = node.loc.start
          if (tokenBefore.loc.end.line < start.line) {
            const textBefore = sourceCode.getText().slice(tokenBefore.range[1], node.range[0]).trim()
            const isTab = /^\t/.test(sourceCode.lines[start.line - 1])
            const INDENT = isTab ? '\t' : ' '
            const indentBefore = INDENT.repeat(start.column)
            const indentAfter = INDENT.repeat(Math.max(0, start.column - (isTab ? 1 : 2)))
            // Strip newline after operator if parens newline is specified
            context.report({
              node,
              messageId: 'missingParens',
              fix: fixer => fixer.replaceTextRange(
                [
                  tokenBefore.range[0],
                  tokenAfter && (tokenAfter.value === ';' || tokenAfter.value === '}') ? tokenAfter.range[0] : node.range[1],
                ],
                `${trimTokenBeforeNewline(tokenBefore)}(\n${indentBefore}${textBefore}${textBefore.length > 0 ? `\n${indentBefore}` : ''}${sourceCode.getText(node)}\n${indentAfter})`,
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

        if (!isEnabled('condition') && node.init?.type === 'ConditionalExpression') {
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
        if (isEnabled(type) && node.value?.type === 'JSXExpressionContainer')
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
