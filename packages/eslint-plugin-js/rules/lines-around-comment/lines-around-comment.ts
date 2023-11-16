/**
 * @fileoverview Enforces empty lines around comments.
 * @author Jamund Ferguson
 */

import { COMMENTS_IGNORE_PATTERN, isCommentToken, isOpeningBraceToken, isTokenOnSameLine } from '../../utils/ast-utils'
import { createRule } from '../../utils/createRule'
import type { ASTNode, NodeTypes, Token } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

/**
 * Return an array with any line numbers that are empty.
 * @param {Array} lines An array of each line of the file.
 * @returns {Array} An array of line numbers.
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
 * @param {Array} comments An array of comment tokens.
 * @returns {Array} An array of line numbers.
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

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Require empty lines around comments',
      url: 'https://eslint.style/rules/js/lines-around-comment',
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
          ignorePattern: {
            type: 'string',
          },
          applyDefaultIgnorePatterns: {
            type: 'boolean',
          },
          afterHashbangComment: {
            type: 'boolean',
            default: false,
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

  create(context) {
    const options = Object.assign({}, context.options[0])
    const ignorePattern = options.ignorePattern
    const defaultIgnoreRegExp = COMMENTS_IGNORE_PATTERN
    const customIgnoreRegExp = ignorePattern && new RegExp(ignorePattern, 'u')
    const applyDefaultIgnorePatterns = options.applyDefaultIgnorePatterns !== false

    options.beforeBlockComment = typeof options.beforeBlockComment !== 'undefined' ? options.beforeBlockComment : true

    const sourceCode = context.sourceCode

    const lines = sourceCode.lines
    const numLines = lines.length + 1
    const comments = sourceCode.getAllComments()
    const commentLines = getCommentLineNums(comments)
    const emptyLines = getEmptyLineNums(lines)
    const commentAndEmptyLines = new Set(commentLines.concat(emptyLines))

    /**
     * Returns whether or not comments are on lines starting with or ending with code
     * @param {token} token The comment token to check.
     * @returns {boolean} True if the comment is not alone.
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
     * @param {ASTNode} parent The Comment parent node.
     * @param {string} nodeType The parent type to check against.
     * @returns {boolean} True if the comment is inside nodeType.
     */
    function isParentNodeType<T extends NodeTypes>(
      parent: ASTNode,
      nodeType: T,
    ): parent is Extract<ASTNode, { type: T }> {
      return parent.type === nodeType
    }

    /**
     * Returns the parent node that contains the given token.
     * @param {token} token The token to check.
     * @returns {ASTNode|null} The parent node that contains the given token.
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
     * Returns whether or not comments are at the parent start or not.
     * @param {token} token The Comment token.
     * @param {string} nodeType The parent type to check against.
     * @returns {boolean} True if the comment is at parent start.
     */
    function isCommentAtParentStart(token: Token, nodeType: NodeTypes) {
      const parent = getParentNodeOfToken(token)

      if (parent && isParentNodeType(parent, nodeType)) {
        let parentStartNodeOrToken: Token | ASTNode | null = parent

        if (parent.type === 'StaticBlock') {
          parentStartNodeOrToken = sourceCode.getFirstToken(parent, { skip: 1 }) // opening brace of the static block
        }
        else if (parent.type === 'SwitchStatement') {
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
     * @param {token} token The Comment token.
     * @param {string} nodeType The parent type to check against.
     * @returns {boolean} True if the comment is at parent end.
     */
    function isCommentAtParentEnd(token: Token, nodeType: NodeTypes) {
      const parent = getParentNodeOfToken(token)

      return !!parent && isParentNodeType(parent, nodeType)
        && parent.loc.end.line - token.loc.end.line === 1
    }

    /**
     * Returns whether or not comments are at the block start or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at block start.
     */
    function isCommentAtBlockStart(token: Token) {
      return (
        isCommentAtParentStart(token, 'ClassBody')
        || isCommentAtParentStart(token, 'BlockStatement')
        || isCommentAtParentStart(token, 'StaticBlock')
        || isCommentAtParentStart(token, 'SwitchCase')
        || isCommentAtParentStart(token, 'SwitchStatement')
      )
    }

    /**
     * Returns whether or not comments are at the block end or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at block end.
     */
    function isCommentAtBlockEnd(token: Token) {
      return (
        isCommentAtParentEnd(token, 'ClassBody')
        || isCommentAtParentEnd(token, 'BlockStatement')
        || isCommentAtParentEnd(token, 'StaticBlock')
        || isCommentAtParentEnd(token, 'SwitchCase')
        || isCommentAtParentEnd(token, 'SwitchStatement')
      )
    }

    /**
     * Returns whether or not comments are at the class start or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at class start.
     */
    function isCommentAtClassStart(token: Token) {
      return isCommentAtParentStart(token, 'ClassBody')
    }

    /**
     * Returns whether or not comments are at the class end or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at class end.
     */
    function isCommentAtClassEnd(token: Token) {
      return isCommentAtParentEnd(token, 'ClassBody')
    }

    /**
     * Returns whether or not comments are at the object start or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at object start.
     */
    function isCommentAtObjectStart(token: Token) {
      return isCommentAtParentStart(token, 'ObjectExpression')
        || isCommentAtParentStart(token, 'ObjectPattern')
    }

    /**
     * Returns whether or not comments are at the object end or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at object end.
     */
    function isCommentAtObjectEnd(token: Token) {
      return isCommentAtParentEnd(token, 'ObjectExpression')
        || isCommentAtParentEnd(token, 'ObjectPattern')
    }

    /**
     * Returns whether or not comments are at the array start or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at array start.
     */
    function isCommentAtArrayStart(token: Token) {
      return isCommentAtParentStart(token, 'ArrayExpression')
        || isCommentAtParentStart(token, 'ArrayPattern')
    }

    /**
     * Returns whether or not comments are at the array end or not.
     * @param {token} token The Comment token.
     * @returns {boolean} True if the comment is at array end.
     */
    function isCommentAtArrayEnd(token: Token) {
      return isCommentAtParentEnd(token, 'ArrayExpression')
        || isCommentAtParentEnd(token, 'ArrayPattern')
    }

    interface BeforAndAfter {
      before: boolean | undefined
      after: boolean | undefined
    }

    /**
     * Checks if a comment token has lines around it (ignores inline comments)
     * @param {token} token The Comment token.
     * @param {object} opts Options to determine the newline.
     * @param {boolean} opts.after Should have a newline after this line.
     * @param {boolean} opts.before Should have a newline before this line.
     * @returns {void}
     */
    function checkForEmptyLine(token: Token, opts: BeforAndAfter) {
      if (applyDefaultIgnorePatterns && defaultIgnoreRegExp.test(token.value))
        return

      if (customIgnoreRegExp && customIgnoreRegExp.test(token.value))
        return

      let after = opts.after
      let before = opts.before

      const prevLineNum = token.loc.start.line - 1
      const nextLineNum = token.loc.end.line + 1
      const commentIsNotAlone = codeAroundComment(token)

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

      const exceptionStartAllowed = blockStartAllowed || classStartAllowed || objectStartAllowed || arrayStartAllowed
      const exceptionEndAllowed = blockEndAllowed || classEndAllowed || objectEndAllowed || arrayEndAllowed

      // ignore top of the file and bottom of the file
      if (prevLineNum < 1)
        before = false

      if (nextLineNum >= numLines)
        after = false

      // we ignore all inline comments
      if (commentIsNotAlone)
        return

      const previousTokenOrComment = sourceCode.getTokenBefore(token, { includeComments: true })
      const nextTokenOrComment = sourceCode.getTokenAfter(token, { includeComments: true })

      // check for newline before
      if (!exceptionStartAllowed && before && !commentAndEmptyLines.has(prevLineNum)
        && !(isCommentToken(previousTokenOrComment) && isTokenOnSameLine(previousTokenOrComment, token))) {
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
      if (!exceptionEndAllowed && after && !commentAndEmptyLines.has(nextLineNum)
        && !(isCommentToken(nextTokenOrComment) && isTokenOnSameLine(token, nextTokenOrComment))) {
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
          if (token.type === 'Line') {
            if (options.beforeLineComment || options.afterLineComment) {
              checkForEmptyLine(token, {
                after: options.afterLineComment,
                before: options.beforeLineComment,
              })
            }
          }
          else if (token.type === 'Block') {
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
