/**
 * @fileoverview Comma style - enforces comma styles of two types: last and first
 * @author Vignesh Anand aka vegetableman
 */

import type { ASTNode, NodeTypes, RuleFixer, RuleListener, Token, Tree } from '@shared/types'
import { LINEBREAK_MATCHER, isCommaToken, isNotClosingParenToken, isTokenOnSameLine } from '../../utils/ast-utils'
import { createRule } from '../../../utils'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  name: 'comma-style',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent comma style',
    },

    fixable: 'code',

    schema: [
      {
        type: 'string',
        enum: ['first', 'last'],
      },
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'object',
            additionalProperties: {
              type: 'boolean',
            },
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      unexpectedLineBeforeAndAfterComma: 'Bad line breaking before and after \',\'.',
      expectedCommaFirst: '\',\' should be placed first.',
      expectedCommaLast: '\',\' should be placed last.',
    },
  },

  create(context) {
    const style = context.options[0] || 'last'
    const sourceCode = context.sourceCode
    const exceptions = {
      ArrayPattern: true,
      ArrowFunctionExpression: true,
      CallExpression: true,
      FunctionDeclaration: true,
      FunctionExpression: true,
      ImportDeclaration: true,
      ObjectPattern: true,
      NewExpression: true,
    } as Record<NodeTypes, boolean>

    if (context.options.length === 2 && Object.prototype.hasOwnProperty.call(context.options[1], 'exceptions')) {
      context.options[1] ??= { exceptions: {} }
      const rawExceptions = context.options[1].exceptions!
      const keys = Object.keys(rawExceptions)

      for (let i = 0; i < keys.length; i++)
        exceptions[keys[i] as keyof typeof exceptions] = rawExceptions[keys[i]]
    }

    /**
     * Modified text based on the style
     * @param styleType Style type
     * @param text Source code text
     * @returns modified text
     * @private
     */
    function getReplacedText(styleType: string, text: string): string {
      switch (styleType) {
        case 'between':
          return `,${text.replace(LINEBREAK_MATCHER, '')}`

        case 'first':
          return `${text},`

        case 'last':
          return `,${text}`

        default:
          return ''
      }
    }

    /**
     * Determines the fixer function for a given style.
     * @param styleType comma style
     * @param previousItemToken The token to check.
     * @param commaToken The token to check.
     * @param currentItemToken The token to check.
     * @returns Fixer function
     * @private
     */
    function getFixerFunction(styleType: string, previousItemToken: Token, commaToken: Token, currentItemToken: Token) {
      const text
                = sourceCode.text.slice(previousItemToken.range[1], commaToken.range[0])
                + sourceCode.text.slice(commaToken.range[1], currentItemToken.range[0])
      const range = [previousItemToken.range[1], currentItemToken.range[0]] as const

      return function (fixer: RuleFixer) {
        return fixer.replaceTextRange(range, getReplacedText(styleType, text))
      }
    }

    /**
     * Validates the spacing around single items in lists.
     * @param previousItemToken The last token from the previous item.
     * @param commaToken The token representing the comma.
     * @param currentItemToken The first token of the current item.
     * @param reportItem The item to use when reporting an error.
     * @private
     */
    function validateCommaItemSpacing(previousItemToken: Token, commaToken: Token, currentItemToken: Token, reportItem: Token): void {
      // if single line
      if (isTokenOnSameLine(commaToken, currentItemToken)
        && isTokenOnSameLine(previousItemToken, commaToken)) {

        // do nothing.

      }
      else if (!isTokenOnSameLine(commaToken, currentItemToken)
        && !isTokenOnSameLine(previousItemToken, commaToken)) {
        const comment = sourceCode.getCommentsAfter(commaToken)[0]
        const styleType = comment && comment.type === 'Block' && isTokenOnSameLine(commaToken, comment)
          ? style
          : 'between'

        // lone comma
        context.report({
          node: reportItem,
          loc: commaToken.loc,
          messageId: 'unexpectedLineBeforeAndAfterComma',
          fix: getFixerFunction(styleType, previousItemToken, commaToken, currentItemToken),
        })
      }
      else if (style === 'first' && !isTokenOnSameLine(commaToken, currentItemToken)) {
        context.report({
          node: reportItem,
          loc: commaToken.loc,
          messageId: 'expectedCommaFirst',
          fix: getFixerFunction(style, previousItemToken, commaToken, currentItemToken),
        })
      }
      else if (style === 'last' && isTokenOnSameLine(commaToken, currentItemToken)) {
        context.report({
          node: reportItem,
          loc: commaToken.loc,
          messageId: 'expectedCommaLast',
          fix: getFixerFunction(style, previousItemToken, commaToken, currentItemToken),
        })
      }
    }

    /**
     * Checks the comma placement with regards to a declaration/property/element
     * @param node The binary expression node to check
     * @param property The property of the node containing child nodes.
     * @private
     */
    function validateComma<T extends NodeType, const K extends keyof T>(node: T, property: K): void {
      const items = node[property] as (Tree.Token | ASTNode)[]
      const arrayLiteral = (node.type === 'ArrayExpression' || node.type === 'ArrayPattern')

      if (items.length > 1 || arrayLiteral) {
        // seed as opening [
        let previousItemToken = sourceCode.getFirstToken(node)!

        items.forEach((item) => {
          const commaToken = item ? sourceCode.getTokenBefore(item)! : previousItemToken
          const currentItemToken = item ? sourceCode.getFirstToken(item as ASTNode)! : sourceCode.getTokenAfter(commaToken)!
          const reportItem = item || currentItemToken

          /**
           * This works by comparing three token locations:
           * - previousItemToken is the last token of the previous item
           * - commaToken is the location of the comma before the current item
           * - currentItemToken is the first token of the current item
           *
           * These values get switched around if item is undefined.
           * previousItemToken will refer to the last token not belonging
           * to the current item, which could be a comma or an opening
           * square bracket. currentItemToken could be a comma.
           *
           * All comparisons are done based on these tokens directly, so
           * they are always valid regardless of an undefined item.
           */
          if (isCommaToken(commaToken))
            validateCommaItemSpacing(previousItemToken, commaToken, currentItemToken!, reportItem as Tree.Token)

          if (item) {
            const tokenAfterItem = sourceCode.getTokenAfter(item, isNotClosingParenToken)

            previousItemToken = tokenAfterItem
              ? sourceCode.getTokenBefore(tokenAfterItem)!
              : sourceCode.ast.tokens[sourceCode.ast.tokens.length - 1] as ReturnType<typeof sourceCode.getLastToken>
          }
          else {
            previousItemToken = currentItemToken
          }
        })

        /**
         * Special case for array literals that have empty last items, such
         * as [ 1, 2, ]. These arrays only have two items show up in the
         * AST, so we need to look at the token to verify that there's no
         * dangling comma.
         */
        if (arrayLiteral) {
          const lastToken = sourceCode.getLastToken(node)!
          const nextToLastToken = sourceCode.getTokenBefore(lastToken)!

          if (isCommaToken(nextToLastToken)) {
            validateCommaItemSpacing(
              sourceCode.getTokenBefore(nextToLastToken)!,
              nextToLastToken,
              lastToken,
              lastToken,
            )
          }
        }
      }
    }

    type NodeType =
      | Tree.VariableDeclaration
      | Tree.ArrayExpression
      | Tree.ObjectExpression
      | Tree.ObjectPattern
      | Tree.ArrayPattern
      | Tree.FunctionDeclaration
      | Tree.FunctionExpression
      | Tree.CallExpression
      | Tree.ImportDeclaration
      | Tree.NewExpression
      | Tree.ArrowFunctionExpression

    const nodes: RuleListener = {}

    if (!exceptions.VariableDeclaration) {
      nodes.VariableDeclaration = function (node) {
        validateComma(node, 'declarations')
      }
    }
    if (!exceptions.ObjectExpression) {
      nodes.ObjectExpression = function (node) {
        validateComma(node, 'properties')
      }
    }
    if (!exceptions.ObjectPattern) {
      nodes.ObjectPattern = function (node) {
        validateComma(node, 'properties')
      }
    }
    if (!exceptions.ArrayExpression) {
      nodes.ArrayExpression = function (node) {
        validateComma(node, 'elements')
      }
    }
    if (!exceptions.ArrayPattern) {
      nodes.ArrayPattern = function (node) {
        validateComma(node, 'elements')
      }
    }
    if (!exceptions.FunctionDeclaration) {
      nodes.FunctionDeclaration = function (node) {
        validateComma(node, 'params')
      }
    }
    if (!exceptions.FunctionExpression) {
      nodes.FunctionExpression = function (node) {
        validateComma(node, 'params')
      }
    }
    if (!exceptions.ArrowFunctionExpression) {
      nodes.ArrowFunctionExpression = function (node) {
        validateComma(node, 'params')
      }
    }
    if (!exceptions.CallExpression) {
      nodes.CallExpression = function (node) {
        validateComma(node, 'arguments')
      }
    }
    if (!exceptions.ImportDeclaration) {
      nodes.ImportDeclaration = function (node) {
        validateComma(node, 'specifiers')
      }
    }
    if (!exceptions.NewExpression) {
      nodes.NewExpression = function (node) {
        validateComma(node, 'arguments')
      }
    }

    return nodes
  },
})
