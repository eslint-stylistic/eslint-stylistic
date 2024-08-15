import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { isCommentToken, isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'
import type { MessageIds, RuleOptions } from './types'
import type { ASTNode, Tree } from '#types'

import { createRule } from '#utils/create-rule'
import { getJsRule } from '#utils/get-js-rule'

const baseRule = getJsRule('lines-around-comment')

const COMMENTS_IGNORE_PATTERN
  = /^\s*(?:eslint|jshint\s+|jslint\s+|istanbul\s+|globals?\s+|exported\s+|jscs)/u

/**
 * @returns an array with with any line numbers that are empty.
 */
function getEmptyLineNums(lines: string[]): number[] {
  const emptyLines = lines
    .map((line, i) => ({
      code: line.trim(),
      num: i + 1,
    }))
    .filter(line => !line.code)
    .map(line => line.num)

  return emptyLines
}

/**
 * @returns an array with with any line numbers that contain comments.
 */
function getCommentLineNums(comments: Tree.Comment[]): number[] {
  const lines: number[] = []

  comments.forEach((token) => {
    const start = token.loc.start.line
    const end = token.loc.end.line

    lines.push(start, end)
  })
  return lines
}

export default createRule<RuleOptions, MessageIds>({
  name: 'lines-around-comment',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require empty lines around comments',
    },
    schema: [
      {
        type: 'object',
        properties: {
          beforeBlockComment: {
            type: 'boolean',
            default: true,
          },
          afterBlockComment: {
            type: 'boolean',
            default: false,
          },
          beforeLineComment: {
            type: 'boolean',
            default: false,
          },
          afterLineComment: {
            type: 'boolean',
            default: false,
          },
          allowBlockStart: {
            type: 'boolean',
            default: false,
          },
          allowBlockEnd: {
            type: 'boolean',
            default: false,
          },
          allowClassStart: {
            type: 'boolean',
          },
          allowClassEnd: {
            type: 'boolean',
          },
          allowObjectStart: {
            type: 'boolean',
          },
          allowObjectEnd: {
            type: 'boolean',
          },
          allowArrayStart: {
            type: 'boolean',
          },
          allowArrayEnd: {
            type: 'boolean',
          },
          allowInterfaceStart: {
            type: 'boolean',
          },
          allowInterfaceEnd: {
            type: 'boolean',
          },
          allowTypeStart: {
            type: 'boolean',
          },
          allowTypeEnd: {
            type: 'boolean',
          },
          allowEnumStart: {
            type: 'boolean',
          },
          allowEnumEnd: {
            type: 'boolean',
          },
          allowModuleStart: {
            type: 'boolean',
          },
          allowModuleEnd: {
            type: 'boolean',
          },
          ignorePattern: {
            type: 'string',
          },
          applyDefaultIgnorePatterns: {
            type: 'boolean',
          },
          afterHashbangComment: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: baseRule.meta.fixable,
    hasSuggestions: baseRule.meta.hasSuggestions,
    messages: baseRule.meta.messages,
  },
  defaultOptions: [
    {
      beforeBlockComment: true,
    },
  ],
  create(context, [_options]) {
    const options = _options!
    const defaultIgnoreRegExp = COMMENTS_IGNORE_PATTERN
    const customIgnoreRegExp = new RegExp(options.ignorePattern ?? '', 'u')

    const sourceCode = context.sourceCode
    const comments = sourceCode.getAllComments()

    const lines = sourceCode.lines
    const commentLines = getCommentLineNums(comments)
    const emptyLines = getEmptyLineNums(lines)
    const commentAndEmptyLines = new Set(commentLines.concat(emptyLines))

    /**
     * @returns whether comments are on lines starting with or ending with code.
     */
    function codeAroundComment(token: Tree.Token): boolean {
      let currentToken: Tree.Token | null = token

      do {
        currentToken = sourceCode.getTokenBefore(currentToken, {
          includeComments: true,
        })
      } while (currentToken && isCommentToken(currentToken))

      if (currentToken && isTokenOnSameLine(currentToken, token))
        return true

      currentToken = token
      do {
        currentToken = sourceCode.getTokenAfter(currentToken, {
          includeComments: true,
        })
      } while (currentToken && isCommentToken(currentToken))

      if (currentToken && isTokenOnSameLine(token, currentToken))
        return true

      return false
    }

    /**
     * @returns whether comments are inside a node type.
     */
    function isParentNodeType<T extends Tree.AST_NODE_TYPES>(
      parent: ASTNode,
      nodeType: T,
    ): parent is Extract<ASTNode, { type: T }> {
      return parent.type === nodeType
    }

    /**
     * @returns the parent node that contains the given token.
     */
    function getParentNodeOfToken(token: Tree.Token): ASTNode | null {
      const node = sourceCode.getNodeByRangeIndex(token.range[0])

      return node
    }

    /**
     * @returns whether comments are at the parent start.
     */
    function isCommentAtParentStart(
      token: Tree.Token,
      nodeType: Tree.AST_NODE_TYPES,
    ): boolean {
      const parent = getParentNodeOfToken(token)

      if (parent && isParentNodeType(parent, nodeType)) {
        const parentStartNodeOrToken = parent

        return (
          token.loc.start.line - parentStartNodeOrToken.loc.start.line === 1
        )
      }

      return false
    }

    /**
     * @returns whether comments are at the parent end.
     */
    function isCommentAtParentEnd(
      token: Tree.Token,
      nodeType: Tree.AST_NODE_TYPES,
    ): boolean {
      const parent = getParentNodeOfToken(token)

      return (
        !!parent
        && isParentNodeType(parent, nodeType)
        && parent.loc.end.line - token.loc.end.line === 1
      )
    }

    function isCommentAtInterfaceStart(token: Tree.Comment): boolean {
      return isCommentAtParentStart(token, AST_NODE_TYPES.TSInterfaceBody)
    }

    function isCommentAtInterfaceEnd(token: Tree.Comment): boolean {
      return isCommentAtParentEnd(token, AST_NODE_TYPES.TSInterfaceBody)
    }

    function isCommentAtTypeStart(token: Tree.Comment): boolean {
      return isCommentAtParentStart(token, AST_NODE_TYPES.TSTypeLiteral)
    }

    function isCommentAtTypeEnd(token: Tree.Comment): boolean {
      return isCommentAtParentEnd(token, AST_NODE_TYPES.TSTypeLiteral)
    }

    function isCommentAtEnumStart(token: Tree.Comment): boolean {
      return isCommentAtParentStart(token, AST_NODE_TYPES.TSEnumBody) || isCommentAtParentStart(token, AST_NODE_TYPES.TSEnumDeclaration)
    }

    function isCommentAtEnumEnd(token: Tree.Comment): boolean {
      return isCommentAtParentEnd(token, AST_NODE_TYPES.TSEnumBody) || isCommentAtParentEnd(token, AST_NODE_TYPES.TSEnumDeclaration)
    }

    function isCommentAtModuleStart(token: Tree.Comment): boolean {
      return isCommentAtParentStart(token, AST_NODE_TYPES.TSModuleBlock)
    }

    function isCommentAtModuleEnd(token: Tree.Comment): boolean {
      return isCommentAtParentEnd(token, AST_NODE_TYPES.TSModuleBlock)
    }

    function isCommentNearTSConstruct(token: Tree.Comment): boolean {
      return (
        isCommentAtInterfaceStart(token)
        || isCommentAtInterfaceEnd(token)
        || isCommentAtTypeStart(token)
        || isCommentAtTypeEnd(token)
        || isCommentAtEnumStart(token)
        || isCommentAtEnumEnd(token)
        || isCommentAtModuleStart(token)
        || isCommentAtModuleEnd(token)
      )
    }

    function checkForEmptyLine(
      token: Tree.Comment,
      { before, after }: { before?: boolean, after?: boolean },
    ): void {
      // the base rule handles comments away from TS constructs blocks correctly, we skip those
      if (!isCommentNearTSConstruct(token))
        return

      if (
        options.applyDefaultIgnorePatterns !== false
        && defaultIgnoreRegExp.test(token.value)
      ) {
        return
      }

      if (options.ignorePattern && customIgnoreRegExp.test(token.value))
        return

      const prevLineNum = token.loc.start.line - 1
      const nextLineNum = token.loc.end.line + 1

      // we ignore all inline comments
      if (codeAroundComment(token))
        return

      const interfaceStartAllowed
        = Boolean(options.allowInterfaceStart)
        && isCommentAtInterfaceStart(token)
      const interfaceEndAllowed
        = Boolean(options.allowInterfaceEnd) && isCommentAtInterfaceEnd(token)
      const typeStartAllowed
        = Boolean(options.allowTypeStart) && isCommentAtTypeStart(token)
      const typeEndAllowed
        = Boolean(options.allowTypeEnd) && isCommentAtTypeEnd(token)
      const enumStartAllowed
        = Boolean(options.allowEnumStart) && isCommentAtEnumStart(token)
      const enumEndAllowed
        = Boolean(options.allowEnumEnd) && isCommentAtEnumEnd(token)
      const moduleStartAllowed
        = Boolean(options.allowModuleStart) && isCommentAtModuleStart(token)
      const moduleEndAllowed
        = Boolean(options.allowModuleEnd) && isCommentAtModuleEnd(token)

      const exceptionStartAllowed
        = interfaceStartAllowed
        || typeStartAllowed
        || enumStartAllowed
        || moduleStartAllowed
      const exceptionEndAllowed
        = interfaceEndAllowed
        || typeEndAllowed
        || enumEndAllowed
        || moduleEndAllowed

      const previousTokenOrComment = sourceCode.getTokenBefore(token, {
        includeComments: true,
      })
      const nextTokenOrComment = sourceCode.getTokenAfter(token, {
        includeComments: true,
      })

      // check for newline before
      if (
        !exceptionStartAllowed
        && before
        && !commentAndEmptyLines.has(prevLineNum)
        && !(
          isCommentToken(previousTokenOrComment!)
          && isTokenOnSameLine(previousTokenOrComment, token)
        )
      ) {
        const lineStart = token.range[0] - token.loc.start.column
        const range = [lineStart, lineStart] as const

        context.report({
          node: token,
          messageId: 'before',
          fix(fixer) {
            return fixer.insertTextBeforeRange(range, '\n')
          },
        })
      }

      // check for newline after
      if (
        !exceptionEndAllowed
        && after
        && !commentAndEmptyLines.has(nextLineNum)
        && !(
          isCommentToken(nextTokenOrComment!)
          && isTokenOnSameLine(token, nextTokenOrComment)
        )
      ) {
        context.report({
          node: token,
          messageId: 'after',
          fix(fixer) {
            return fixer.insertTextAfter(token, '\n')
          },
        })
      }
    }

    /**
     * A custom report function for the baseRule to ignore false positive errors
     * caused by TS-specific codes
     */
    const customReport: typeof context.report = (descriptor) => {
      if ('node' in descriptor) {
        if (
          descriptor.node.type === AST_TOKEN_TYPES.Line
          || descriptor.node.type === AST_TOKEN_TYPES.Block
        ) {
          if (isCommentNearTSConstruct(descriptor.node))
            return
        }
      }
      return context.report(descriptor)
    }

    const customContext = { report: customReport }

    // we can't directly proxy `context` because its `report` property is non-configurable
    // and non-writable. So we proxy `customContext` and redirect all
    // property access to the original context except for `report`
    const proxiedContext = new Proxy<typeof context>(
      customContext as typeof context,
      {
        get(target, path, receiver): unknown {
          if (path !== 'report')
            return Reflect.get(context, path, receiver)

          return Reflect.get(target, path, receiver)
        },
      },
    )

    const rules = baseRule.create(proxiedContext)

    return {
      Program(node): void {
        rules.Program!(node)

        comments.forEach((token) => {
          if (token.type === AST_TOKEN_TYPES.Line) {
            if (options.beforeLineComment || options.afterLineComment) {
              checkForEmptyLine(token, {
                after: options.afterLineComment,
                before: options.beforeLineComment,
              })
            }
          }
          else if (token.type === AST_TOKEN_TYPES.Block) {
            if (options.beforeBlockComment || options.afterBlockComment) {
              checkForEmptyLine(token, {
                after: options.afterBlockComment,
                before: options.beforeBlockComment,
              })
            }
          }
        })
      },
    }
  },
})
