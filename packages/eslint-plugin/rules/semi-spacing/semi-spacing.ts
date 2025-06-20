import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  AST_NODE_TYPES,
  isClosingBraceToken,
  isClosingParenToken,
  isSemicolonToken,
  isTokenOnSameLine,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'semi-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing before and after semicolons',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          before: {
            type: 'boolean',
            default: false,
          },
          after: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      unexpectedWhitespaceBefore: 'Unexpected whitespace before semicolon.',
      unexpectedWhitespaceAfter: 'Unexpected whitespace after semicolon.',
      missingWhitespaceBefore: 'Missing whitespace before semicolon.',
      missingWhitespaceAfter: 'Missing whitespace after semicolon.',
    },
  },
  create(context) {
    const config = context.options[0]
    const sourceCode = context.sourceCode
    let requireSpaceBefore = false
    let requireSpaceAfter = true

    if (typeof config === 'object') {
      requireSpaceBefore = config.before!
      requireSpaceAfter = config.after!
    }

    /**
     * Checks if a given token has leading whitespace.
     * @param token The token to check.
     * @returns True if the given token has leading space, false if not.
     */
    function hasLeadingSpace(token: Token) {
      const tokenBefore = sourceCode.getTokenBefore(token)

      return tokenBefore && isTokenOnSameLine(tokenBefore, token) && sourceCode.isSpaceBetween(tokenBefore, token)
    }

    /**
     * Checks if a given token has trailing whitespace.
     * @param token The token to check.
     * @returns True if the given token has trailing space, false if not.
     */
    function hasTrailingSpace(token: Token) {
      const tokenAfter = sourceCode.getTokenAfter(token)

      return tokenAfter && isTokenOnSameLine(token, tokenAfter) && sourceCode.isSpaceBetween(token, tokenAfter)
    }

    /**
     * Checks if the given token is the last token in its line.
     * @param token The token to check.
     * @returns Whether or not the token is the last in its line.
     */
    function isLastTokenInCurrentLine(token: Token) {
      const tokenAfter = sourceCode.getTokenAfter(token)

      return !(tokenAfter && isTokenOnSameLine(token, tokenAfter))
    }

    /**
     * Checks if the given token is the first token in its line
     * @param token The token to check.
     * @returns Whether or not the token is the first in its line.
     */
    function isFirstTokenInCurrentLine(token: Token) {
      const tokenBefore = sourceCode.getTokenBefore(token)

      return !(tokenBefore && isTokenOnSameLine(token, tokenBefore))
    }

    /**
     * Checks if the next token of a given token is a closing parenthesis.
     * @param token The token to check.
     * @returns Whether or not the next token of a given token is a closing parenthesis.
     */
    function isBeforeClosingParen(token: Token) {
      const nextToken = sourceCode.getTokenAfter(token)

      return (nextToken && isClosingBraceToken(nextToken) || isClosingParenToken(nextToken!))
    }

    /**
     * Report location example :
     *
     * for unexpected space `before`
     *
     * var a = 'b'   ;
     *            ^^^
     *
     * for unexpected space `after`
     *
     * var a = 'b';  c = 10;
     *             ^^
     *
     * Reports if the given token has invalid spacing.
     * @param token The semicolon token to check.
     * @param node The corresponding node of the token.
     */
    function checkSemicolonSpacing(token: Token, node: ASTNode) {
      if (isSemicolonToken(token)) {
        if (hasLeadingSpace(token)) {
          if (!requireSpaceBefore) {
            const tokenBefore = sourceCode.getTokenBefore(token)
            const loc = {
              start: tokenBefore!.loc.end,
              end: token.loc.start,
            }

            context.report({
              node,
              loc,
              messageId: 'unexpectedWhitespaceBefore',
              fix(fixer) {
                return fixer.removeRange([tokenBefore!.range[1], token.range[0]])
              },
            })
          }
        }
        else {
          if (requireSpaceBefore) {
            const loc = token.loc

            context.report({
              node,
              loc,
              messageId: 'missingWhitespaceBefore',
              fix(fixer) {
                return fixer.insertTextBefore(token, ' ')
              },
            })
          }
        }

        if (!isFirstTokenInCurrentLine(token) && !isLastTokenInCurrentLine(token) && !isBeforeClosingParen(token)) {
          if (hasTrailingSpace(token)) {
            if (!requireSpaceAfter) {
              const tokenAfter = sourceCode.getTokenAfter(token)
              const loc = {
                start: token.loc.end,
                end: tokenAfter!.loc.start,
              }

              context.report({
                node,
                loc,
                messageId: 'unexpectedWhitespaceAfter',
                fix(fixer) {
                  return fixer.removeRange([token.range[1], tokenAfter!.range[0]])
                },
              })
            }
          }
          else {
            if (requireSpaceAfter) {
              const loc = token.loc

              context.report({
                node,
                loc,
                messageId: 'missingWhitespaceAfter',
                fix(fixer) {
                  return fixer.insertTextAfter(token, ' ')
                },
              })
            }
          }
        }
      }
    }

    /**
     * Checks the spacing of the semicolon with the assumption that the last token is the semicolon.
     * @param node The node to check.
     */
    function checkNode(node: ASTNode) {
      const token = sourceCode.getLastToken(node)

      checkSemicolonSpacing(token!, node)
    }

    return {
      VariableDeclaration: checkNode,
      ExpressionStatement: checkNode,
      BreakStatement: checkNode,
      ContinueStatement: checkNode,
      DebuggerStatement: checkNode,
      DoWhileStatement: checkNode,
      ReturnStatement: checkNode,
      ThrowStatement: checkNode,
      ImportDeclaration: checkNode,
      ExportNamedDeclaration: checkNode,
      ExportAllDeclaration: checkNode,
      ExportDefaultDeclaration: checkNode,
      ForStatement(node) {
        if (node.init)
          checkSemicolonSpacing(sourceCode.getTokenAfter(node.init)!, node)

        if (node.test)
          checkSemicolonSpacing(sourceCode.getTokenAfter(node.test)!, node)
      },
      PropertyDefinition: checkNode,
      AccessorProperty: checkNode,
      TSDeclareFunction: checkNode,
      TSTypeAliasDeclaration: checkNode,
      TSTypeAnnotation(node) {
        const excludeNodeTypes = new Set([
          AST_NODE_TYPES.TSDeclareFunction,
        ])
        if (node.parent && !excludeNodeTypes.has(node.parent.type))
          checkNode!(node.parent as Tree.ExpressionStatement)
      },
    }
  },
})
