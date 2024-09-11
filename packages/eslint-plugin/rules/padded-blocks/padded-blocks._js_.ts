/**
 * @fileoverview A rule to ensure blank lines within blocks.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

import { isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  name: 'padded-blocks',
  package: 'js',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow padding within blocks',
    },
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['always', 'never'],
          },
          {
            type: 'object',
            properties: {
              blocks: {
                type: 'string',
                enum: ['always', 'never'],
              },
              switches: {
                type: 'string',
                enum: ['always', 'never'],
              },
              classes: {
                type: 'string',
                enum: ['always', 'never'],
              },
            },
            additionalProperties: false,
            minProperties: 1,
          },
        ],
      },
      {
        type: 'object',
        properties: {
          allowSingleLineBlocks: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      alwaysPadBlock: 'Block must be padded by blank lines.',
      neverPadBlock: 'Block must not be padded by blank lines.',
    },
  },
  create(context) {
    const options: Record<string, boolean> = {}
    const typeOptions = context.options[0] || 'always'
    const exceptOptions = context.options[1] || {}

    if (typeof typeOptions === 'string') {
      const shouldHavePadding = typeOptions === 'always'

      options.blocks = shouldHavePadding
      options.switches = shouldHavePadding
      options.classes = shouldHavePadding
    }
    else {
      if (Object.prototype.hasOwnProperty.call(typeOptions, 'blocks'))
        options.blocks = typeOptions.blocks === 'always'

      if (Object.prototype.hasOwnProperty.call(typeOptions, 'switches'))
        options.switches = typeOptions.switches === 'always'

      if (Object.prototype.hasOwnProperty.call(typeOptions, 'classes'))
        options.classes = typeOptions.classes === 'always'
    }

    if (Object.prototype.hasOwnProperty.call(exceptOptions, 'allowSingleLineBlocks'))
      options.allowSingleLineBlocks = exceptOptions.allowSingleLineBlocks === true

    const sourceCode = context.sourceCode

    /**
     * Gets the open brace token from a given node.
     * @param node A BlockStatement or SwitchStatement node from which to get the open brace.
     * @returns The token of the open brace.
     */
    function getOpenBrace(node: Tree.BlockStatement | Tree.StaticBlock | Tree.SwitchStatement | Tree.ClassBody): Token {
      if (node.type === 'SwitchStatement')
        return sourceCode.getTokenBefore(node.cases[0])!

      if (node.type === 'StaticBlock')
        return sourceCode.getFirstToken(node, { skip: 1 })! // skip the `static` token

      // `BlockStatement` or `ClassBody`
      return sourceCode.getFirstToken(node)!
    }

    /**
     * Checks if the given parameter is a comment node
     * @param node An AST node or token
     * @returns True if node is a comment
     */
    function isComment(node: ASTNode | Token) {
      return node.type === 'Line' || node.type === 'Block'
    }

    /**
     * Checks if there is padding between two tokens
     * @param first The first token
     * @param second The second token
     * @returns True if there is at least a line between the tokens
     */
    function isPaddingBetweenTokens(first: Token, second: Token) {
      return second.loc.start.line - first.loc.end.line >= 2
    }

    /**
     * Checks if the given token has a blank line after it.
     * @param token The token to check.
     * @returns Whether or not the token is followed by a blank line.
     */
    function getFirstBlockToken(token: Token) {
      let prev
      let first = token

      do {
        prev = first
        first = sourceCode.getTokenAfter(first, { includeComments: true })!
      } while (isComment(first) && first.loc.start.line === prev.loc.end.line)

      return first
    }

    /**
     * Checks if the given token is preceded by a blank line.
     * @param token The token to check
     * @returns Whether or not the token is preceded by a blank line
     */
    function getLastBlockToken(token: Token) {
      let last = token
      let next

      do {
        next = last
        last = sourceCode.getTokenBefore(last, { includeComments: true })!
      } while (isComment(last) && last.loc.end.line === next.loc.start.line)

      return last
    }

    /**
     * Checks if a node should be padded, according to the rule config.
     * @param node The AST node to check.
     * @throws {Error} (Unreachable)
     * @returns True if the node should be padded, false otherwise.
     */
    function requirePaddingFor(node: ASTNode) {
      switch (node.type) {
        case 'BlockStatement':
        case 'StaticBlock':
          return options.blocks
        case 'SwitchStatement':
          return options.switches
        case 'ClassBody':
          return options.classes

          /* c8 ignore next */
        default:
          throw new Error('unreachable')
      }
    }

    /**
     * Checks the given BlockStatement node to be padded if the block is not empty.
     * @param node The AST node of a BlockStatement.
     */
    function checkPadding(node: Tree.BlockStatement | Tree.SwitchStatement | Tree.ClassBody) {
      const openBrace = getOpenBrace(node)
      const firstBlockToken = getFirstBlockToken(openBrace)
      const tokenBeforeFirst = sourceCode.getTokenBefore(firstBlockToken, { includeComments: true })!
      const closeBrace = sourceCode.getLastToken(node)!
      const lastBlockToken = getLastBlockToken(closeBrace)
      const tokenAfterLast = sourceCode.getTokenAfter(lastBlockToken, { includeComments: true })!
      const blockHasTopPadding = isPaddingBetweenTokens(tokenBeforeFirst, firstBlockToken)
      const blockHasBottomPadding = isPaddingBetweenTokens(lastBlockToken, tokenAfterLast)

      if (options.allowSingleLineBlocks && isTokenOnSameLine(tokenBeforeFirst, tokenAfterLast))
        return

      if (requirePaddingFor(node)) {
        if (!blockHasTopPadding) {
          context.report({
            node,
            loc: {
              start: tokenBeforeFirst.loc.start,
              end: firstBlockToken.loc.start,
            },
            fix(fixer) {
              return fixer.insertTextAfter(tokenBeforeFirst, '\n')
            },
            messageId: 'alwaysPadBlock',
          })
        }
        if (!blockHasBottomPadding) {
          context.report({
            node,
            loc: {
              end: tokenAfterLast.loc.start,
              start: lastBlockToken.loc.end,
            },
            fix(fixer) {
              return fixer.insertTextBefore(tokenAfterLast, '\n')
            },
            messageId: 'alwaysPadBlock',
          })
        }
      }
      else {
        if (blockHasTopPadding) {
          context.report({
            node,
            loc: {
              start: tokenBeforeFirst.loc.start,
              end: firstBlockToken.loc.start,
            },
            fix(fixer) {
              return fixer.replaceTextRange([tokenBeforeFirst.range[1], firstBlockToken.range[0] - firstBlockToken.loc.start.column], '\n')
            },
            messageId: 'neverPadBlock',
          })
        }

        if (blockHasBottomPadding) {
          context.report({
            node,
            loc: {
              end: tokenAfterLast.loc.start,
              start: lastBlockToken.loc.end,
            },
            messageId: 'neverPadBlock',
            fix(fixer) {
              return fixer.replaceTextRange([lastBlockToken.range[1], tokenAfterLast.range[0] - tokenAfterLast.loc.start.column], '\n')
            },
          })
        }
      }
    }

    const rule: Record<string, any> = {}

    if (Object.prototype.hasOwnProperty.call(options, 'switches')) {
      rule.SwitchStatement = function (node: Tree.SwitchStatement) {
        if (node.cases.length === 0)
          return

        checkPadding(node)
      }
    }

    if (Object.prototype.hasOwnProperty.call(options, 'blocks')) {
      rule.BlockStatement = function (node: Tree.BlockStatement) {
        if (node.body.length === 0)
          return

        checkPadding(node)
      }
      rule.StaticBlock = rule.BlockStatement
    }

    if (Object.prototype.hasOwnProperty.call(options, 'classes')) {
      rule.ClassBody = function (node: Tree.ClassBody) {
        if (node.body.length === 0)
          return

        checkPadding(node)
      }
    }

    return rule
  },
})
