/**
 * @fileoverview A rule to disallow or enforce spaces inside of single line blocks.
 * @author Toru Nagashima
 */

import type { Token, Tree } from '@shared/types'
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { isTokenOnSameLine } from '../../utils/ast-utils'
import { createTSRule } from '../../utils'
import type { MessageIds, RuleOptions } from './types'

type SupportedType = Tree.BlockStatement | Tree.StaticBlock | Tree.SwitchStatement | Tree.TSInterfaceBody | Tree.TSTypeLiteral | Tree.TSEnumDeclaration

export default createTSRule<RuleOptions, MessageIds>({
  name: 'block-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow or enforce spaces inside of blocks after opening block and before closing block',
    },
    fixable: 'whitespace',
    schema: [
      { type: 'string', enum: ['always', 'never'] },
    ],
    messages: {
      missing: 'Requires a space {{location}} \'{{token}}\'.',
      extra: 'Unexpected space(s) {{location}} \'{{token}}\'.',
    },
  },
  defaultOptions: ['always'],
  create(context, options) {
    const always = (options[0] !== 'never')
    const messageId = always ? 'missing' : 'extra'
    const sourceCode = context.sourceCode

    /**
     * Gets the open brace token from a given node.
     * @returns The token of the open brace.
     */
    function getOpenBrace(node: SupportedType): Tree.PunctuatorToken {
      if (node.type === AST_NODE_TYPES.SwitchStatement) {
        if (node.cases.length > 0)
          return sourceCode.getTokenBefore(node.cases[0])! as Tree.PunctuatorToken

        return sourceCode.getLastToken(node, 1)! as Tree.PunctuatorToken
      }

      if (node.type === AST_NODE_TYPES.StaticBlock)
        return sourceCode.getFirstToken(node, { skip: 1 })! as Tree.PunctuatorToken // skip the `static` token

      if (node.type === AST_NODE_TYPES.TSEnumDeclaration) {
        return sourceCode.getFirstToken(node, {
          filter: token =>
            token.type === AST_TOKEN_TYPES.Punctuator && token.value === '{',
        }) as Tree.PunctuatorToken
      }

      return sourceCode.getFirstToken(node)! as Tree.PunctuatorToken
    }

    /**
     * Checks whether or not:
     *   - given tokens are on same line.
     *   - there is/isn't a space between given tokens.
     * @param left A token to check.
     * @param right The token which is next to `left`.
     *    When the option is `"always"`, `true` if there are one or more spaces between given tokens.
     *    When the option is `"never"`, `true` if there are not any spaces between given tokens.
     *    If given tokens are not on same line, it's always `true`.
     */
    function isValid(left: Token, right: Token): boolean {
      return (
        !isTokenOnSameLine(left, right)
        || sourceCode.isSpaceBetween(left, right) === always
      )
    }

    /**
     * Checks and reports invalid spacing style inside braces.
     */
    function checkSpacingInsideBraces(node: SupportedType): void {
      // Gets braces and the first/last token of content.
      const openBrace = getOpenBrace(node)
      const closeBrace = sourceCode.getLastToken(node)!
      const firstToken = sourceCode.getTokenAfter(openBrace, {
        includeComments: true,
      })!
      const lastToken = sourceCode.getTokenBefore(closeBrace, {
        includeComments: true,
      })!

      // Skip if the node is invalid or empty.
      if (
        openBrace.type !== AST_TOKEN_TYPES.Punctuator
        || openBrace.value !== '{'
        || closeBrace.type !== AST_TOKEN_TYPES.Punctuator
        || closeBrace.value !== '}'
        || firstToken === closeBrace
      ) {
        return
      }

      // Skip line comments for option never
      if (!always && firstToken.type === AST_TOKEN_TYPES.Line)
        return

      // Check.
      if (!isValid(openBrace, firstToken)) {
        let loc = openBrace.loc

        if (messageId === 'extra') {
          loc = {
            start: openBrace.loc.end,
            end: firstToken.loc.start,
          }
        }

        context.report({
          node,
          loc,
          messageId,
          data: {
            location: 'after',
            token: openBrace.value,
          },
          fix(fixer) {
            if (always)
              return fixer.insertTextBefore(firstToken, ' ')

            return fixer.removeRange([openBrace.range[1], firstToken.range[0]])
          },
        })
      }
      if (!isValid(lastToken, closeBrace)) {
        let loc = closeBrace.loc

        if (messageId === 'extra') {
          loc = {
            start: lastToken.loc.end,
            end: closeBrace.loc.start,
          }
        }
        context.report({
          node,
          loc,
          messageId,
          data: {
            location: 'before',
            token: closeBrace.value,
          },
          fix(fixer) {
            if (always)
              return fixer.insertTextAfter(lastToken, ' ')

            return fixer.removeRange([lastToken.range[1], closeBrace.range[0]])
          },
        })
      }
    }

    return {
      BlockStatement: checkSpacingInsideBraces,
      StaticBlock: checkSpacingInsideBraces,
      SwitchStatement: checkSpacingInsideBraces,
      TSInterfaceBody: checkSpacingInsideBraces,
      TSTypeLiteral: checkSpacingInsideBraces,
      TSEnumDeclaration: checkSpacingInsideBraces,
    }
  },
})
