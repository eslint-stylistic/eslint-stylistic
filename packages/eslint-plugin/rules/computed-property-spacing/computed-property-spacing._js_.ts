/**
 * @fileoverview Disallows or enforces spaces inside computed properties.
 * @author Jamund Ferguson
 */

import type { ASTNode, RuleListener, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isClosingBracketToken, isOpeningBracketToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'computed-property-spacing',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent spacing inside computed property brackets',
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
          enforceForClassMembers: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      unexpectedSpaceBefore: 'There should be no space before \'{{tokenValue}}\'.',
      unexpectedSpaceAfter: 'There should be no space after \'{{tokenValue}}\'.',

      missingSpaceBefore: 'A space is required before \'{{tokenValue}}\'.',
      missingSpaceAfter: 'A space is required after \'{{tokenValue}}\'.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const propertyNameMustBeSpaced = context.options[0] === 'always' // default is "never"
    const enforceForClassMembers = !context.options[1] || context.options[1].enforceForClassMembers

    /**
     * Reports that there shouldn't be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     * @param tokenAfter The token after `token`.
     */
    function reportNoBeginningSpace(node: ASTNode, token: Tree.Token, tokenAfter: Tree.Token): void {
      context.report({
        node,
        loc: { start: token.loc.end, end: tokenAfter.loc.start },
        messageId: 'unexpectedSpaceAfter',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([token.range[1], tokenAfter.range[0]])
        },
      })
    }

    /**
     * Reports that there shouldn't be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     * @param tokenBefore The token before `token`.
     */
    function reportNoEndingSpace(node: ASTNode, token: Tree.Token, tokenBefore: Tree.Token): void {
      context.report({
        node,
        loc: { start: tokenBefore.loc.end, end: token.loc.start },
        messageId: 'unexpectedSpaceBefore',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([tokenBefore.range[1], token.range[0]])
        },
      })
    }

    /**
     * Reports that there should be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredBeginningSpace(node: ASTNode, token: Tree.Token): void {
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
    function reportRequiredEndingSpace(node: ASTNode, token: Tree.Token): void {
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

    type ExtractNodeKeys<T> = {
      [K in keyof T]: T[K] extends ASTNode ? K : never
    }[keyof T]

    /**
     * Returns a function that checks the spacing of a node on the property name
     * that was passed in.
     * @param propertyName The property on the node to check for spacing
     * @returns A function that will check spacing on a node
     */
    function checkSpacing<T extends NodeType, K = ExtractNodeKeys<T>>(propertyName: K) {
      return function (node: NodeType) {
        if (!node.computed)
          return

        const property = node[propertyName as ExtractNodeKeys<typeof node>] as ASTNode

        const before = sourceCode.getTokenBefore(property, isOpeningBracketToken)!
        const first = sourceCode.getTokenAfter(before, { includeComments: true })!
        const after = sourceCode.getTokenAfter(property, isClosingBracketToken)!
        const last = sourceCode.getTokenBefore(after, { includeComments: true })!

        if (isTokenOnSameLine(before, first)) {
          if (propertyNameMustBeSpaced) {
            if (!sourceCode.isSpaceBetween(before, first) && isTokenOnSameLine(before, first))
              reportRequiredBeginningSpace(node, before)
          }
          else {
            if (sourceCode.isSpaceBetween(before, first))
              reportNoBeginningSpace(node, before, first)
          }
        }

        if (isTokenOnSameLine(last, after)) {
          if (propertyNameMustBeSpaced) {
            if (!sourceCode.isSpaceBetween(last, after) && isTokenOnSameLine(last, after))
              reportRequiredEndingSpace(node, after)
          }
          else {
            if (sourceCode.isSpaceBetween(last, after))
              reportNoEndingSpace(node, after, last)
          }
        }
      }
    }

    type NodeType
      = | Tree.Property
        | Tree.PropertyDefinition
        | Tree.MemberExpression
        | Tree.MethodDefinition

    const listeners: RuleListener = {
      Property: checkSpacing<Tree.Property>('key'),
      MemberExpression: checkSpacing<Tree.MemberExpression>('property'),
    }

    if (enforceForClassMembers) {
      listeners.MethodDefinition = checkSpacing<Tree.MethodDefinition>('key')
      listeners.PropertyDefinition = checkSpacing<Tree.PropertyDefinition>('key')
    }

    return listeners
  },
})
