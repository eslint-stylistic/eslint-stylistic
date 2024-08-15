/**
 * @fileoverview Rule to require or disallow newlines between statements
 * @author Toru Nagashima
 */

import type { ASTNode, RuleContext, SourceCode, Tree } from '@shared/types'
import { LINEBREAKS, STATEMENT_LIST_PARENTS, isClosingBraceToken, isDirective, isFunction, isNotSemicolonToken, isSemicolonToken, isTokenOnSameLine, skipChainExpression } from '../../../utils/ast'
import { createRule } from '../../../utils/create-rule'
import type { MessageIds, RuleOptions } from './types'

const LT = `[${Array.from(LINEBREAKS).join('')}]`
const PADDING_LINE_SEQUENCE = new RegExp(
  String.raw`^(\s*?${LT})\s*${LT}(\s*;?)$`,
  'u',
)
const CJS_EXPORT = /^(?:module\s*\.\s*)?exports(?:\s*\.|\s*\[|$)/u
const CJS_IMPORT = /^require\(/u

interface Tester {
  test: (node: ASTNode, sourceCode: SourceCode) => boolean
}

type Context = RuleContext<MessageIds, RuleOptions>

/**
 * Creates tester which check if a node starts with specific keyword.
 * @param keyword The keyword to test.
 * @returns the created tester.
 * @private
 */
function newKeywordTester(keyword: string): Tester {
  return {
    test: (node, sourceCode) => sourceCode.getFirstToken(node)?.value === keyword,
  }
}

/**
 * Creates tester which check if a node starts with specific keyword and spans a single line.
 * @param keyword The keyword to test.
 * @returns the created tester.
 * @private
 */
function newSinglelineKeywordTester(keyword: string): Tester {
  return {
    test: (node, sourceCode) => node.loc.start.line === node.loc.end.line
    && sourceCode.getFirstToken(node)?.value === keyword,
  }
}

/**
 * Creates tester which check if a node starts with specific keyword and spans multiple lines.
 * @param keyword The keyword to test.
 * @returns the created tester.
 * @private
 */
function newMultilineKeywordTester(keyword: string): Tester {
  return {
    test: (node, sourceCode) => node.loc.start.line !== node.loc.end.line
    && sourceCode.getFirstToken(node)?.value === keyword,
  }
}

/**
 * Creates tester which check if a node is specific type.
 * @param type The node type to test.
 * @returns the created tester.
 * @private
 */
function newNodeTypeTester(type: string): Tester {
  return {
    test: (node: ASTNode) =>
      node.type === type,
  }
}

/**
 * Checks the given node is an expression statement of IIFE.
 * @param node The node to check.
 * @returns `true` if the node is an expression statement of IIFE.
 * @private
 */
function isIIFEStatement(node: ASTNode): boolean {
  if (node.type === 'ExpressionStatement') {
    let call = skipChainExpression(node.expression)

    if (call.type === 'UnaryExpression')
      call = skipChainExpression(call.argument)

    return call.type === 'CallExpression' && isFunction(call.callee)
  }
  return false
}

/**
 * Checks whether the given node is a block-like statement.
 * This checks the last token of the node is the closing brace of a block.
 * @param sourceCode The source code to get tokens.
 * @param node The node to check.
 * @returns `true` if the node is a block-like statement.
 * @private
 */
function isBlockLikeStatement(sourceCode: SourceCode, node: ASTNode): boolean {
  // do-while with a block is a block-like statement.
  if (node.type === 'DoWhileStatement' && node.body.type === 'BlockStatement')
    return true

  /**
   * IIFE is a block-like statement specially from
   * JSCS#disallowPaddingNewLinesAfterBlocks.
   */
  if (isIIFEStatement(node))
    return true

  // Checks the last token is a closing brace of blocks.
  const lastToken = sourceCode.getLastToken(node, isNotSemicolonToken)
  const belongingNode = lastToken && isClosingBraceToken(lastToken)
    ? sourceCode.getNodeByRangeIndex(lastToken.range[0])
    : null

  return Boolean(belongingNode) && (
    belongingNode?.type === 'BlockStatement'
    || belongingNode?.type === 'SwitchStatement'
  )
}

/**
 * Gets the actual last token.
 *
 * If a semicolon is semicolon-less style's semicolon, this ignores it.
 * For example:
 *
 *     foo()
 *     ;[1, 2, 3].forEach(bar)
 * @param sourceCode The source code to get tokens.
 * @param node The node to get.
 * @returns The actual last token.
 * @private
 */
function getActualLastToken(sourceCode: SourceCode, node: ASTNode): Tree.Token {
  const semiToken = sourceCode.getLastToken(node)!
  const prevToken = sourceCode.getTokenBefore(semiToken)!
  const nextToken = sourceCode.getTokenAfter(semiToken)
  const isSemicolonLessStyle = Boolean(
    prevToken
    && nextToken
    && prevToken.range[0] >= node.range[0]
    && isSemicolonToken(semiToken)
    && semiToken.loc.start.line !== prevToken.loc.end.line
    && semiToken.loc.end.line === nextToken.loc.start.line,
  )

  return isSemicolonLessStyle ? prevToken : semiToken
}

/**
 * This returns the concatenation of the first 2 captured strings.
 * @param _ Unused. Whole matched string.
 * @param trailingSpaces The trailing spaces of the first line.
 * @param indentSpaces The indentation spaces of the last line.
 * @returns The concatenation of trailingSpaces and indentSpaces.
 * @private
 */
function replacerToRemovePaddingLines(_: string, trailingSpaces: string, indentSpaces: string): string {
  return trailingSpaces + indentSpaces
}

/**
 * Check and report statements for `any` configuration.
 * It does nothing.
 * @private
 */
function verifyForAny(): void {
}

/**
 * Check and report statements for `never` configuration.
 * This autofix removes blank lines between the given 2 statements.
 * However, if comments exist between 2 blank lines, it does not remove those
 * blank lines automatically.
 * @param context The rule context to report.
 * @param _ Unused. The previous node to check.
 * @param nextNode The next node to check.
 * @param paddingLines The array of token pairs that blank
 * lines exist between the pair.
 * @private
 */
function verifyForNever(context: Context, _: ASTNode, nextNode: ASTNode, paddingLines: [Tree.Token, Tree.Token][]): void {
  if (paddingLines.length === 0)
    return

  context.report({
    node: nextNode,
    messageId: 'unexpectedBlankLine',
    fix(fixer) {
      if (paddingLines.length >= 2)
        return null

      const prevToken = paddingLines[0][0]
      const nextToken = paddingLines[0][1]
      const start = prevToken.range[1]
      const end = nextToken.range[0]
      const text = context.sourceCode.text
        .slice(start, end)
        .replace(PADDING_LINE_SEQUENCE, replacerToRemovePaddingLines)

      return fixer.replaceTextRange([start, end], text)
    },
  })
}

/**
 * Check and report statements for `always` configuration.
 * This autofix inserts a blank line between the given 2 statements.
 * If the `prevNode` has trailing comments, it inserts a blank line after the
 * trailing comments.
 * @param context The rule context to report.
 * @param prevNode The previous node to check.
 * @param nextNode The next node to check.
 * @param paddingLines The array of token pairs that blank
 * lines exist between the pair.
 * @private
 */
function verifyForAlways(context: Context, prevNode: ASTNode, nextNode: ASTNode, paddingLines: [Tree.Token, Tree.Token][]): void {
  if (paddingLines.length > 0)
    return

  context.report({
    node: nextNode,
    messageId: 'expectedBlankLine',
    fix(fixer) {
      const sourceCode = context.sourceCode
      let prevToken = getActualLastToken(sourceCode, prevNode)
      const nextToken = sourceCode.getFirstTokenBetween(
        prevToken,
        nextNode,
        {
          includeComments: true,

          /**
           * Skip the trailing comments of the previous node.
           * This inserts a blank line after the last trailing comment.
           *
           * For example:
           *
           *     foo(); // trailing comment.
           *     // comment.
           *     bar();
           *
           * Get fixed to:
           *
           *     foo(); // trailing comment.
           *
           *     // comment.
           *     bar();
           * @param token The token to check.
           * @returns `true` if the token is not a trailing comment.
           * @private
           */
          filter(token) {
            if (isTokenOnSameLine(prevToken, token)) {
              prevToken = token
              return false
            }
            return true
          },
        },
      ) || nextNode
      const insertText = isTokenOnSameLine(prevToken, nextToken)
        ? '\n\n'
        : '\n'

      return fixer.insertTextAfter(prevToken, insertText)
    },
  })
}

/**
 * Types of blank lines.
 * `any`, `never`, and `always` are defined.
 * Those have `verify` method to check and report statements.
 * @private
 */
const PaddingTypes = {
  any: { verify: verifyForAny },
  never: { verify: verifyForNever },
  always: { verify: verifyForAlways },
}

/**
 * Types of statements.
 * Those have `test` method to check it matches to the given statement.
 * @private
 */
const StatementTypes = {
  '*': { test: () => true },
  'block-like': {
    test: (node, sourceCode) => isBlockLikeStatement(sourceCode, node),
  },
  'cjs-export': {
    test: (node, sourceCode) => node.type === 'ExpressionStatement'
    && node.expression.type === 'AssignmentExpression'
    && CJS_EXPORT.test(sourceCode.getText(node.expression.left)),
  },
  'cjs-import': {
    test: (node, sourceCode) => node.type === 'VariableDeclaration'
    && node.declarations.length > 0
    && Boolean(node.declarations[0].init)
    && CJS_IMPORT.test(sourceCode.getText(node.declarations[0].init!)),
  },
  'directive': {
    test: isDirective,
  },
  'expression': {
    test: node => node.type === 'ExpressionStatement' && !isDirective(node),
  },
  'iife': {
    test: isIIFEStatement,
  },
  'multiline-block-like': {
    test: (node, sourceCode) => node.loc.start.line !== node.loc.end.line
    && isBlockLikeStatement(sourceCode, node),
  },
  'multiline-expression': {
    test: node =>
      node.loc.start.line !== node.loc.end.line
      && node.type === 'ExpressionStatement'
      && !isDirective(node),
  },

  'multiline-const': newMultilineKeywordTester('const'),
  'multiline-let': newMultilineKeywordTester('let'),
  'multiline-var': newMultilineKeywordTester('var'),
  'singleline-const': newSinglelineKeywordTester('const'),
  'singleline-let': newSinglelineKeywordTester('let'),
  'singleline-var': newSinglelineKeywordTester('var'),

  'block': newNodeTypeTester('BlockStatement'),
  'empty': newNodeTypeTester('EmptyStatement'),
  'function': newNodeTypeTester('FunctionDeclaration'),

  'break': newKeywordTester('break'),
  'case': newKeywordTester('case'),
  'class': newKeywordTester('class'),
  'const': newKeywordTester('const'),
  'continue': newKeywordTester('continue'),
  'debugger': newKeywordTester('debugger'),
  'default': newKeywordTester('default'),
  'do': newKeywordTester('do'),
  'export': newKeywordTester('export'),
  'for': newKeywordTester('for'),
  'if': newKeywordTester('if'),
  'import': newKeywordTester('import'),
  'let': newKeywordTester('let'),
  'return': newKeywordTester('return'),
  'switch': newKeywordTester('switch'),
  'throw': newKeywordTester('throw'),
  'try': newKeywordTester('try'),
  'var': newKeywordTester('var'),
  'while': newKeywordTester('while'),
  'with': newKeywordTester('with'),
} satisfies Record<string, Tester>

export default createRule<RuleOptions, MessageIds>({
  name: 'padding-line-between-statements',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Require or disallow padding lines between statements',
    },

    fixable: 'whitespace',

    schema: {
      definitions: {
        paddingType: {
          type: 'string',
          enum: Object.keys(PaddingTypes),
        },
        statementType: {
          anyOf: [
            { type: 'string', enum: Object.keys(StatementTypes) },
            {
              type: 'array',
              items: { type: 'string', enum: Object.keys(StatementTypes) },
              minItems: 1,
              uniqueItems: true,
            },
          ],
        },
      },
      type: 'array',
      items: {
        type: 'object',
        properties: {
          blankLine: { $ref: '#/definitions/paddingType' },
          prev: { $ref: '#/definitions/statementType' },
          next: { $ref: '#/definitions/statementType' },
        },
        additionalProperties: false,
        required: ['blankLine', 'prev', 'next'],
      },
    },

    messages: {
      unexpectedBlankLine: 'Unexpected blank line before this statement.',
      expectedBlankLine: 'Expected blank line before this statement.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const configureList = context.options || []

    type ScopeInfo = {
      upper: ScopeInfo | null
      prevNode: null | ASTNode
    } | null | undefined

    let scopeInfo: ScopeInfo = null

    /**
     * Processes to enter to new scope.
     * This manages the current previous statement.
     * @private
     */
    function enterScope(): void {
      scopeInfo = {
        upper: scopeInfo,
        prevNode: null,
      }
    }

    /**
     * Processes to exit from the current scope.
     * @private
     */
    function exitScope(): void {
      scopeInfo = scopeInfo?.upper
    }

    /**
     * Checks whether the given node matches the given type.
     * @param node The statement node to check.
     * @param type The statement type to check.
     * @returns `true` if the statement node matched the type.
     * @private
     */
    function match(node: ASTNode, type: string | string[]): boolean {
      let innerStatementNode = node

      while (innerStatementNode.type === 'LabeledStatement')
        innerStatementNode = innerStatementNode.body

      if (Array.isArray(type))
        return type.some(match.bind(null, innerStatementNode))

      return StatementTypes[type as keyof typeof StatementTypes].test(innerStatementNode, sourceCode)
    }

    /**
     * Finds the last matched configure from configureList.
     * @param prevNode The previous statement to match.
     * @param nextNode The current statement to match.
     * @returns The tester of the last matched configure.
     * @private
     */
    function getPaddingType(prevNode: ASTNode, nextNode: ASTNode) {
      for (let i = configureList.length - 1; i >= 0; --i) {
        const configure = configureList[i]
        const matched
                    = match(prevNode, configure.prev)
                    && match(nextNode, configure.next)

        if (matched)
          return PaddingTypes[configure.blankLine]
      }
      return PaddingTypes.any
    }

    /**
     * Gets padding line sequences between the given 2 statements.
     * Comments are separators of the padding line sequences.
     * @param prevNode The previous statement to count.
     * @param nextNode The current statement to count.
     * @returns The array of token pairs.
     * @private
     */
    function getPaddingLineSequences(prevNode: ASTNode, nextNode: ASTNode): [Tree.Token, Tree.Token][] {
      const pairs: [Tree.Token, Tree.Token][] = []
      let prevToken = getActualLastToken(sourceCode, prevNode)

      if (nextNode.loc.start.line - prevToken.loc.end.line >= 2) {
        do {
          const token = sourceCode.getTokenAfter(
            prevToken,
            { includeComments: true },
          )!

          if (token.loc.start.line - prevToken.loc.end.line >= 2)
            pairs.push([prevToken, token])

          prevToken = token
        } while (prevToken.range[0] < nextNode.range[0])
      }

      return pairs
    }

    /**
     * Verify padding lines between the given node and the previous node.
     * @param node The node to verify.
     * @private
     */
    function verify(node: ASTNode): void {
      const parentType = node.parent!.type
      const validParent
                = STATEMENT_LIST_PARENTS.has(parentType)
                || parentType === 'SwitchStatement'

      if (!validParent)
        return

      // Save this node as the current previous statement.
      const prevNode = scopeInfo?.prevNode

      // Verify.
      if (prevNode) {
        const type = getPaddingType(prevNode, node)
        const paddingLines = getPaddingLineSequences(prevNode, node)

        type.verify(context, prevNode, node, paddingLines)
      }

      scopeInfo!.prevNode = node
    }

    /**
     * Verify padding lines between the given node and the previous node.
     * Then process to enter to new scope.
     * @param node The node to verify.
     * @private
     */
    function verifyThenEnterScope(node: ASTNode): void {
      verify(node)
      enterScope()
    }

    return {
      'Program': enterScope,
      'BlockStatement': enterScope,
      'SwitchStatement': enterScope,
      'StaticBlock': enterScope,
      'Program:exit': exitScope,
      'BlockStatement:exit': exitScope,
      'SwitchStatement:exit': exitScope,
      'StaticBlock:exit': exitScope,

      ':statement': verify,

      'SwitchCase': verifyThenEnterScope,
      'SwitchCase:exit': exitScope,
    }
  },
})
