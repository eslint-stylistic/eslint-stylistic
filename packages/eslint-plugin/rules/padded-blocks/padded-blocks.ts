/**
 * @fileoverview A rule to ensure blank lines within blocks.
 * @author Mathias Schreck <https://github.com/lo1tuma>
 */

import type { ASTNode, JSONSchema, Token } from '#types'
import type { MessageIds, PaddedBlocksSchema0, RuleOptions } from './types'
import { isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const OPTION_ENUMS = ['always', 'never', 'start', 'end']
type OptionSchema = Extract<PaddedBlocksSchema0, object>
const OPTION_NODES = ['blocks', 'switches', 'classes', 'types', 'enums', 'interfaces', 'modules'] as const

export default createRule<RuleOptions, MessageIds>({
  name: 'padded-blocks',
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
            enum: OPTION_ENUMS,
          },
          {
            type: 'object',
            properties: OPTION_NODES.reduce<Record<string, JSONSchema.JSONSchema4>>((pre, name) => {
              pre[name] = {
                type: 'string',
                enum: OPTION_ENUMS,
              }
              return pre
            }, {}),
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
      missingPadBlock: 'Block must be padded by blank lines.',
      extraPadBlock: 'Block must not be padded by blank lines.',
    },
  },
  create(context) {
    const options: OptionSchema = {}
    const typeOptions = context.options[0] || 'always'
    const exceptOptions = context.options[1] || {}

    if (typeof typeOptions === 'string') {
      OPTION_NODES.forEach((nodeName) => {
        options[nodeName] = typeOptions
      })
    }
    else {
      Object.assign(options, typeOptions)
    }
    exceptOptions.allowSingleLineBlocks ??= false

    const sourceCode = context.sourceCode

    /**
     * Gets the open brace token from a given node.
     * @param node A BlockStatement or SwitchStatement node from which to get the open brace.
     * @returns The token of the open brace.
     */
    function getOpenBrace(node: ASTNode): Token {
      if (node.type === 'SwitchStatement')
        return sourceCode.getTokenBefore(node.cases[0])!

      if (node.type === 'StaticBlock')
        return sourceCode.getFirstToken(node, { skip: 1 })! // skip the `static` token

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
      } while (isComment(first) && isTokenOnSameLine(prev, first))

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
      } while (isComment(last) && isTokenOnSameLine(last, next))

      return last
    }

    /**
     * Checks if a node should be padded, according to the rule config.
     * @param node The AST node to check.
     * @throws {Error} (Unreachable)
     * @returns True if the node should be padded, false otherwise.
     */
    function requirePaddingFor(node: ASTNode) {
      const paddingMap = {
        BlockStatement: options.blocks,
        StaticBlock: options.blocks,
        SwitchStatement: options.switches,
        ClassBody: options.classes,
        TSTypeLiteral: options.types,
        TSMappedType: options.types,
        TSTypeAliasDeclaration: options.types,
        TSEnumDeclaration: options.enums,
        TSEnumBody: options.enums,
        TSInterfaceBody: options.interfaces,
        TSModuleBlock: options.interfaces,
      }

      const type = node.type
      if (!(type in paddingMap)) {
        throw new Error('unreachable')
      }

      return paddingMap[type as keyof typeof paddingMap]
    }

    /**
     * Checks the given BlockStatement node to be padded if the block is not empty.
     * @param node The AST node of a BlockStatement.
     */
    function checkPadding(node: ASTNode) {
      const openBrace = getOpenBrace(node)
      const firstBlockToken = getFirstBlockToken(openBrace)
      const tokenBeforeFirst = sourceCode.getTokenBefore(firstBlockToken, { includeComments: true })!
      const closeBrace = sourceCode.getLastToken(node)!
      const lastBlockToken = getLastBlockToken(closeBrace)
      const tokenAfterLast = sourceCode.getTokenAfter(lastBlockToken, { includeComments: true })!
      const blockHasTopPadding = isPaddingBetweenTokens(tokenBeforeFirst, firstBlockToken)
      const blockHasBottomPadding = isPaddingBetweenTokens(lastBlockToken, tokenAfterLast)

      if (exceptOptions.allowSingleLineBlocks && isTokenOnSameLine(tokenBeforeFirst, tokenAfterLast))
        return

      const requiredPadding = requirePaddingFor(node)

      if (blockHasTopPadding) {
        if (requiredPadding === 'never' || requiredPadding === 'end') {
          context.report({
            node,
            loc: {
              start: tokenBeforeFirst.loc.start,
              end: firstBlockToken.loc.start,
            },
            fix(fixer) {
              return fixer.replaceTextRange([tokenBeforeFirst.range[1], firstBlockToken.range[0] - firstBlockToken.loc.start.column], '\n')
            },
            messageId: 'extraPadBlock',
          })
        }
      }
      else {
        if (requiredPadding === 'always' || requiredPadding === 'start') {
          context.report({
            node,
            loc: {
              start: tokenBeforeFirst.loc.start,
              end: firstBlockToken.loc.start,
            },
            fix(fixer) {
              return fixer.insertTextAfter(tokenBeforeFirst, '\n')
            },
            messageId: 'missingPadBlock',
          })
        }
      }

      if (blockHasBottomPadding) {
        if (requiredPadding === 'never' || requiredPadding === 'start') {
          context.report({
            node,
            loc: {
              end: tokenAfterLast.loc.start,
              start: lastBlockToken.loc.end,
            },
            messageId: 'extraPadBlock',
            fix(fixer) {
              return fixer.replaceTextRange([lastBlockToken.range[1], tokenAfterLast.range[0] - tokenAfterLast.loc.start.column], '\n')
            },
          })
        }
      }
      else {
        if (requiredPadding === 'always' || requiredPadding === 'end') {
          context.report({
            node,
            loc: {
              end: tokenAfterLast.loc.start,
              start: lastBlockToken.loc.end,
            },
            fix(fixer) {
              return fixer.insertTextBefore(tokenAfterLast, '\n')
            },
            messageId: 'missingPadBlock',
          })
        }
      }
    }

    const rule: Record<string, any> = {}
    const RULE_CONFIGS: Record<string, Record<string, { checkProp: string | string[] | null, checkToken: string | string[] | null }>> = {
      switches: {
        SwitchStatement: {
          checkProp: 'cases',
          checkToken: null,
        },
      },
      blocks: {
        BlockStatement: {
          checkProp: 'body',
          checkToken: null,
        },
        StaticBlock: {
          checkProp: 'body',
          checkToken: null,
        },
      },
      classes: {
        ClassBody: {
          checkProp: 'body',
          checkToken: null,
        },
      },
      types: {
        TSTypeLiteral: {
          checkProp: 'members',
          checkToken: null,
        },
        TSMappedType: {
          checkProp: null,
          checkToken: null,
        },
      },
      enums: {
        TSEnumDeclaration: {
          checkProp: ['body', 'members'],
          checkToken: 'body',
        },
      },
      interfaces: {
        TSInterfaceBody: {
          checkProp: 'body',
          checkToken: null,
        },
      },
      modules: {
        TSModuleBlock: {
          checkProp: 'body',
          checkToken: null,
        },
      },
    }

    Object.entries(RULE_CONFIGS).forEach(([optionName, nodeConfigs]) => {
      if (Object.prototype.hasOwnProperty.call(options, optionName)) {
        Object.entries(nodeConfigs).forEach(([nodeType, { checkProp, checkToken }]) => {
          rule[nodeType] = (node: any) => {
            if (checkProp) {
              const props = Array.isArray(checkProp) ? checkProp : [checkProp]
              if (props.reduce((acc, prop) => acc[prop], node).length === 0)
                return
            }
            let token = node
            if (checkToken !== null) {
              token = Array.isArray(checkToken) ? checkToken : [checkToken].reduce((acc, prop) => acc[prop], node)
            }
            checkPadding(token)
          }
        })
      }
    })

    return rule
  },
})
