/**
 * @fileoverview Disallows or enforces spaces inside of array brackets.
 * @author Jamund Ferguson
 */

import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'array-bracket-spacing',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent spacing inside array brackets',
    },

    fixable: 'whitespace',

    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
      {
        type: 'object',
        properties: {
          singleValue: {
            type: 'boolean',
          },
          objectsInArrays: {
            type: 'boolean',
          },
          arraysInArrays: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      unexpectedSpaceAfter: 'There should be no space after \'{{tokenValue}}\'.',
      unexpectedSpaceBefore: 'There should be no space before \'{{tokenValue}}\'.',
      missingSpaceAfter: 'A space is required after \'{{tokenValue}}\'.',
      missingSpaceBefore: 'A space is required before \'{{tokenValue}}\'.',
    },
  },
  create(context) {
    const spaced = context.options[0] === 'always'
    const sourceCode = context.sourceCode

    /**
     * Determines whether an option is set, relative to the spacing option.
     * If spaced is "always", then check whether option is set to false.
     * If spaced is "never", then check whether option is set to true.
     * @param option The option to exclude.
     * @returns Whether or not the property is excluded.
     */
    function isOptionSet(option: keyof NonNullable<RuleOptions[1]>) {
      return context.options[1] ? context.options[1][option] === !spaced : false
    }

    const options = {
      spaced,
      singleElementException: isOptionSet('singleValue'),
      objectsInArraysException: isOptionSet('objectsInArrays'),
      arraysInArraysException: isOptionSet('arraysInArrays'),
    }

    /**
     * Reports that there shouldn't be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoBeginningSpace(node: ASTNode, token: Token) {
      const nextToken = sourceCode.getTokenAfter(token)!

      context.report({
        node,
        loc: { start: token.loc.end, end: nextToken.loc.start },
        messageId: 'unexpectedSpaceAfter',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([token.range[1], nextToken.range[0]])
        },
      })
    }

    /**
     * Reports that there shouldn't be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoEndingSpace(node: ASTNode, token: Token) {
      const previousToken = sourceCode.getTokenBefore(token)!

      context.report({
        node,
        loc: { start: previousToken.loc.end, end: token.loc.start },
        messageId: 'unexpectedSpaceBefore',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([previousToken.range[1], token.range[0]])
        },
      })
    }

    /**
     * Reports that there should be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredBeginningSpace(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: 'missingSpaceAfter',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.insertTextAfter(token, ' ')
        },
      })
    }

    /**
     * Reports that there should be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredEndingSpace(node: ASTNode, token: Token) {
      context.report({
        node,
        loc: token.loc,
        messageId: 'missingSpaceBefore',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.insertTextBefore(token, ' ')
        },
      })
    }

    /**
     * Determines if a node is an object type
     * @param node The node to check.
     * @returns Whether or not the node is an object type.
     */
    function isObjectType(node: ASTNode) {
      return node && (node.type === 'ObjectExpression' || node.type === 'ObjectPattern')
    }

    /**
     * Determines if a node is an array type
     * @param node The node to check.
     * @returns Whether or not the node is an array type.
     */
    function isArrayType(node: ASTNode) {
      return node && (node.type === 'ArrayExpression' || node.type === 'ArrayPattern')
    }

    /**
     * Validates the spacing around array brackets
     * @param node The node we're checking for spacing
     */
    function validateArraySpacing(node: Tree.ArrayPattern | Tree.ArrayExpression) {
      if (options.spaced && node.elements.length === 0)
        return

      const first = sourceCode.getFirstToken(node)!
      const second = sourceCode.getFirstToken(node, 1)!
      const last = node.type === 'ArrayPattern' && node.typeAnnotation
        ? sourceCode.getTokenBefore(node.typeAnnotation)!
        : sourceCode.getLastToken(node)!
      const penultimate = sourceCode.getTokenBefore(last)!
      const firstElement = node.elements[0]
      const lastElement = node.elements[node.elements.length - 1]

      const openingBracketMustBeSpaced
                = firstElement && options.objectsInArraysException && isObjectType(firstElement)
                  || firstElement && options.arraysInArraysException && isArrayType(firstElement)
                  || options.singleElementException && node.elements.length === 1
                  ? !options.spaced : options.spaced

      const closingBracketMustBeSpaced
                = lastElement && options.objectsInArraysException && isObjectType(lastElement)
                  || lastElement && options.arraysInArraysException && isArrayType(lastElement)
                  || options.singleElementException && node.elements.length === 1
                  ? !options.spaced : options.spaced

      if (isTokenOnSameLine(first, second)) {
        if (openingBracketMustBeSpaced && !sourceCode.isSpaceBetween(first, second))
          reportRequiredBeginningSpace(node, first)

        if (!openingBracketMustBeSpaced && sourceCode.isSpaceBetween(first, second))
          reportNoBeginningSpace(node, first)
      }

      if (first !== penultimate && isTokenOnSameLine(penultimate, last)) {
        if (closingBracketMustBeSpaced && !sourceCode.isSpaceBetween(penultimate, last))
          reportRequiredEndingSpace(node, last)

        if (!closingBracketMustBeSpaced && sourceCode.isSpaceBetween(penultimate, last))
          reportNoEndingSpace(node, last)
      }
    }

    return {
      ArrayPattern: validateArraySpacing,
      ArrayExpression: validateArraySpacing,
    }
  },
})
