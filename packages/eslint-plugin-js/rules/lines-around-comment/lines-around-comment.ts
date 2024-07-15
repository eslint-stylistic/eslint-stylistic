/**
 * @fileoverview Enforces empty lines around comments.
 * @author Jamund Ferguson
 */

import type { ASTNode, NodeTypes, Token, Tree } from '@shared/types'
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { isCommentToken, isOpeningBraceToken, isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'
import { COMMENTS_IGNORE_PATTERN } from '../../utils/ast-utils'
import { createTSRule } from '../../utils'
import type { MessageIds, RuleOptions } from './types'

/**
 * Return an array with any line numbers that are empty.
 * @param lines An array of each line of the file.
 * @returns An array of line numbers.
 */
function getEmptyLineNums(lines: string[]) {
  const emptyLines = lines.map((line, i) => ({
    code: line.trim(),
    num: i + 1,
  })).filter(line => !line.code).map(line => line.num)

  return emptyLines
}

/**
 * Return an array with any line numbers that contain comments.
 * @param comments An array of comment tokens.
 * @returns An array of line numbers.
 */
function getCommentLineNums(comments: Token[]) {
  const lines: number[] = []

  comments.forEach((token) => {
    const start = token.loc.start.line
    const end = token.loc.end.line

    lines.push(start, end)
  })
  return lines
}

export default createTSRule<RuleOptions, MessageIds>({
  name: 'lines-around-comment',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require empty lines around comments',
    },
    fixable: 'whitespace',
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
    messages: {
      after: 'Expected line after comment.',
      before: 'Expected line before comment.',
    },
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

    const lines = sourceCode.lines
    const numLines = lines.length + 1
    const comments = sourceCode.getAllComments()
    const commentLines = getCommentLineNums(comments)
    const emptyLines = getEmptyLineNums(lines)
    const commentAndEmptyLines = new Set(commentLines.concat(emptyLines))

    /**
     * Returns whether or not comments are on lines starting with or ending with code
     * @param token The comment token to check.
     * @returns True if the comment is not alone.
     */
    function codeAroundComment(token: Token) {
      let currentToken: Token | null = token

      do
        currentToken = sourceCode.getTokenBefore(currentToken, { includeComments: true })
      while (currentToken && isCommentToken(currentToken))

      if (currentToken && isTokenOnSameLine(currentToken, token))
        return true

      currentToken = token
      do
        currentToken = sourceCode.getTokenAfter(currentToken, { includeComments: true })
      while (currentToken && isCommentToken(currentToken))

      if (currentToken && isTokenOnSameLine(token, currentToken))
        return true

      return false
    }

    /**
     * Returns whether or not comments are inside a node type or not.
     * @param parent The Comment parent node.
     * @param nodeType The parent type to check against.
     * @returns True if the comment is inside nodeType.
     */
    function isParentNodeType<T extends NodeTypes>(
      parent: ASTNode,
      nodeType: T,
    ): parent is Extract<ASTNode, { type: T }> {
      return parent.type === nodeType
    }

    /**
     * Returns the parent node that contains the given token.
     * @param token The token to check.
     * @returns The parent node that contains the given token.
     */
    function getParentNodeOfToken(token: Token): ASTNode | null {
      const node = sourceCode.getNodeByRangeIndex(token.range[0])

      /**
       *             For the purpose of this rule, the comment token is in a `StaticBlock` node only
       * if it's inside the braces of that `StaticBlock` node.
       *
       * Example where this function returns `null`:
       *
       *   static
       *   // comment
       *   {
       *   }
       *
       * Example where this function returns `StaticBlock` node:
       *
       *   static
       *   {
       *   // comment
       *   }
       *
       */
      if (node && node.type === AST_NODE_TYPES.StaticBlock) {
        const openingBrace = sourceCode.getFirstToken(node, { skip: 1 }) // skip the `static` token

        return openingBrace && token.range[0] >= openingBrace.range[0]
          ? node
          : null
      }

      return node
    }

    /**
     * Returns whether or not comments are at the parent start or not.
     * @param token The Comment token.
     * @param nodeType The parent type to check against.
     * @returns True if the comment is at parent start.
     */
    function isCommentAtParentStart(token: Tree.Comment, nodeType: Tree.AST_NODE_TYPES) {
      const parent = getParentNodeOfToken(token)

      if (parent && isParentNodeType(parent, nodeType)) {
        let parentStartNodeOrToken: Token | ASTNode | null = parent

        if (parent.type === AST_NODE_TYPES.StaticBlock) {
          parentStartNodeOrToken = sourceCode.getFirstToken(parent, { skip: 1 }) // opening brace of the static block
        }
        else if (parent.type === AST_NODE_TYPES.SwitchStatement) {
          parentStartNodeOrToken = sourceCode.getTokenAfter(parent.discriminant, {
            filter: isOpeningBraceToken,
          }) // opening brace of the switch statement
        }

        return !!parentStartNodeOrToken && token.loc.start.line - parentStartNodeOrToken.loc.start.line === 1
      }

      return false
    }

    /**
     * Returns whether or not comments are at the parent end or not.
     * @param token The Comment token.
     * @param nodeType The parent type to check against.
     * @returns True if the comment is at parent end.
     */
    function isCommentAtParentEnd(token: Tree.Comment, nodeType: NodeTypes) {
      const parent = getParentNodeOfToken(token)

      return !!parent && isParentNodeType(parent, nodeType)
        && parent.loc.end.line - token.loc.end.line === 1
    }

    /**
     * Returns whether or not comments are at the block start or not.
     * @param token The Comment token.
     * @returns True if the comment is at block start.
     */
    function isCommentAtBlockStart(token: Tree.Comment) {
      return (
        isCommentAtParentStart(token, AST_NODE_TYPES.ClassBody)
        || isCommentAtParentStart(token, AST_NODE_TYPES.BlockStatement)
        || isCommentAtParentStart(token, AST_NODE_TYPES.StaticBlock)
        || isCommentAtParentStart(token, AST_NODE_TYPES.SwitchCase)
        || isCommentAtParentStart(token, AST_NODE_TYPES.SwitchStatement)
      )
    }

    /**
     * Returns whether or not comments are at the block end or not.
     * @param token The Comment token.
     * @returns True if the comment is at block end.
     */
    function isCommentAtBlockEnd(token: Tree.Comment) {
      return (
        isCommentAtParentEnd(token, AST_NODE_TYPES.ClassBody)
        || isCommentAtParentEnd(token, AST_NODE_TYPES.BlockStatement)
        || isCommentAtParentEnd(token, AST_NODE_TYPES.StaticBlock)
        || isCommentAtParentEnd(token, AST_NODE_TYPES.SwitchCase)
        || isCommentAtParentEnd(token, AST_NODE_TYPES.SwitchStatement)
      )
    }

    /**
     * Returns whether or not comments are at the class start or not.
     * @param token The Comment token.
     * @returns True if the comment is at class start.
     */
    function isCommentAtClassStart(token: Tree.Comment) {
      return isCommentAtParentStart(token, AST_NODE_TYPES.ClassBody)
    }

    /**
     * Returns whether or not comments are at the class end or not.
     * @param token The Comment token.
     * @returns True if the comment is at class end.
     */
    function isCommentAtClassEnd(token: Tree.Comment) {
      return isCommentAtParentEnd(token, AST_NODE_TYPES.ClassBody)
    }

    /**
     * Returns whether or not comments are at the object start or not.
     * @param token The Comment token.
     * @returns True if the comment is at object start.
     */
    function isCommentAtObjectStart(token: Tree.Comment) {
      return isCommentAtParentStart(token, AST_NODE_TYPES.ObjectExpression)
        || isCommentAtParentStart(token, AST_NODE_TYPES.ObjectPattern)
    }

    /**
     * Returns whether or not comments are at the object end or not.
     * @param token The Comment token.
     * @returns True if the comment is at object end.
     */
    function isCommentAtObjectEnd(token: Tree.Comment) {
      return isCommentAtParentEnd(token, AST_NODE_TYPES.ObjectExpression)
        || isCommentAtParentEnd(token, AST_NODE_TYPES.ObjectPattern)
    }

    /**
     * Returns whether or not comments are at the array start or not.
     * @param token The Comment token.
     * @returns True if the comment is at array start.
     */
    function isCommentAtArrayStart(token: Tree.Comment) {
      return isCommentAtParentStart(token, AST_NODE_TYPES.ArrayExpression)
        || isCommentAtParentStart(token, AST_NODE_TYPES.ArrayPattern)
    }

    /**
     * Returns whether or not comments are at the array end or not.
     * @param token The Comment token.
     * @returns True if the comment is at array end.
     */
    function isCommentAtArrayEnd(token: Tree.Comment) {
      return isCommentAtParentEnd(token, AST_NODE_TYPES.ArrayExpression)
        || isCommentAtParentEnd(token, AST_NODE_TYPES.ArrayPattern)
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

    interface BeforAndAfter {
      before: boolean | undefined
      after: boolean | undefined
    }

    /**
     * Checks if a comment token has lines around it (ignores inline comments)
     * @param token The Comment token.
     * @param opts Options to determine the newline.
     * @param opts.after Should have a newline after this line.
     * @param opts.before Should have a newline before this line.
     */
    function checkForEmptyLine(token: Tree.Comment, { before, after }: BeforAndAfter) {
      if (
        options.applyDefaultIgnorePatterns !== false
        && defaultIgnoreRegExp.test(token.value)
      ) {
        return
      }

      if (options.ignorePattern && customIgnoreRegExp.test(token.value))
        return

      // we ignore all inline comments
      if (codeAroundComment(token))
        return

      const prevLineNum = token.loc.start.line - 1
      const nextLineNum = token.loc.end.line + 1

      const blockStartAllowed = options.allowBlockStart
        && isCommentAtBlockStart(token)
        && !(options.allowClassStart === false
        && isCommentAtClassStart(token))
      const blockEndAllowed = options.allowBlockEnd && isCommentAtBlockEnd(token) && !(options.allowClassEnd === false && isCommentAtClassEnd(token))
      const classStartAllowed = options.allowClassStart && isCommentAtClassStart(token)
      const classEndAllowed = options.allowClassEnd && isCommentAtClassEnd(token)
      const objectStartAllowed = options.allowObjectStart && isCommentAtObjectStart(token)
      const objectEndAllowed = options.allowObjectEnd && isCommentAtObjectEnd(token)
      const arrayStartAllowed = options.allowArrayStart && isCommentAtArrayStart(token)
      const arrayEndAllowed = options.allowArrayEnd && isCommentAtArrayEnd(token)
      const interfaceStartAllowed = options.allowInterfaceStart && isCommentAtInterfaceStart(token)
      const interfaceEndAllowed = options.allowInterfaceEnd && isCommentAtInterfaceEnd(token)
      const typeStartAllowed = options.allowTypeStart && isCommentAtTypeStart(token)
      const typeEndAllowed = options.allowTypeEnd && isCommentAtTypeEnd(token)
      const enumStartAllowed = options.allowEnumStart && isCommentAtEnumStart(token)
      const enumEndAllowed = options.allowEnumEnd && isCommentAtEnumEnd(token)
      const moduleStartAllowed = options.allowModuleStart && isCommentAtModuleStart(token)
      const moduleEndAllowed = options.allowModuleEnd && isCommentAtModuleEnd(token)

      const exceptionStartAllowed = blockStartAllowed
        || classStartAllowed
        || objectStartAllowed
        || arrayStartAllowed
        || interfaceStartAllowed
        || typeStartAllowed
        || enumStartAllowed
        || moduleStartAllowed
      const exceptionEndAllowed = blockEndAllowed
        || classEndAllowed
        || objectEndAllowed
        || arrayEndAllowed
        || interfaceEndAllowed
        || typeEndAllowed
        || enumEndAllowed
        || moduleEndAllowed

      // ignore top of the file and bottom of the file
      if (prevLineNum < 1)
        before = false

      if (nextLineNum >= numLines)
        after = false

      const previousTokenOrComment = sourceCode.getTokenBefore(token, { includeComments: true })
      const nextTokenOrComment = sourceCode.getTokenAfter(token, { includeComments: true })

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

    return {
      Program() {
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
          // @ts-expect-error 'Shebang' is not in the type definition
          else if (token.type === 'Shebang') {
            if (options.afterHashbangComment) {
              checkForEmptyLine(token, {
                after: options.afterHashbangComment,
                before: false,
              })
            }
          }
        })
      },
    }
  },
})
