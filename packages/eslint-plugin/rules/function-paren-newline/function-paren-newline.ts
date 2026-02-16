/**
 * @fileoverview enforce consistent line breaks inside function parentheses
 * @author Teddy Katz
 */

import type { Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isClosingParenToken, isFunction, isOpeningParenToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { safeReplaceTextBetween } from '#utils/fix'

interface ParensPair {
  leftParen: Token
  rightParen: Token
}

export default createRule<RuleOptions, MessageIds>({
  name: 'function-paren-newline',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent line breaks inside function parentheses',
    },
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['always', 'never', 'consistent', 'multiline', 'multiline-arguments'],
          },
          {
            type: 'object',
            properties: {
              minItems: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    defaultOptions: ['multiline'],
    messages: {
      expectedBefore: 'Expected newline before \')\'.',
      expectedAfter: 'Expected newline after \'(\'.',
      expectedBetween: 'Expected newline between arguments/params.',
      unexpectedBefore: 'Unexpected newline before \')\'.',
      unexpectedAfter: 'Unexpected newline after \'(\'.',
    },
  },
  create(context, [rawOption]) {
    const sourceCode = context.sourceCode
    const multilineOption = rawOption === 'multiline'
    const multilineArgumentsOption = rawOption === 'multiline-arguments'
    const consistentOption = rawOption === 'consistent'
    let minItems: number | undefined

    if (typeof rawOption === 'object')
      minItems = rawOption.minItems
    else if (rawOption === 'always')
      minItems = 0
    else if (rawOption === 'never')
      minItems = Infinity

    /**
     * Determines whether there should be newlines inside function parens
     * @param elements The arguments or parameters in the list
     * @param hasLeftNewline `true` if the left paren has a newline in the current code.
     * @returns `true` if there should be newlines inside the function parens
     */
    function shouldHaveNewlines(elements: Tree.CallExpressionArgument[] | Tree.Parameter[], hasLeftNewline: boolean) {
      if (multilineArgumentsOption && elements.length === 1)
        return hasLeftNewline

      if (multilineOption || multilineArgumentsOption)
        return elements.some((element, index) => index !== elements.length - 1 && !isTokenOnSameLine(element, elements[index + 1]))

      if (consistentOption)
        return hasLeftNewline

      return minItems == null || elements.length >= minItems
    }

    /**
     * Validates parens
     * @param parens An object with keys `leftParen` for the left paren token, and `rightParen` for the right paren token
     * @param elements The arguments or parameters in the list
     */
    function validateParens(parens: ParensPair, elements: Tree.CallExpressionArgument[] | Tree.Parameter[]) {
      const leftParen = parens.leftParen
      const rightParen = parens.rightParen
      const tokenAfterLeftParen = sourceCode.getTokenAfter(leftParen)!
      const tokenBeforeRightParen = sourceCode.getTokenBefore(rightParen)!
      const hasLeftNewline = !isTokenOnSameLine(leftParen, tokenAfterLeftParen)
      const hasRightNewline = !isTokenOnSameLine(tokenBeforeRightParen, rightParen)
      const needsNewlines = shouldHaveNewlines(elements, hasLeftNewline)

      if (hasLeftNewline && !needsNewlines) {
        context.report({
          node: leftParen,
          messageId: 'unexpectedAfter',
          fix: safeReplaceTextBetween(sourceCode, leftParen, tokenAfterLeftParen, ''),
        })
      }
      else if (!hasLeftNewline && needsNewlines) {
        context.report({
          node: leftParen,
          messageId: 'expectedAfter',
          fix: fixer => fixer.insertTextAfter(leftParen, '\n'),
        })
      }

      if (hasRightNewline && !needsNewlines) {
        context.report({
          node: rightParen,
          messageId: 'unexpectedBefore',
          fix: safeReplaceTextBetween(sourceCode, tokenBeforeRightParen, rightParen, ''),
        })
      }
      else if (!hasRightNewline && needsNewlines) {
        context.report({
          node: rightParen,
          messageId: 'expectedBefore',
          fix: fixer => fixer.insertTextBefore(rightParen, '\n'),
        })
      }
    }

    /**
     * Validates a list of arguments or parameters
     * @param parens An object with keys `leftParen` for the left paren token, and `rightParen` for the right paren token
     * @param elements The arguments or parameters in the list
     */
    function validateArguments(parens: ParensPair, elements: Tree.CallExpressionArgument[] | Tree.Parameter[]) {
      const leftParen = parens.leftParen
      const tokenAfterLeftParen = sourceCode.getTokenAfter(leftParen)!
      const hasLeftNewline = !isTokenOnSameLine(leftParen, tokenAfterLeftParen)
      const needsNewlines = shouldHaveNewlines(elements, hasLeftNewline)

      for (let i = 0; i <= elements.length - 2; i++) {
        const currentElement = elements[i]
        const nextElement = elements[i + 1]
        const hasNewLine = !isTokenOnSameLine(currentElement, nextElement)

        if (!hasNewLine && needsNewlines) {
          context.report({
            node: currentElement,
            messageId: 'expectedBetween',
            fix: fixer => fixer.insertTextBefore(nextElement, '\n'),
          })
        }
      }
    }

    /**
     * Gets the left paren and right paren tokens of a node.
     * @param node The node with parens
     * @throws {TypeError} Unexpected node type.
     * @returns An object with keys `leftParen` for the left paren token, and `rightParen` for the right paren token.
     * Can also return `null` if an expression has no parens (e.g. a NewExpression with no arguments, or an ArrowFunctionExpression
     * with a single parameter)
     */
    function getParenTokens(
      node:
        | Tree.ArrowFunctionExpression
        | Tree.CallExpression
        | Tree.FunctionDeclaration
        | Tree.FunctionExpression
        | Tree.ImportExpression
        | Tree.NewExpression,
    ): ParensPair | null {
      const isOpeningParenTokenOutsideTypeParameter = () => {
        let typeParameterOpeningLevel = 0

        return (token: Token) => {
          if (token.type === 'Punctuator' && token.value === '<')
            typeParameterOpeningLevel += 1

          if (token.type === 'Punctuator' && token.value === '>')
            typeParameterOpeningLevel -= 1

          return typeParameterOpeningLevel !== 0 ? false : isOpeningParenToken(token)
        }
      }

      switch (node.type) {
        case 'NewExpression':
          if (!node.arguments.length
            && !(
              isOpeningParenToken(sourceCode.getLastToken(node, { skip: 1 })!)
              && isClosingParenToken(sourceCode.getLastToken(node)!)
              && node.callee.range[1] < node.range[1]
            )) {
            // If the NewExpression does not have parens (e.g. `new Foo`), return null.
            return null
          }

          // falls through

        case 'CallExpression':
          return {
            leftParen: sourceCode.getTokenAfter(node.callee, isOpeningParenTokenOutsideTypeParameter())!,
            rightParen: sourceCode.getLastToken(node)!,
          }

        case 'FunctionDeclaration':
        case 'FunctionExpression': {
          const leftParen = sourceCode.getFirstToken(node, isOpeningParenTokenOutsideTypeParameter())!
          const rightParen = node.params.length
            ? sourceCode.getTokenAfter(node.params[node.params.length - 1], isClosingParenToken)!
            : sourceCode.getTokenAfter(leftParen)!

          return { leftParen, rightParen }
        }

        case 'ArrowFunctionExpression': {
          const firstToken = sourceCode.getFirstToken(node, { skip: (node.async ? 1 : 0) })!

          if (!isOpeningParenToken(firstToken)) {
            // If the ArrowFunctionExpression has a single param without parens, return null.
            return null
          }

          const rightParen = node.params.length
            ? sourceCode.getTokenAfter(node.params[node.params.length - 1], isClosingParenToken)!
            : sourceCode.getTokenAfter(firstToken)!

          return {
            leftParen: firstToken,
            rightParen,
          }
        }

        case 'ImportExpression': {
          const leftParen = sourceCode.getFirstToken(node, 1)!
          const rightParen = sourceCode.getLastToken(node)!

          return { leftParen, rightParen }
        }

        default:
          throw new TypeError(`unexpected node with type ${node.type}`)
      }
    }

    return {
      [[
        'ArrowFunctionExpression',
        'CallExpression',
        'FunctionDeclaration',
        'FunctionExpression',
        'ImportExpression',
        'NewExpression',
      ].join(', ')](
        node:
          | Tree.ArrowFunctionExpression
          | Tree.CallExpression
          | Tree.FunctionDeclaration
          | Tree.FunctionExpression
          | Tree.ImportExpression
          | Tree.NewExpression,
      ) {
        const parens = getParenTokens(node)
        let params

        if (node.type === 'ImportExpression')
          params = [node.source, ...node.options ? [node.options] : []]
        else if (isFunction(node))
          params = node.params
        else
          params = node.arguments

        if (parens) {
          validateParens(parens, params)

          if (multilineArgumentsOption)
            validateArguments(parens, params)
        }
      },
    }
  },
})
