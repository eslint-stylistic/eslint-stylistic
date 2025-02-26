/**
 * @fileoverview Rule to enforce spacing around colons of switch statements.
 * @author Toru Nagashima
 */

import type { RuleFixer, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { getSwitchCaseColonToken, isClosingBraceToken, isCommentToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'switch-colon-spacing',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce spacing around colons of switch statements',
    },

    schema: [
      {
        type: 'object',
        properties: {
          before: { type: 'boolean', default: false },
          after: { type: 'boolean', default: true },
        },
        additionalProperties: false,
      },
    ],
    fixable: 'whitespace',
    messages: {
      expectedBefore: 'Expected space(s) before this colon.',
      expectedAfter: 'Expected space(s) after this colon.',
      unexpectedBefore: 'Unexpected space(s) before this colon.',
      unexpectedAfter: 'Unexpected space(s) after this colon.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const options = context.options[0] || {}
    const beforeSpacing = options.before === true // false by default
    const afterSpacing = options.after !== false // true by default

    /**
     * Check whether the spacing between the given 2 tokens is valid or not.
     * @param left The left token to check.
     * @param right The right token to check.
     * @param expected The expected spacing to check. `true` if there should be a space.
     * @returns `true` if the spacing between the tokens is valid.
     */
    function isValidSpacing(left: Token, right: Token, expected: boolean) {
      return (
        isClosingBraceToken(right)
        || !isTokenOnSameLine(left, right)
        || sourceCode.isSpaceBetween(left, right) === expected
      )
    }

    /**
     * Check whether comments exist between the given 2 tokens.
     * @param left The left token to check.
     * @param right The right token to check.
     * @returns `true` if comments exist between the given 2 tokens.
     */
    function commentsExistBetween(left: Token, right: Token) {
      return sourceCode.getFirstTokenBetween(
        left,
        right,
        {
          includeComments: true,
          filter: isCommentToken,
        },
      ) !== null
    }

    /**
     * Fix the spacing between the given 2 tokens.
     * @param fixer The fixer to fix.
     * @param left The left token of fix range.
     * @param right The right token of fix range.
     * @param spacing The spacing style. `true` if there should be a space.
     * @returns The fix object.
     */
    function fix(fixer: RuleFixer, left: Token, right: Token, spacing: boolean) {
      if (commentsExistBetween(left, right))
        return null

      if (spacing)
        return fixer.insertTextAfter(left, ' ')

      return fixer.removeRange([left.range[1], right.range[0]])
    }

    return {
      SwitchCase(node) {
        const colonToken = getSwitchCaseColonToken(node, sourceCode)!
        const beforeToken = sourceCode.getTokenBefore(colonToken)!
        const afterToken = sourceCode.getTokenAfter(colonToken)!

        if (!isValidSpacing(beforeToken, colonToken, beforeSpacing)) {
          context.report({
            node,
            loc: colonToken.loc,
            messageId: beforeSpacing ? 'expectedBefore' : 'unexpectedBefore',
            fix: fixer => fix(fixer, beforeToken, colonToken, beforeSpacing),
          })
        }
        if (!isValidSpacing(colonToken, afterToken, afterSpacing)) {
          context.report({
            node,
            loc: colonToken.loc,
            messageId: afterSpacing ? 'expectedAfter' : 'unexpectedAfter',
            fix: fixer => fix(fixer, colonToken, afterToken, afterSpacing),
          })
        }
      },
    }
  },
})
