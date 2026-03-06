import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { AST_NODE_TYPES, AST_TOKEN_TYPES, COMMENTS_IGNORE_PATTERN, isCommentToken, isHashbangComment, isNodeOfTypes, isOpeningBraceToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

/**
 * @returns an array with with any line numbers that are empty.
 */
function getEmptyLineNums(lines: string[]): number[] {
  const emptyLines: number[] = []

  lines.forEach((line, i) => {
    if (!line.trim())
      emptyLines.push(i + 1)
  })

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

type AllowBoundary = 'Start' | 'End'
const ALLOW_TARGETS = ['Block', 'Class', 'Object', 'Array', 'Interface', 'Type', 'Enum', 'Module'] as const
type AllowTarget = (typeof ALLOW_TARGETS)[number]
type AllowOptionName<T extends AllowTarget = AllowTarget> = `allow${T}${AllowBoundary}`

const ALLOW_NODE_TYPES: Record<AllowTarget, AST_NODE_TYPES[]> = {
  Block: [
    AST_NODE_TYPES.ClassBody,
    AST_NODE_TYPES.BlockStatement,
    AST_NODE_TYPES.StaticBlock,
    AST_NODE_TYPES.SwitchCase,
    AST_NODE_TYPES.SwitchStatement,
  ],
  Class: [
    AST_NODE_TYPES.ClassBody,
  ],
  Object: [
    AST_NODE_TYPES.ObjectExpression,
    AST_NODE_TYPES.ObjectPattern,
  ],
  Array: [
    AST_NODE_TYPES.ArrayExpression,
    AST_NODE_TYPES.ArrayPattern,
  ],
  Interface: [
    AST_NODE_TYPES.TSInterfaceBody,
  ],
  Type: [
    AST_NODE_TYPES.TSTypeLiteral,
  ],
  Enum: [
    AST_NODE_TYPES.TSEnumBody,
    AST_NODE_TYPES.TSEnumDeclaration,
  ],
  Module: [
    AST_NODE_TYPES.TSModuleBlock,
  ],
}

function getAllowOptionName<T extends AllowTarget>(
  target: T,
  boundary: AllowBoundary,
): AllowOptionName<T> {
  return `allow${target}${boundary}`
}

const ALLOW_SCHEMA_PROPERTIES = Object.fromEntries(
  ALLOW_TARGETS.flatMap(target => [
    [getAllowOptionName(target, 'Start'), { type: 'boolean' }],
    [getAllowOptionName(target, 'End'), { type: 'boolean' }],
  ]),
)

export default createRule<RuleOptions, MessageIds>({
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
          },
          afterBlockComment: {
            type: 'boolean',
          },
          beforeLineComment: {
            type: 'boolean',
          },
          afterLineComment: {
            type: 'boolean',
          },
          ...ALLOW_SCHEMA_PROPERTIES,
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
    defaultOptions: [
      {
        beforeBlockComment: true,
      },
    ],
    messages: {
      after: 'Expected line after comment.',
      before: 'Expected line before comment.',
    },
  },
  create(context, [options]) {
    const normalizedOptions = options!
    const defaultIgnoreRegExp = COMMENTS_IGNORE_PATTERN
    const {
      beforeBlockComment,
      afterBlockComment,
      beforeLineComment,
      afterLineComment,
      afterHashbangComment,
      applyDefaultIgnorePatterns,
      ignorePattern = '',
    } = normalizedOptions
    const customIgnoreRegExp = ignorePattern ? new RegExp(ignorePattern, 'u') : null

    const sourceCode = context.sourceCode
    const comments = sourceCode.getAllComments()

    const lines = sourceCode.lines
    const numLines = lines.length + 1
    const commentLines = getCommentLineNums(comments)
    const emptyLines = getEmptyLineNums(lines)
    const commentAndEmptyLines = new Set(commentLines.concat(emptyLines))

    /**
     * @returns whether comments are on lines starting with or ending with code.
     */
    function codeAroundComment(token: Token): boolean {
      let currentToken: Token | null = token

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
     * @returns the parent node that contains the given token.
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
      if (node && node.type === 'StaticBlock') {
        const openingBrace = sourceCode.getFirstToken(node, { skip: 1 }) // skip the `static` token

        return openingBrace && token.range[0] >= openingBrace.range[0]
          ? node
          : null
      }

      return node
    }

    /**
     * @returns whether comments are at the parent start.
     */
    function isCommentAtParentStart(
      token: Token,
      nodeTypes: AST_NODE_TYPES[],
    ): boolean {
      const parent = getParentNodeOfToken(token)

      if (parent && isNodeOfTypes(nodeTypes)(parent)) {
        let parentStartNodeOrToken: Token | ASTNode | null = parent

        if (parent.type === 'StaticBlock') {
          parentStartNodeOrToken = sourceCode.getFirstToken(parent, { skip: 1 }) // opening brace of the static block
        }
        else if (parent.type === 'SwitchStatement') {
          parentStartNodeOrToken = sourceCode.getTokenAfter(parent.discriminant, {
            filter: isOpeningBraceToken,
          }) // opening brace of the switch statement
        }
        return !!parentStartNodeOrToken
          && token.loc.start.line - parentStartNodeOrToken.loc.start.line === 1
      }

      return false
    }

    /**
     * @returns whether comments are at the parent end.
     */
    function isCommentAtParentEnd(
      token: Token,
      nodeTypes: Tree.AST_NODE_TYPES[],
    ): boolean {
      const parent = getParentNodeOfToken(token)

      return (
        !!parent
        && isNodeOfTypes(nodeTypes)(parent)
        && parent.loc.end.line - token.loc.end.line === 1
      )
    }

    function isCommentAtBoundary(
      token: Tree.Comment,
      target: AllowTarget,
      boundary: AllowBoundary,
    ): boolean {
      const boundaryChecker = boundary === 'Start'
        ? isCommentAtParentStart
        : isCommentAtParentEnd

      return boundaryChecker(token, ALLOW_NODE_TYPES[target])
    }

    function isExceptionAllowed(token: Tree.Comment, boundary: AllowBoundary): boolean {
      const blockOptionName = getAllowOptionName('Block', boundary)
      const classOptionName = getAllowOptionName('Class', boundary)

      if (
        normalizedOptions[blockOptionName]
        && isCommentAtBoundary(token, 'Block', boundary)
        && !(
          normalizedOptions[classOptionName] === false
          && isCommentAtBoundary(token, 'Class', boundary)
        )
      ) {
        return true
      }

      return ALLOW_TARGETS.some((target) => {
        if (target === 'Block')
          return false

        const optionName = getAllowOptionName(target, boundary)
        return Boolean(normalizedOptions[optionName]) && isCommentAtBoundary(token, target, boundary)
      })
    }

    function checkForEmptyLine(
      token: Tree.Comment,
      { before, after }: { before?: boolean, after?: boolean },
    ): void {
      if (
        applyDefaultIgnorePatterns !== false
        && defaultIgnoreRegExp.test(token.value)
      ) {
        return
      }

      if (customIgnoreRegExp?.test(token.value))
        return

      const prevLineNum = token.loc.start.line - 1
      const nextLineNum = token.loc.end.line + 1

      // ignore top of the file and bottom of the file
      if (prevLineNum < 1)
        before = false

      if (nextLineNum >= numLines)
        after = false

      // we ignore all inline comments
      if (codeAroundComment(token))
        return

      const exceptionStartAllowed = isExceptionAllowed(token, 'Start')
      const exceptionEndAllowed = isExceptionAllowed(token, 'End')

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

    return {
      Program() {
        comments.forEach((token) => {
          if (token.type === AST_TOKEN_TYPES.Line) {
            if (beforeLineComment || afterLineComment) {
              checkForEmptyLine(token, {
                after: afterLineComment,
                before: beforeLineComment,
              })
            }
          }
          else if (token.type === AST_TOKEN_TYPES.Block) {
            if (beforeBlockComment || afterBlockComment) {
              checkForEmptyLine(token, {
                after: afterBlockComment,
                before: beforeBlockComment,
              })
            }
          }
          else if (isHashbangComment(token)) {
            if (afterHashbangComment) {
              checkForEmptyLine(token, {
                after: afterHashbangComment,
                before: false,
              })
            }
          }
        })
      },
    }
  },
})
