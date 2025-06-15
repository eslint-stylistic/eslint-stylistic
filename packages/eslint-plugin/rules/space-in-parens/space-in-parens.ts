/**
 * @fileoverview Disallows or enforces spaces inside of parentheses.
 * @author Jonathan Rajavuori
 */

import type { Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'
import { isClosingParenToken, isOpeningParenToken, isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'

export default createRule<RuleOptions, MessageIds>({
  name: 'space-in-parens',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent spacing inside parentheses',
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
          exceptions: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['{}', '[]', '()', 'empty'],
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      missingOpeningSpace: 'There must be a space after this paren.',
      missingClosingSpace: 'There must be a space before this paren.',
      rejectedOpeningSpace: 'There should be no space after this paren.',
      rejectedClosingSpace: 'There should be no space before this paren.',
    },
  },

  create(context) {
    const ALWAYS = context.options[0] === 'always'
    const exceptionsArrayOptions = (context.options[1] && context.options[1].exceptions) || []
    const options = {
      braceException: false,
      bracketException: false,
      parenException: false,
      empty: false,
    }

    let exceptions: { openers: string[], closers: string[] } = {
      openers: [],
      closers: [],
    }

    if (exceptionsArrayOptions.length) {
      options.braceException = exceptionsArrayOptions.includes('{}')
      options.bracketException = exceptionsArrayOptions.includes('[]')
      options.parenException = exceptionsArrayOptions.includes('()')
      options.empty = exceptionsArrayOptions.includes('empty')
    }

    /**
     * Produces an object with the opener and closer exception values
     * @returns `openers` and `closers` exception values
     * @private
     */
    function getExceptions() {
      const openers: string[] = []
      const closers: string[] = []

      if (options.braceException) {
        openers.push('{')
        closers.push('}')
      }

      if (options.bracketException) {
        openers.push('[')
        closers.push(']')
      }

      if (options.parenException) {
        openers.push('(')
        closers.push(')')
      }

      if (options.empty) {
        openers.push(')')
        closers.push('(')
      }

      return {
        openers,
        closers,
      }
    }
    const sourceCode = context.sourceCode

    /**
     * Determines if a token is one of the exceptions for the opener paren
     * @param token The token to check
     * @returns True if the token is one of the exceptions for the opener paren
     */
    function isOpenerException(token: Token) {
      return exceptions.openers.includes(token.value)
    }

    /**
     * Determines if a token is one of the exceptions for the closer paren
     * @param token The token to check
     * @returns True if the token is one of the exceptions for the closer paren
     */
    function isCloserException(token: Token) {
      return exceptions.closers.includes(token.value)
    }

    /**
     * Determines if an opening paren is immediately followed by a required space
     * @param openingParenToken The paren token
     * @param tokenAfterOpeningParen The token after it
     * @returns True if the opening paren is missing a required space
     */
    function openerMissingSpace(openingParenToken: Token, tokenAfterOpeningParen: Token) {
      if (sourceCode.isSpaceBetween(openingParenToken, tokenAfterOpeningParen))
        return false

      if (!options.empty && isClosingParenToken(tokenAfterOpeningParen))
        return false

      if (ALWAYS)
        return !isOpenerException(tokenAfterOpeningParen)

      return isOpenerException(tokenAfterOpeningParen)
    }

    /**
     * Determines if an opening paren is immediately followed by a disallowed space
     * @param openingParenToken The paren token
     * @param tokenAfterOpeningParen The token after it
     * @returns True if the opening paren has a disallowed space
     */
    function openerRejectsSpace(openingParenToken: Token, tokenAfterOpeningParen: Token) {
      if (!isTokenOnSameLine(openingParenToken, tokenAfterOpeningParen))
        return false

      if (tokenAfterOpeningParen.type === 'Line')
        return false

      if (!sourceCode.isSpaceBetween(openingParenToken, tokenAfterOpeningParen))
        return false

      if (ALWAYS)
        return isOpenerException(tokenAfterOpeningParen)

      return !isOpenerException(tokenAfterOpeningParen)
    }

    /**
     * Determines if a closing paren is immediately preceded by a required space
     * @param tokenBeforeClosingParen The token before the paren
     * @param closingParenToken The paren token
     * @returns True if the closing paren is missing a required space
     */
    function closerMissingSpace(tokenBeforeClosingParen: Token, closingParenToken: Token) {
      if (sourceCode.isSpaceBetween(tokenBeforeClosingParen, closingParenToken))
        return false

      if (!options.empty && isOpeningParenToken(tokenBeforeClosingParen))
        return false

      if (ALWAYS)
        return !isCloserException(tokenBeforeClosingParen)

      return isCloserException(tokenBeforeClosingParen)
    }

    /**
     * Determines if a closer paren is immediately preceded by a disallowed space
     * @param tokenBeforeClosingParen The token before the paren
     * @param closingParenToken The paren token
     * @returns True if the closing paren has a disallowed space
     */
    function closerRejectsSpace(tokenBeforeClosingParen: Token, closingParenToken: Token) {
      if (!isTokenOnSameLine(tokenBeforeClosingParen, closingParenToken))
        return false

      if (!sourceCode.isSpaceBetween(tokenBeforeClosingParen, closingParenToken))
        return false

      if (ALWAYS)
        return isCloserException(tokenBeforeClosingParen)

      return !isCloserException(tokenBeforeClosingParen)
    }

    return {
      Program: function checkParenSpaces(node: Tree.Program) {
        exceptions = getExceptions()
        const tokens = sourceCode.tokensAndComments

        tokens.forEach((token, i) => {
          const prevToken = tokens[i - 1]
          const nextToken = tokens[i + 1]

          // if token is not an opening or closing paren token, do nothing
          if (!isOpeningParenToken(token) && !isClosingParenToken(token))
            return

          // if token is an opening paren and is not followed by a required space
          if (token.value === '(' && openerMissingSpace(token, nextToken)) {
            context.report({
              node,
              loc: token.loc,
              messageId: 'missingOpeningSpace',
              fix(fixer) {
                return fixer.insertTextAfter(token, ' ')
              },
            })
          }

          // if token is an opening paren and is followed by a disallowed space
          if (token.value === '(' && openerRejectsSpace(token, nextToken)) {
            context.report({
              node,
              loc: { start: token.loc.end, end: nextToken.loc.start },
              messageId: 'rejectedOpeningSpace',
              fix(fixer) {
                return fixer.removeRange([token.range[1], nextToken.range[0]])
              },
            })
          }

          // if token is a closing paren and is not preceded by a required space
          if (token.value === ')' && closerMissingSpace(prevToken, token)) {
            context.report({
              node,
              loc: token.loc,
              messageId: 'missingClosingSpace',
              fix(fixer) {
                return fixer.insertTextBefore(token, ' ')
              },
            })
          }

          // if token is a closing paren and is preceded by a disallowed space
          if (token.value === ')' && closerRejectsSpace(prevToken, token)) {
            context.report({
              node,
              loc: { start: prevToken.loc.end, end: token.loc.start },
              messageId: 'rejectedClosingSpace',
              fix(fixer) {
                return fixer.removeRange([prevToken.range[1], token.range[0]])
              },
            })
          }
        })
      },
    }
  },
})
