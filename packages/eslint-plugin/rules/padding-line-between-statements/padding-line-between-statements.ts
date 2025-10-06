import type { ASTNode, RuleContext, SourceCode, Token } from '#types'
import {
  AST_NODE_TYPES,
  isClosingBraceToken,
  isFunction,
  isNotSemicolonToken,
  isParenthesized,
  isSemicolonToken,
  isSingleLine,
  isTokenOnSameLine,
  isTopLevelExpressionStatement,
  LINEBREAKS,
  skipChainExpression,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

const CJS_EXPORT = /^(?:module\s*\.\s*)?exports(?:\s*\.|\s*\[|$)/u
const CJS_IMPORT = /^require\(/u

/**
 * This rule is a replica of padding-line-between-statements.
 *
 * Ideally we would want to extend the rule support typescript specific support.
 * But since not all the state is exposed by the eslint and eslint has frozen stylistic rules,
 * (see - https://eslint.org/blog/2020/05/changes-to-rules-policies for details.)
 * we are forced to re-implement the rule here.
 *
 * We have tried to keep the implementation as close as possible to the eslint implementation, to make
 * patching easier for future contributors.
 *
 * Reference rule - https://github.com/eslint/eslint/blob/main/lib/rules/padding-line-between-statements.js
 */

type NodeTest = (
  node: ASTNode,
  sourceCode: SourceCode,
) => boolean

interface NodeTestObject {
  test: NodeTest
}

interface PaddingOption {
  blankLine: keyof typeof PaddingTypes
  prev: string[] | string
  next: string[] | string
}

type MessageIds = 'expectedBlankLine' | 'unexpectedBlankLine'
type Options = PaddingOption[]

const LT = `[${Array.from(LINEBREAKS).join('')}]`
const PADDING_LINE_SEQUENCE = new RegExp(
  String.raw`^(\s*?${LT})\s*${LT}(\s*;?)$`,
  'u',
)

/**
 * Creates tester which check if a node starts with specific keyword with the
 * appropriate AST_NODE_TYPES.
 * @param keyword The keyword to test.
 * @returns the created tester.
 * @private
 */
function newKeywordTester(
  type: AST_NODE_TYPES | AST_NODE_TYPES[],
  keyword: string,
): NodeTestObject {
  return {
    test(node, sourceCode): boolean {
      const isSameKeyword = sourceCode.getFirstToken(node)?.value === keyword
      const isSameType = Array.isArray(type)
        ? type.includes(node.type)
        : type === node.type

      return isSameKeyword && isSameType
    },
  }
}

/**
 * Creates tester which check if a node is specific type.
 * @param type The node type to test.
 * @returns the created tester.
 * @private
 */
function newNodeTypeTester(type: AST_NODE_TYPES): NodeTestObject {
  return {
    test: (node): boolean => node.type === type,
  }
}

/**
 * Checks the given node is an expression statement of IIFE.
 * @param node The node to check.
 * @returns `true` if the node is an expression statement of IIFE.
 * @private
 */
function isIIFEStatement(node: ASTNode): boolean {
  if (node.type === AST_NODE_TYPES.ExpressionStatement) {
    let expression = skipChainExpression(node.expression)
    if (expression.type === AST_NODE_TYPES.UnaryExpression)
      expression = skipChainExpression(expression.argument)

    if (expression.type === AST_NODE_TYPES.CallExpression) {
      let node: ASTNode = expression.callee
      while (node.type === AST_NODE_TYPES.SequenceExpression)
        node = node.expressions[node.expressions.length - 1]

      return isFunction(node)
    }
  }
  return false
}

/**
 * Checks the given node is a CommonJS require statement
 * @param node The node to check.
 * @returns `true` if the node is a CommonJS require statement.
 * @private
 */
function isCJSRequire(node: ASTNode): boolean {
  if (node.type === AST_NODE_TYPES.VariableDeclaration) {
    const declaration = node.declarations[0]
    if (declaration?.init) {
      let call = declaration?.init
      while (call.type === AST_NODE_TYPES.MemberExpression)
        call = call.object

      if (
        call.type === AST_NODE_TYPES.CallExpression
        && call.callee.type === AST_NODE_TYPES.Identifier
      ) {
        return call.callee.name === 'require'
      }
    }
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
function isBlockLikeStatement(
  node: ASTNode,
  sourceCode: SourceCode,
): boolean {
  // do-while with a block is a block-like statement.
  if (
    node.type === AST_NODE_TYPES.DoWhileStatement
    && node.body.type === AST_NODE_TYPES.BlockStatement
  ) {
    return true
  }

  /**
   * IIFE is a block-like statement specially from
   * JSCS#disallowPaddingNewLinesAfterBlocks.
   */
  if (isIIFEStatement(node))
    return true

  // Checks the last token is a closing brace of blocks.
  const lastToken = sourceCode.getLastToken(node, isNotSemicolonToken)
  const belongingNode
    = lastToken && isClosingBraceToken(lastToken)
      ? sourceCode.getNodeByRangeIndex(lastToken.range[0])
      : null

  return (
    !!belongingNode
    && (belongingNode.type === AST_NODE_TYPES.BlockStatement
      || belongingNode.type === AST_NODE_TYPES.SwitchStatement)
  )
}

/**
 * Check whether the given node is a directive or not.
 * @param node The node to check.
 * @param sourceCode The source code object to get tokens.
 * @returns `true` if the node is a directive.
 */
function isDirective(
  node: ASTNode,
  sourceCode: SourceCode,
): boolean {
  return (
    isTopLevelExpressionStatement(node)
    && node.expression.type === AST_NODE_TYPES.Literal
    && typeof node.expression.value === 'string'
    && !isParenthesized(node.expression, sourceCode)
  )
}

/**
 * Check whether the given node is a part of directive prologue or not.
 * @param node The node to check.
 * @param sourceCode The source code object to get tokens.
 * @returns `true` if the node is a part of directive prologue.
 */
function isDirectivePrologue(
  node: ASTNode,
  sourceCode: SourceCode,
): boolean {
  if (
    isDirective(node, sourceCode)
    && node.parent
    && 'body' in node.parent
    && Array.isArray(node.parent.body)
  ) {
    for (const sibling of node.parent.body) {
      if (sibling === node)
        break

      if (!isDirective(sibling, sourceCode))
        return false
    }
    return true
  }
  return false
}

/**
 * Checks the given node is a CommonJS export statement
 * @param node The node to check.
 * @returns `true` if the node is a CommonJS export statement.
 * @private
 */
function isCJSExport(node: ASTNode): boolean {
  if (node.type === AST_NODE_TYPES.ExpressionStatement) {
    const expression = node.expression
    if (expression.type === AST_NODE_TYPES.AssignmentExpression) {
      let left = expression.left
      if (left.type === AST_NODE_TYPES.MemberExpression) {
        while (left.object.type === AST_NODE_TYPES.MemberExpression)
          left = left.object

        return (
          left.object.type === AST_NODE_TYPES.Identifier
          && (left.object.name === 'exports'
            || (left.object.name === 'module'
              && left.property.type === AST_NODE_TYPES.Identifier
              && left.property.name === 'exports'))
        )
      }
    }
  }
  return false
}

/**
 * Check whether the given node is an expression
 * @param node The node to check.
 * @param sourceCode The source code object to get tokens.
 * @returns `true` if the node is an expression
 */
function isExpression(
  node: ASTNode,
  sourceCode: SourceCode,
): boolean {
  return (
    node.type === AST_NODE_TYPES.ExpressionStatement
    && !isDirectivePrologue(node, sourceCode)
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
function getActualLastToken(
  node: ASTNode,
  sourceCode: SourceCode,
): Token | null {
  const semiToken = sourceCode.getLastToken(node)!
  const prevToken = sourceCode.getTokenBefore(semiToken)
  const nextToken = sourceCode.getTokenAfter(semiToken)
  const isSemicolonLessStyle
    = prevToken
      && nextToken
      && prevToken.range[0] >= node.range[0]
      && isSemicolonToken(semiToken)
      && !isTokenOnSameLine(prevToken, semiToken)
      && isTokenOnSameLine(semiToken, nextToken)

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
function replacerToRemovePaddingLines(
  _: string,
  trailingSpaces: string,
  indentSpaces: string,
): string {
  return trailingSpaces + indentSpaces
}

/**
 * Check and report statements for `any` configuration.
 * It does nothing.
 *
 * @private
 */
function verifyForAny(): void {
  // Empty
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
 *
 * @private
 */
function verifyForNever(
  context: RuleContext<MessageIds, Options>,
  _: ASTNode,
  nextNode: ASTNode,
  paddingLines: [Token, Token][],
): void {
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
      const text = context
        .sourceCode
        .text
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
 *
 * @private
 */
function verifyForAlways(
  context: RuleContext<MessageIds, Options>,
  prevNode: ASTNode,
  nextNode: ASTNode,
  paddingLines: [Token, Token][],
): void {
  if (paddingLines.length > 0)
    return

  context.report({
    node: nextNode,
    messageId: 'expectedBlankLine',
    fix(fixer) {
      const sourceCode = context.sourceCode
      let prevToken = getActualLastToken(prevNode, sourceCode)!
      const nextToken
        = sourceCode.getFirstTokenBetween(prevToken, nextNode, {
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
        })! || nextNode
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

const MaybeMultilineStatementType: Record<string, NodeTestObject> = {
  'block-like': { test: isBlockLikeStatement },
  'expression': { test: isExpression },
  'return': newKeywordTester(AST_NODE_TYPES.ReturnStatement, 'return'),
  'export': newKeywordTester(
    [
      AST_NODE_TYPES.ExportAllDeclaration,
      AST_NODE_TYPES.ExportDefaultDeclaration,
      AST_NODE_TYPES.ExportNamedDeclaration,
    ],
    'export',
  ),
  'var': newKeywordTester(AST_NODE_TYPES.VariableDeclaration, 'var'),
  'let': newKeywordTester(AST_NODE_TYPES.VariableDeclaration, 'let'),
  'const': newKeywordTester(AST_NODE_TYPES.VariableDeclaration, 'const'),
  'using': {
    test: node => node.type === 'VariableDeclaration'
      && (node.kind === 'using' || node.kind === 'await using'),
  },
  'type': newKeywordTester(AST_NODE_TYPES.TSTypeAliasDeclaration, 'type'),
}

/**
 * Types of statements.
 * Those have `test` method to check it matches to the given statement.
 * @private
 */
const StatementTypes: Record<string, NodeTestObject> = {
  '*': { test: (): boolean => true },
  'exports': { test: isCJSExport },
  'require': { test: isCJSRequire },
  'directive': { test: isDirectivePrologue },
  'iife': { test: isIIFEStatement },

  'block': newNodeTypeTester(AST_NODE_TYPES.BlockStatement),
  'empty': newNodeTypeTester(AST_NODE_TYPES.EmptyStatement),
  'function': newNodeTypeTester(AST_NODE_TYPES.FunctionDeclaration),
  'ts-method': newNodeTypeTester(AST_NODE_TYPES.TSMethodSignature),

  'break': newKeywordTester(AST_NODE_TYPES.BreakStatement, 'break'),
  'case': newKeywordTester(AST_NODE_TYPES.SwitchCase, 'case'),
  'class': newKeywordTester(AST_NODE_TYPES.ClassDeclaration, 'class'),
  'continue': newKeywordTester(AST_NODE_TYPES.ContinueStatement, 'continue'),
  'debugger': newKeywordTester(AST_NODE_TYPES.DebuggerStatement, 'debugger'),
  'default': newKeywordTester(
    [AST_NODE_TYPES.SwitchCase, AST_NODE_TYPES.ExportDefaultDeclaration],
    'default',
  ),
  'do': newKeywordTester(AST_NODE_TYPES.DoWhileStatement, 'do'),
  'for': newKeywordTester(
    [
      AST_NODE_TYPES.ForStatement,
      AST_NODE_TYPES.ForInStatement,
      AST_NODE_TYPES.ForOfStatement,
    ],
    'for',
  ),
  'if': newKeywordTester(AST_NODE_TYPES.IfStatement, 'if'),
  'import': newKeywordTester(AST_NODE_TYPES.ImportDeclaration, 'import'),
  'switch': newKeywordTester(AST_NODE_TYPES.SwitchStatement, 'switch'),
  'throw': newKeywordTester(AST_NODE_TYPES.ThrowStatement, 'throw'),
  'try': newKeywordTester(AST_NODE_TYPES.TryStatement, 'try'),
  'while': newKeywordTester(
    [AST_NODE_TYPES.WhileStatement, AST_NODE_TYPES.DoWhileStatement],
    'while',
  ),
  'with': newKeywordTester(AST_NODE_TYPES.WithStatement, 'with'),

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

  'enum': newKeywordTester(
    AST_NODE_TYPES.TSEnumDeclaration,
    'enum',
  ),
  'interface': newKeywordTester(
    AST_NODE_TYPES.TSInterfaceDeclaration,
    'interface',
  ),
  'function-overload': newNodeTypeTester(AST_NODE_TYPES.TSDeclareFunction),
  ...Object.fromEntries(
    Object.entries(MaybeMultilineStatementType)
      .flatMap(([key, value]) => [
        [key, value],
        [
          `singleline-${key}`,
          {
            ...value,
            test: (node, sourceCode) => value.test(node, sourceCode) && isSingleLine(node),
          },
        ],
        [
          `multiline-${key}`,
          {
            ...value,
            test: (node, sourceCode) => value.test(node, sourceCode) && !isSingleLine(node),
          },
        ],
      ],
      ),
  ),
}

export default createRule<Options, MessageIds>({
  name: 'padding-line-between-statements',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow padding lines between statements',
    },
    fixable: 'whitespace',
    hasSuggestions: false,
    // This is intentionally an array schema as you can pass 0..n config objects
    schema: {
      $defs: {
        paddingType: {
          type: 'string',
          enum: Object.keys(PaddingTypes),
        },
        statementType: {
          type: 'string',
          enum: Object.keys(StatementTypes),
        },
        statementOption: {
          anyOf: [
            { $ref: '#/$defs/statementType' },
            {
              type: 'array',
              items: { $ref: '#/$defs/statementType' },
              minItems: 1,
              uniqueItems: true,
              additionalItems: false,
            },
          ],
        },
      },
      type: 'array',
      additionalItems: false,
      items: {
        type: 'object',
        properties: {
          blankLine: { $ref: '#/$defs/paddingType' },
          prev: { $ref: '#/$defs/statementOption' },
          next: { $ref: '#/$defs/statementOption' },
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
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode

    const configureList = context.options || []

    type Scope = {
      upper: Scope
      prevNode: ASTNode | null
    } | null

    let scopeInfo: Scope = null

    /**
     * Processes to enter to new scope.
     * This manages the current previous statement.
     *
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
     *
     * @private
     */
    function exitScope(): void {
      if (scopeInfo)
        scopeInfo = scopeInfo.upper
    }

    /**
     * Checks whether the given node matches the given type.
     * @param node The statement node to check.
     * @param type The statement type to check.
     * @returns `true` if the statement node matched the type.
     * @private
     */
    function match(node: ASTNode, type: string[] | string): boolean {
      let innerStatementNode = node

      while (innerStatementNode.type === AST_NODE_TYPES.LabeledStatement)
        innerStatementNode = innerStatementNode.body

      if (Array.isArray(type))
        return type.some(match.bind(null, innerStatementNode))

      return StatementTypes[type].test(innerStatementNode, sourceCode)
    }

    /**
     * Finds the last matched configure from configureList.
     * @param prevNode The previous statement to match.
     * @param nextNode The current statement to match.
     * @returns The tester of the last matched configure.
     * @private
     */
    function getPaddingType(
      prevNode: ASTNode,
      nextNode: ASTNode,
    ): (typeof PaddingTypes)[keyof typeof PaddingTypes] {
      for (let i = configureList.length - 1; i >= 0; --i) {
        const configure = configureList[i]
        if (
          match(prevNode, configure.prev)
          && match(nextNode, configure.next)
        ) {
          return PaddingTypes[configure.blankLine]
        }
      }
      return PaddingTypes.any
    }

    /**
     * Gets padding line sequences between the given 2 statements.
     * Comments are separators of the padding line sequences.
     * @paramprevNode The previous statement to count.
     * @paramnextNode The current statement to count.
     * @returns The array of token pairs.
     * @private
     */
    function getPaddingLineSequences(
      prevNode: ASTNode,
      nextNode: ASTNode,
    ): [Token, Token][] {
      const pairs: [Token, Token][] = []
      let prevToken: Token = getActualLastToken(prevNode, sourceCode)!

      if (nextNode.loc.start.line - prevToken.loc.end.line >= 2) {
        do {
          const token: Token = sourceCode.getTokenAfter(prevToken, {
            includeComments: true,
          })!

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
     *
     * @private
     */
    function verify(node: ASTNode): void {
      if (
        !node.parent
        || ![
          AST_NODE_TYPES.BlockStatement,
          AST_NODE_TYPES.Program,
          AST_NODE_TYPES.StaticBlock,
          AST_NODE_TYPES.SwitchCase,
          AST_NODE_TYPES.SwitchStatement,
          AST_NODE_TYPES.TSInterfaceBody,
          AST_NODE_TYPES.TSModuleBlock,
          AST_NODE_TYPES.TSTypeLiteral,
        ].includes(node.parent.type)
      ) {
        return
      }

      // Save this node as the current previous statement.
      const prevNode = scopeInfo!.prevNode

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
     *
     * @private
     */
    function verifyThenEnterScope(node: ASTNode): void {
      verify(node)
      enterScope()
    }

    return {
      'Program': enterScope,
      'Program:exit': exitScope,
      'BlockStatement': enterScope,
      'BlockStatement:exit': exitScope,
      'SwitchStatement': enterScope,
      'SwitchStatement:exit': exitScope,
      'SwitchCase': verifyThenEnterScope,
      'SwitchCase:exit': exitScope,
      'StaticBlock': enterScope,
      'StaticBlock:exit': exitScope,

      'TSInterfaceBody': enterScope,
      'TSInterfaceBody:exit': exitScope,
      'TSModuleBlock': enterScope,
      'TSModuleBlock:exit': exitScope,
      'TSTypeLiteral': enterScope,
      'TSTypeLiteral:exit': exitScope,
      'TSDeclareFunction': verifyThenEnterScope,
      'TSDeclareFunction:exit': exitScope,
      'TSMethodSignature': verifyThenEnterScope,
      'TSMethodSignature:exit': exitScope,

      ':statement': verify,
    }
  },
})
