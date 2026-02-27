/**
 * Note this file is rather type-unsafe in its current state.
 * This is due to some really funky type conversions between different node types.
 * This is done intentionally based on the internal implementation of the base indent rule.
 */

import type { ASTNode, JSONSchema, NodeTypes, RuleFunction, RuleListener, SourceCode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  isClosingBraceToken as _isClosingBraceToken,
  isClosingBracketToken as _isClosingBracketToken,
  isClosingParenToken as _isClosingParenToken,
  isColonToken as _isColonToken,
  isCommentToken as _isCommentToken,
  isNotClosingParenToken as _isNotClosingParenToken,
  isNotOpeningParenToken as _isNotOpeningParenToken,
  isNotSemicolonToken as _isNotSemicolonToken,
  isOpeningBraceToken as _isOpeningBraceToken,
  isOpeningBracketToken as _isOpeningBracketToken,
  isOpeningParenToken as _isOpeningParenToken,
  isOptionalChainPunctuator as _isOptionalChainPunctuator,
  isSemicolonToken as _isSemicolonToken,
  isTokenOnSameLine as _isTokenOnSameLine,
  AST_NODE_TYPES,
  createGlobalLinebreakMatcher,
  getCommentsBetween,
  isEqToken,
  isQuestionToken,
  isSingleLine,
  skipChainExpression,
  STATEMENT_LIST_PARENTS,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { isESTreeSourceCode } from '#utils/eslint-core'
import { warnDeprecatedOptions } from '#utils/index'

const isClosingBraceToken = _isClosingBraceToken
const isClosingBracketToken = _isClosingBracketToken
const isClosingParenToken = _isClosingParenToken
const isColonToken = _isColonToken
const isCommentToken = _isCommentToken
const isNotClosingParenToken = _isNotClosingParenToken
const isNotOpeningParenToken = _isNotOpeningParenToken
const isNotSemicolonToken = _isNotSemicolonToken
const isOpeningBraceToken = _isOpeningBraceToken
const isOpeningBracketToken = _isOpeningBracketToken
const isOpeningParenToken = _isOpeningParenToken
const isOptionalChainPunctuator = _isOptionalChainPunctuator
const isSemicolonToken = _isSemicolonToken
const isTokenOnSameLine = _isTokenOnSameLine

const KNOWN_NODES = new Set([
  'AssignmentExpression',
  'AssignmentPattern',
  'ArrayExpression',
  'ArrayPattern',
  'ArrowFunctionExpression',
  'AwaitExpression',
  'BlockStatement',
  'BinaryExpression',
  'BreakStatement',
  'CallExpression',
  'CatchClause',
  'ChainExpression',
  'ClassBody',
  'ClassDeclaration',
  'ClassExpression',
  'ConditionalExpression',
  'ContinueStatement',
  'DoWhileStatement',
  'DebuggerStatement',
  'EmptyStatement',
  'ExpressionStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'FunctionDeclaration',
  'FunctionExpression',
  'Identifier',
  'IfStatement',
  'Literal',
  'LabeledStatement',
  'LogicalExpression',
  'MemberExpression',
  'MetaProperty',
  'MethodDefinition',
  'NewExpression',
  'ObjectExpression',
  'ObjectPattern',
  'PrivateIdentifier',
  'Program',
  'Property',
  'PropertyDefinition',
  AST_NODE_TYPES.AccessorProperty,
  'RestElement',
  'ReturnStatement',
  'SequenceExpression',
  'SpreadElement',
  'StaticBlock',
  'Super',
  'SwitchCase',
  'SwitchStatement',
  'TaggedTemplateExpression',
  'TemplateElement',
  'TemplateLiteral',
  'ThisExpression',
  'ThrowStatement',
  'TryStatement',
  'UnaryExpression',
  'UpdateExpression',
  'VariableDeclaration',
  'VariableDeclarator',
  'WhileStatement',
  'WithStatement',
  'YieldExpression',
  'JSXFragment',
  'JSXOpeningFragment',
  'JSXClosingFragment',
  'JSXIdentifier',
  'JSXNamespacedName',
  'JSXMemberExpression',
  'JSXEmptyExpression',
  'JSXExpressionContainer',
  'JSXElement',
  'JSXClosingElement',
  'JSXOpeningElement',
  'JSXAttribute',
  'JSXSpreadAttribute',
  'JSXText',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'ExportAllDeclaration',
  'ExportSpecifier',
  'ImportDeclaration',
  'ImportSpecifier',
  'ImportDefaultSpecifier',
  'ImportNamespaceSpecifier',
  'ImportExpression',
  'ImportAttribute',

  // ts keywords
  AST_NODE_TYPES.TSAbstractKeyword,
  AST_NODE_TYPES.TSAnyKeyword,
  AST_NODE_TYPES.TSBooleanKeyword,
  AST_NODE_TYPES.TSNeverKeyword,
  AST_NODE_TYPES.TSNumberKeyword,
  AST_NODE_TYPES.TSStringKeyword,
  AST_NODE_TYPES.TSSymbolKeyword,
  AST_NODE_TYPES.TSUndefinedKeyword,
  AST_NODE_TYPES.TSUnknownKeyword,
  AST_NODE_TYPES.TSVoidKeyword,
  AST_NODE_TYPES.TSNullKeyword,

  // ts specific nodes we want to support
  AST_NODE_TYPES.TSAbstractPropertyDefinition,
  AST_NODE_TYPES.TSAbstractAccessorProperty,
  AST_NODE_TYPES.TSAbstractMethodDefinition,
  AST_NODE_TYPES.TSArrayType,
  AST_NODE_TYPES.TSAsExpression,
  AST_NODE_TYPES.TSCallSignatureDeclaration,
  AST_NODE_TYPES.TSConditionalType,
  AST_NODE_TYPES.TSConstructorType,
  AST_NODE_TYPES.TSConstructSignatureDeclaration,
  AST_NODE_TYPES.TSDeclareFunction,
  AST_NODE_TYPES.TSEmptyBodyFunctionExpression,
  AST_NODE_TYPES.TSEnumDeclaration,
  AST_NODE_TYPES.TSEnumBody,
  AST_NODE_TYPES.TSEnumMember,
  AST_NODE_TYPES.TSExportAssignment,
  AST_NODE_TYPES.TSExternalModuleReference,
  AST_NODE_TYPES.TSFunctionType,
  AST_NODE_TYPES.TSImportType,
  AST_NODE_TYPES.TSIndexedAccessType,
  AST_NODE_TYPES.TSIndexSignature,
  AST_NODE_TYPES.TSInferType,
  AST_NODE_TYPES.TSInterfaceBody,
  AST_NODE_TYPES.TSInterfaceDeclaration,
  AST_NODE_TYPES.TSInterfaceHeritage,
  AST_NODE_TYPES.TSImportEqualsDeclaration,
  AST_NODE_TYPES.TSLiteralType,
  AST_NODE_TYPES.TSMappedType,
  AST_NODE_TYPES.TSMethodSignature,
  AST_NODE_TYPES.TSModuleBlock,
  AST_NODE_TYPES.TSModuleDeclaration,
  AST_NODE_TYPES.TSNonNullExpression,
  AST_NODE_TYPES.TSParameterProperty,
  AST_NODE_TYPES.TSPropertySignature,
  AST_NODE_TYPES.TSQualifiedName,
  AST_NODE_TYPES.TSRestType,
  AST_NODE_TYPES.TSThisType,
  AST_NODE_TYPES.TSTupleType,
  AST_NODE_TYPES.TSTypeAliasDeclaration,
  AST_NODE_TYPES.TSTypeAnnotation,
  AST_NODE_TYPES.TSTypeLiteral,
  AST_NODE_TYPES.TSTypeOperator,
  AST_NODE_TYPES.TSTypeParameter,
  AST_NODE_TYPES.TSTypeParameterDeclaration,
  AST_NODE_TYPES.TSTypeParameterInstantiation,
  AST_NODE_TYPES.TSTypeReference,
  AST_NODE_TYPES.Decorator,

  // These are took care by `indent-binary-ops` rule
  // AST_NODE_TYPES.TSIntersectionType,
  // AST_NODE_TYPES.TSUnionType,
])

type Offset = 'first' | 'off' | number

/*
 * General rule strategy:
 * 1. An OffsetStorage instance stores a map of desired offsets, where each token has a specified offset from another
 *    specified token or to the first column.
 * 2. As the AST is traversed, modify the desired offsets of tokens accordingly. For example, when entering a
 *    BlockStatement, offset all of the tokens in the BlockStatement by 1 indent level from the opening curly
 *    brace of the BlockStatement.
 * 3. After traversing the AST, calculate the expected indentation levels of every token according to the
 *    OffsetStorage container.
 * 4. For each line, compare the expected indentation of the first token to the actual indentation in the file,
 *    and report the token if the two values are not equal.
 */

/**
 * A mutable map that stores (key, value) pairs. The keys are numeric indices, and must be unique.
 * This is intended to be a generic wrapper around a map with non-negative integer keys, so that the underlying implementation
 * can easily be swapped out.
 */
class IndexMap {
  _values: Int32Array

  /**
   * Creates an empty map
   * @param maxKey The maximum key
   */
  constructor(maxKey: number) {
    // Initializing the array with the maximum expected size avoids dynamic reallocations that could degrade performance.
    this._values = new Int32Array(maxKey + 1)
  }

  /**
   * Inserts an entry into the map.
   * @param key The entry's key
   * @param value The entry's value
   */
  insert(key: number, value: number) {
    this._values[key] = value
  }

  /**
   * Finds the value of the entry with the largest key less than or equal to the provided key
   * @param key The provided key
   * @returns The value of the found entry, or undefined if no such entry exists.
   */
  findLastNotAfter(key: number): number {
    return this._values[key]
  }

  /**
   * Deletes all of the keys in the interval [start, end)
   * @param start The start of the range
   * @param end The end of the range
   */
  fillRange(start: number, end: number, value: number) {
    this._values.fill(value, start, end)
  }

  deleteRange(start: number, end: number) {
    this._values.fill(0, start, end)
  }
}

/**
 * A helper class to get token-based info related to indentation
 */
class TokenInfo {
  sourceCode: SourceCode
  firstTokensByLineNumber: (Token | undefined)[]

  /**
   * @param sourceCode A SourceCode object
   */
  constructor(sourceCode: SourceCode) {
    this.sourceCode = sourceCode
    this.firstTokensByLineNumber = new Array(sourceCode.lines.length + 1)
    const tokens = sourceCode.tokensAndComments

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (!this.firstTokensByLineNumber[token.loc.start.line])
        this.firstTokensByLineNumber[token.loc.start.line] = token

      if (!this.firstTokensByLineNumber[token.loc.end.line]) {
        const lineStart = token.range[1] - token.loc.end.column
        let hasNonWhitespace = false

        for (let index = lineStart; index < token.range[1]; index++) {
          const code = sourceCode.text.charCodeAt(index)

          if (code !== 32 && code !== 9) {
            hasNonWhitespace = true
            break
          }
        }

        if (hasNonWhitespace)
          this.firstTokensByLineNumber[token.loc.end.line] = token
      }
    }
  }

  /**
   * Gets the first token on a given token's line
   * @param token a node or token
   * @returns The first token on the given line
   */
  getFirstTokenOfLine(token: Token | ASTNode) {
    return this.firstTokensByLineNumber[token.loc.start.line]
  }

  /**
   * Determines whether a token is the first token in its line
   * @param token The token
   * @returns `true` if the token is the first on its line
   */
  isFirstTokenOfLine(token: Token | ASTNode) {
    return this.getFirstTokenOfLine(token) === token
  }

  /**
   * Get the actual indent of a token
   * @param token Token to examine. This should be the first token on its line.
   * @returns The indentation characters that precede the token
   */
  getTokenIndent(token: Token) {
    return this.sourceCode.text.slice(token.range[0] - token.loc.start.column, token.range[0])
  }
}

/**
 * A class to store information on desired offsets of tokens from each other
 */
class OffsetStorage {
  _tokenInfo: TokenInfo
  _indentSize: number
  _indentType: string
  _indexMap: IndexMap
  _nextTokenIndex: Int32Array
  _allTokens: Token[]
  _descriptorOffsets: Offset[]
  _descriptorFrom: (Token | null | undefined)[]
  _descriptorForce: number[]
  _lockedFirstTokenIndexes: Int32Array
  _desiredIndentCache: (string | number | undefined)[]
  _ignoredTokens: Uint8Array
  _baseTokens: Uint8Array
  _indentStringCache: string[]

  /**
   * @param tokenInfo a TokenInfo instance
   * @param indentSize The desired size of each indentation level
   * @param indentType The indentation character
   * @param maxIndex The maximum end index of any token
   */
  constructor(
    tokenInfo: TokenInfo,
    indentSize: number,
    indentType: string,
    nextTokenIndex: Int32Array,
    allTokens: Token[],
  ) {
    this._tokenInfo = tokenInfo
    this._indentSize = indentSize
    this._indentType = indentType
    this._nextTokenIndex = nextTokenIndex
    this._allTokens = allTokens
    const tokenCount = allTokens.length
    this._descriptorOffsets = []
    this._descriptorFrom = []
    this._descriptorForce = []
    this._lockedFirstTokenIndexes = new Int32Array(tokenCount)
    this._lockedFirstTokenIndexes.fill(-1)
    this._desiredIndentCache = new Array(tokenCount)
    this._ignoredTokens = new Uint8Array(tokenCount)
    this._baseTokens = new Uint8Array(tokenCount)
    this._indentStringCache = ['']

    this._indexMap = new IndexMap(tokenCount)
    const initialDescriptor = this._addDescriptor(0, null, false)
    if (initialDescriptor !== 0)
      this._indexMap.fillRange(0, tokenCount + 1, initialDescriptor)
  }

  _getTokenIndex(token: Token) {
    return this._nextTokenIndex[token.range[0]]
  }

  _markBaseToken(token: Token | null | undefined) {
    if (!token)
      return
    this._baseTokens[this._getTokenIndex(token)] = 1
  }

  isBaseToken(token: Token) {
    return this._baseTokens[this._getTokenIndex(token)] === 1
  }

  markBaseToken(token: Token | null | undefined) {
    this._markBaseToken(token)
  }

  _addDescriptor(offset: Offset, from: Token | null | undefined, force: boolean) {
    const id = this._descriptorOffsets.length
    this._descriptorOffsets.push(offset)
    this._descriptorFrom.push(from)
    this._descriptorForce.push(force ? 1 : 0)
    return id
  }

  _getIndentString(size: number) {
    const cached = this._indentStringCache[size]
    if (cached !== undefined)
      return cached

    const value = this._indentType.repeat(size)
    this._indentStringCache[size] = value
    return value
  }

  _getOffsetDescriptorId(token: Token) {
    const index = this._getTokenIndex(token)
    return this._indexMap.findLastNotAfter(index) ?? 0
  }

  /**
   * Sets the offset column of token B to match the offset column of token A.
   * - **WARNING**: This matches a *column*, even if baseToken is not the first token on its line. In
   * most cases, `setDesiredOffset` should be used instead.
   * @param baseToken The first token
   * @param offsetToken The second token, whose offset should be matched to the first token
   */
  matchOffsetOf(baseToken: Token, offsetToken: Token) {
    /**
     * lockedFirstTokens is an index map from a token whose indentation is controlled by the "first" option to
     * the token that it depends on. For example, with the `ArrayExpression: first` option, the first
     * token of each element in the array after the first will be mapped to the first token of the first
     * element. The desired indentation of each of these tokens is computed based on the desired indentation
     * of the "first" element, rather than through the normal offset mechanism.
     */
    const offsetIndex = this._getTokenIndex(offsetToken)
    const baseIndex = this._getTokenIndex(baseToken)
    this._lockedFirstTokenIndexes[offsetIndex] = baseIndex
    this._baseTokens[baseIndex] = 1
  }

  /**
   * Sets the desired offset of a token.
   *
   * This uses a line-based offset collapsing behavior to handle tokens on the same line.
   * For example, consider the following two cases:
   *
   * (
   *     [
   *         bar
   *     ]
   * )
   *
   * ([
   *     bar
   * ])
   *
   * Based on the first case, it's clear that the `bar` token needs to have an offset of 1 indent level (4 spaces) from
   * the `[` token, and the `[` token has to have an offset of 1 indent level from the `(` token. Since the `(` token is
   * the first on its line (with an indent of 0 spaces), the `bar` token needs to be offset by 2 indent levels (8 spaces)
   * from the start of its line.
   *
   * However, in the second case `bar` should only be indented by 4 spaces. This is because the offset of 1 indent level
   * between the `(` and the `[` tokens gets "collapsed" because the two tokens are on the same line. As a result, the
   * `(` token is mapped to the `[` token with an offset of 0, and the rule correctly decides that `bar` should be indented
   * by 1 indent level from the start of the line.
   *
   * This is useful because rule listeners can usually just call `setDesiredOffset` for all the tokens in the node,
   * without needing to check which lines those tokens are on.
   *
   * Note that since collapsing only occurs when two tokens are on the same line, there are a few cases where non-intuitive
   * behavior can occur. For example, consider the following cases:
   *
   * foo(
   * ).
   *     bar(
   *         baz
   *     )
   *
   * foo(
   * ).bar(
   *     baz
   * )
   *
   * Based on the first example, it would seem that `bar` should be offset by 1 indent level from `foo`, and `baz`
   * should be offset by 1 indent level from `bar`. However, this is not correct, because it would result in `baz`
   * being indented by 2 indent levels in the second case (since `foo`, `bar`, and `baz` are all on separate lines, no
   * collapsing would occur).
   *
   * Instead, the correct way would be to offset `baz` by 1 level from `bar`, offset `bar` by 1 level from the `)`, and
   * offset the `)` by 0 levels from `foo`. This ensures that the offset between `bar` and the `)` are correctly collapsed
   * in the second case.
   * @param token The token
   * @param fromToken The token that `token` should be offset from
   * @param offset The desired indent level
   */
  setDesiredOffset(token: Token | undefined | null, fromToken: Token | undefined | null, offset: Offset): void {
    if (token)
      this.setDesiredOffsets(token.range, fromToken, offset)
  }

  /**
   * Sets the desired offset of all tokens in a range
   * It's common for node listeners in this file to need to apply the same offset to a large, contiguous range of tokens.
   * Moreover, the offset of any given token is usually updated multiple times (roughly once for each node that contains
   * it). This means that the offset of each token is updated O(AST depth) times.
   * It would not be performant to store and update the offsets for each token independently, because the rule would end
   * up having a time complexity of O(number of tokens * AST depth), which is quite slow for large files.
   *
   * Instead, the offset tree is represented as a collection of contiguous offset ranges in a file. For example, the following
   * list could represent the state of the offset tree at a given point:
   *
   * - Tokens starting in the interval [0, 15) are aligned with the beginning of the file
   * - Tokens starting in the interval [15, 30) are offset by 1 indent level from the `bar` token
   * - Tokens starting in the interval [30, 43) are offset by 1 indent level from the `foo` token
   * - Tokens starting in the interval [43, 820) are offset by 2 indent levels from the `bar` token
   * - Tokens starting in the interval [820, ∞) are offset by 1 indent level from the `baz` token
   *
   * The `setDesiredOffsets` methods inserts ranges like the ones above. The third line above would be inserted by using:
   * `setDesiredOffsets([30, 43], fooToken, 1);`
   * @param range A [start, end] pair. All tokens with range[0] <= token.start < range[1] will have the offset applied.
   * @param fromToken The token that this is offset from
   * @param offset The desired indent level
   * @param force `true` if this offset should not use the normal collapsing behavior. This should almost always be false.
   */
  setDesiredOffsets(range: [number, number], fromToken: Token | null | undefined, offset: Offset, force = false) {
    /**
     * Offset ranges are stored as a collection of nodes, where each node maps a numeric key to an offset
     * descriptor. The tree for the example above would have the following nodes:
     *
     * key: 0, value: { offset: 0, from: null }
     * key: 15, value: { offset: 1, from: barToken }
     * key: 30, value: { offset: 1, from: fooToken }
     * key: 43, value: { offset: 2, from: barToken }
     * key: 820, value: { offset: 1, from: bazToken }
     *
     * To find the offset descriptor for any given token, one needs to find the node with the largest key
     * which is <= token.start. To make this operation fast, the nodes are stored in a map indexed by key.
     */

    const descriptorToInsert = this._addDescriptor(offset, fromToken, force)
    this._markBaseToken(fromToken)
    const rangeStartIndex = this._nextTokenIndex[range[0]]
    const rangeEndIndex = this._nextTokenIndex[range[1]]

    if (rangeStartIndex === rangeEndIndex)
      return

    let fromTokenDescriptor: number | undefined
    let fromIndex = -1
    let fromEndIndex = -1
    let fromTokenIsInRange = false

    if (fromToken) {
      fromIndex = this._nextTokenIndex[fromToken.range[0]]
      fromTokenIsInRange = fromIndex >= rangeStartIndex && fromIndex < rangeEndIndex
      if (fromTokenIsInRange) {
        fromTokenDescriptor = this._indexMap.findLastNotAfter(fromIndex) ?? 0
        fromEndIndex = this._nextTokenIndex[fromToken.range[1]]
      }
    }

    this._indexMap.fillRange(rangeStartIndex, rangeEndIndex, descriptorToInsert)

    /**
     * To avoid circular offset dependencies, keep the `fromToken` token mapped to whatever it was mapped to previously,
     * even if it's in the current range.
     */
    if (fromTokenIsInRange) {
      this._indexMap.fillRange(fromIndex, fromEndIndex, fromTokenDescriptor ?? 0)
    }
  }

  /**
   * Gets the desired indent of a token
   * @param token The token
   * @returns The desired indent of the token (string or length)
   */
  getDesiredIndentValue(token: Token): string | number {
    const tokenIndex = this._getTokenIndex(token)
    const cached = this._desiredIndentCache[tokenIndex]

    if (cached === undefined) {
      if (this._ignoredTokens[tokenIndex]) {
        /**
         * If the token is ignored, use the actual indent of the token as the desired indent.
         * This ensures that no errors are reported for this token.
         */
        this._desiredIndentCache[tokenIndex] = this._tokenInfo.getTokenIndent(token)
      }
      else {
        const lockedIndex = this._lockedFirstTokenIndexes[tokenIndex]
        if (lockedIndex !== -1) {
          const firstToken = this._allTokens[lockedIndex]
          const firstTokenOfLine = this._tokenInfo.getFirstTokenOfLine(firstToken)!
          const baseIndent = this.getDesiredIndentValue(firstTokenOfLine)
          const offset = firstToken.loc.start.column - firstTokenOfLine.loc.start.column

          this._desiredIndentCache[tokenIndex] = typeof baseIndent === 'string'
            ? baseIndent + this._getIndentString(offset)
            : baseIndent + offset
        }
        else {
          const offsetInfoId = this._getOffsetDescriptorId(token)
          const offsetFrom = this._descriptorFrom[offsetInfoId]
          const offsetForce = this._descriptorForce[offsetInfoId] === 1
          const offsetValue = this._descriptorOffsets[offsetInfoId] as number
          const offset = (
            offsetFrom
            && offsetFrom.loc.start.line === token.loc.start.line
            && !/^\s*?\n/u.test(token.value)
            && !offsetForce
          ) ? 0 : offsetValue * this._indentSize

          if (offsetFrom) {
            const baseIndent = this.getDesiredIndentValue(offsetFrom)

            this._desiredIndentCache[tokenIndex] = typeof baseIndent === 'string'
              ? baseIndent + this._getIndentString(offset)
              : baseIndent + offset
          }
          else {
            this._desiredIndentCache[tokenIndex] = offset
          }
        }
      }
    }
    return this._desiredIndentCache[tokenIndex]!
  }

  /**
   * Ignores a token, preventing it from being reported.
   * @param token The token
   */
  ignoreToken(token: Token) {
    if (this._tokenInfo.isFirstTokenOfLine(token))
      this._ignoredTokens[this._getTokenIndex(token)] = 1
  }

  /**
   * Gets the first token that the given token's indentation is dependent on
   * @param token The token
   * @returns The token that the given token depends on, or `null` if the given token is at the top level
   */
  getFirstDependency(token: Token) {
    return this._descriptorFrom[this._getOffsetDescriptorId(token)]
  }
}

const ELEMENT_LIST_SCHEMA: JSONSchema.JSONSchema4 = {
  oneOf: [
    {
      type: 'integer',
      minimum: 0,
    },
    {
      type: 'string',
      enum: ['first', 'off'],
    },
  ],
}

export default createRule<RuleOptions, MessageIds>({
  name: 'indent',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent indentation',
    },
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['tab'],
          },
          {
            type: 'integer',
            minimum: 0,
          },
        ],
      },
      {
        type: 'object',
        properties: {
          SwitchCase: {
            type: 'integer',
            minimum: 0,
          },
          VariableDeclarator: {
            oneOf: [
              ELEMENT_LIST_SCHEMA,
              {
                type: 'object',
                properties: {
                  var: ELEMENT_LIST_SCHEMA,
                  let: ELEMENT_LIST_SCHEMA,
                  const: ELEMENT_LIST_SCHEMA,
                  using: ELEMENT_LIST_SCHEMA,
                },
                additionalProperties: false,
              },
            ],
          },
          assignmentOperator: {
            oneOf: [
              {
                type: 'integer',
                minimum: 0,
              },
              {
                type: 'string',
                enum: ['off'],
              },
            ],
          },
          outerIIFEBody: {
            oneOf: [
              {
                type: 'integer',
                minimum: 0,
              },
              {
                type: 'string',
                enum: ['off'],
              },
            ],
          },
          MemberExpression: {
            oneOf: [
              {
                type: 'integer',
                minimum: 0,
              },
              {
                type: 'string',
                enum: ['off'],
              },
            ],
          },
          FunctionDeclaration: {
            type: 'object',
            properties: {
              parameters: ELEMENT_LIST_SCHEMA,
              body: {
                type: 'integer',
                minimum: 0,
              },
              returnType: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
          FunctionExpression: {
            type: 'object',
            properties: {
              parameters: ELEMENT_LIST_SCHEMA,
              body: {
                type: 'integer',
                minimum: 0,
              },
              returnType: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
          StaticBlock: {
            type: 'object',
            properties: {
              body: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
          CallExpression: {
            type: 'object',
            properties: {
              arguments: ELEMENT_LIST_SCHEMA,
            },
            additionalProperties: false,
          },
          ArrayExpression: ELEMENT_LIST_SCHEMA,
          ObjectExpression: ELEMENT_LIST_SCHEMA,
          ImportDeclaration: ELEMENT_LIST_SCHEMA,
          flatTernaryExpressions: {
            type: 'boolean',
          },
          offsetTernaryExpressions: {
            oneOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  CallExpression: {
                    type: 'boolean',
                  },
                  AwaitExpression: {
                    type: 'boolean',
                  },
                  NewExpression: {
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            ],
          },
          offsetTernaryExpressionsOffsetCallExpressions: {
            type: 'boolean',
          },
          ignoredNodes: {
            type: 'array',
            items: {
              type: 'string',
              not: {
                type: 'string',
                pattern: ':exit$',
              },
            },
          },
          ignoreComments: {
            type: 'boolean',
          },
          tabLength: {
            type: 'number',
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      // typescript docs and playground use 4 space indent
      4,
      {
        // typescript docs indent the case from the switch
        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-8.html#example-4
        SwitchCase: 1,
        flatTernaryExpressions: false,
        ignoredNodes: [],
      },
    ],
    messages: {
      wrongIndentation: 'Expected indentation of {{expected}} but found {{actual}}.',
    },
  },
  create(context, optionsWithDefaults) {
    if (!isESTreeSourceCode(context.sourceCode)) {
      return {}
    }

    const DEFAULT_VARIABLE_INDENT = 1
    const DEFAULT_PARAMETER_INDENT = 1
    const DEFAULT_FUNCTION_BODY_INDENT = 1
    const DEFAULT_FUNCTION_RETURN_TYPE_INDENT = 1

    warnDeprecatedOptions(context.options[1], 'offsetTernaryExpressionsOffsetCallExpressions', 'offsetTernaryExpressions.CallExpression' as any, 'indent')

    let indentType = 'space'
    let indentSize = 4
    const options = {
      SwitchCase: 0,
      VariableDeclarator: {
        var: DEFAULT_VARIABLE_INDENT as number | 'first',
        let: DEFAULT_VARIABLE_INDENT as number | 'first',
        const: DEFAULT_VARIABLE_INDENT as number | 'first',
        using: DEFAULT_VARIABLE_INDENT as number | 'first',
      },
      outerIIFEBody: 1,
      assignmentOperator: 1,
      FunctionDeclaration: {
        parameters: DEFAULT_PARAMETER_INDENT,
        body: DEFAULT_FUNCTION_BODY_INDENT,
        returnType: DEFAULT_FUNCTION_RETURN_TYPE_INDENT,
      },
      FunctionExpression: {
        parameters: DEFAULT_PARAMETER_INDENT,
        body: DEFAULT_FUNCTION_BODY_INDENT,
        returnType: DEFAULT_FUNCTION_RETURN_TYPE_INDENT,
      },
      StaticBlock: {
        body: DEFAULT_FUNCTION_BODY_INDENT,
      },
      CallExpression: {
        arguments: DEFAULT_PARAMETER_INDENT,
      },
      MemberExpression: 1,
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoredNodes: [],
      ignoreComments: false,
      offsetTernaryExpressions: false as NonNullable<RuleOptions[1]>['offsetTernaryExpressions'],
      // deprecated
      offsetTernaryExpressionsOffsetCallExpressions: true,
      tabLength: 4,
    }

    if (optionsWithDefaults.length) {
      if (optionsWithDefaults[0] === 'tab') {
        indentSize = 1
        indentType = 'tab'
      }
      else {
        indentSize = optionsWithDefaults[0] ?? indentSize
        indentType = 'space'
      }

      const userOptions = optionsWithDefaults[1]
      if (userOptions) {
        Object.assign(options, userOptions)

        if (typeof userOptions.VariableDeclarator === 'number' || userOptions.VariableDeclarator === 'first') {
          options.VariableDeclarator = {
            var: userOptions.VariableDeclarator,
            let: userOptions.VariableDeclarator,
            const: userOptions.VariableDeclarator,
            using: userOptions.VariableDeclarator,
          }
        }
      }
    }

    const sourceCode = context.sourceCode
    const lineCount = sourceCode.lines.length
    const tokenInfo = new TokenInfo(sourceCode)
    const indentChar = indentType === 'space' ? ' ' : '\t'
    const blankLineCountByLine = new Int32Array(lineCount + 1)
    const textLength = sourceCode.text.length
    type NonCommentToken = Exclude<Token, Tree.Comment>
    const sourceTokens = sourceCode.ast.tokens as NonCommentToken[]
    const allTokens = sourceCode.tokensAndComments
    const tokenCount = allTokens.length
    const sourceTokenIndexByStart = new Uint32Array(textLength + 1)
    const nextTokenIndex = new Int32Array(textLength + 1)
    let previousTokenStart = -1

    for (let i = 0; i < sourceTokens.length; i++)
      sourceTokenIndexByStart[sourceTokens[i].range[0]] = i + 1

    for (let i = 0; i < tokenCount; i++) {
      const tokenStart = allTokens[i].range[0]
      if (tokenStart >= previousTokenStart + 1)
        nextTokenIndex.fill(i, previousTokenStart + 1, tokenStart + 1)
      previousTokenStart = tokenStart
    }
    nextTokenIndex.fill(tokenCount, previousTokenStart + 1, textLength + 1)

    for (let line = 1; line <= lineCount; line++) {
      blankLineCountByLine[line] = blankLineCountByLine[line - 1]
        + (tokenInfo.firstTokensByLineNumber[line] ? 0 : 1)
    }
    const offsets = new OffsetStorage(tokenInfo, indentSize, indentChar, nextTokenIndex, allTokens)
    const parameterParens = new Uint8Array(tokenCount)
    const markParameterParen = (token: Token) => {
      parameterParens[nextTokenIndex[token.range[0]]] = 1
    }
    const isParameterParen = (token: Token) => parameterParens[nextTokenIndex[token.range[0]]] === 1

    function getTokenBeforeToken(token: Token) {
      const index = sourceTokenIndexByStart[token.range[0]] - 1
      if (index < 1)
        return null
      return sourceTokens[index - 1]
    }

    function getTokenAfterToken(token: Token) {
      const index = sourceTokenIndexByStart[token.range[0]] - 1
      if (index < 0 || index >= sourceTokens.length - 1)
        return null
      return sourceTokens[index + 1]
    }

    /**
     * Creates an error message for a line, given the expected/actual indentation.
     * @param expectedAmount The expected amount of indentation characters for this line
     * @param actualSpaces The actual number of indentation spaces that were found on this line
     * @param actualTabs The actual number of indentation tabs that were found on this line
     * @returns An error message for this line
     */
    function createErrorMessageData(expectedAmount: number, actualSpaces: number, actualTabs: number) {
      const expectedStatement = `${expectedAmount} ${indentType}${expectedAmount === 1 ? '' : 's'}` // e.g. "2 tabs"
      const foundSpacesWord = `space${actualSpaces === 1 ? '' : 's'}` // e.g. "space"
      const foundTabsWord = `tab${actualTabs === 1 ? '' : 's'}` // e.g. "tabs"
      let foundStatement

      if (actualSpaces > 0) {
        /**
         * Abbreviate the message if the expected indentation is also spaces.
         * e.g. 'Expected 4 spaces but found 2' rather than 'Expected 4 spaces but found 2 spaces'
         */
        foundStatement = indentType === 'space' ? actualSpaces : `${actualSpaces} ${foundSpacesWord}`
      }
      else if (actualTabs > 0) {
        foundStatement = indentType === 'tab' ? actualTabs : `${actualTabs} ${foundTabsWord}`
      }
      else {
        foundStatement = '0'
      }
      return {
        expected: expectedStatement,
        actual: foundStatement,
      }
    }

    function isIndentMatchRange(indentStart: number, indentLength: number, desiredIndent: string | number): boolean {
      if (typeof desiredIndent === 'string') {
        if (indentLength !== desiredIndent.length)
          return false

        for (let i = 0; i < indentLength; i++) {
          if (sourceCode.text.charCodeAt(indentStart + i) !== desiredIndent.charCodeAt(i))
            return false
        }

        return true
      }

      if (indentLength !== desiredIndent)
        return false

      const indentCharCode = indentChar.charCodeAt(0)
      for (let i = 0; i < indentLength; i++) {
        if (sourceCode.text.charCodeAt(indentStart + i) !== indentCharCode)
          return false
      }

      return true
    }

    /**
     * Reports a given indent violation
     * @param token Token violating the indent rule
     * @param neededIndent Expected indentation string
     */
    function report(token: Token, neededIndent: string, indentStart: number, indentLength: number) {
      let numSpaces = 0
      let numTabs = 0

      for (let i = 0; i < indentLength; i++) {
        const code = sourceCode.text.charCodeAt(indentStart + i)
        if (code === 32)
          numSpaces++
        else if (code === 9)
          numTabs++
      }

      context.report({
        node: token,
        messageId: 'wrongIndentation',
        data: createErrorMessageData(neededIndent.length, numSpaces, numTabs),
        loc: {
          start: { line: token.loc.start.line, column: 0 },
          end: { line: token.loc.start.line, column: token.loc.start.column },
        },
        fix: fixer => fixer.replaceTextRange(
          [indentStart, indentStart + indentLength],
          neededIndent,
        ),
      })
    }

    /**
     * Checks if a token's indentation is correct
     * @param token Token to examine
     * @param desiredIndent Desired indentation of the string
     * @returns `true` if the token's indentation is correct
     */
    /**
     * Check to see if the node is a file level IIFE
     * @param node The function node to check.
     * @returns True if the node is the outer IIFE
     */
    function isOuterIIFE(node: ASTNode) {
      /**
       * Verify that the node is an IIFE
       */
      if (!node.parent || node.parent.type !== 'CallExpression' || node.parent.callee !== node)
        return false

      /**
       * Navigate legal ancestors to determine whether this IIFE is outer.
       * A "legal ancestor" is an expression or statement that causes the function to get executed immediately.
       * For example, `!(function(){})()` is an outer IIFE even though it is preceded by a ! operator.
       */
      let statement = node.parent && node.parent.parent

      while (
        statement.type === 'UnaryExpression' && ['!', '~', '+', '-'].includes(statement.operator)
        || statement.type === 'AssignmentExpression'
        || statement.type === 'LogicalExpression'
        || statement.type === 'SequenceExpression'
        || statement.type === 'VariableDeclarator'
      ) {
        statement = statement.parent
      }

      return (statement.type === 'ExpressionStatement' || statement.type === 'VariableDeclaration') && statement.parent.type === 'Program'
    }

    /**
     * Counts the number of linebreaks that follow the last non-whitespace character in a string
     * @param string The string to check
     * @returns The number of JavaScript linebreaks that follow the last non-whitespace character,
     * or the total number of linebreaks if the string is all whitespace.
     */
    function countTrailingLinebreaks(string: string) {
      const trailingWhitespace = string.match(/\s*$/u)![0]
      const linebreakMatches = trailingWhitespace.match(createGlobalLinebreakMatcher())

      return linebreakMatches === null ? 0 : linebreakMatches.length
    }

    /**
     * Check indentation for lists of elements (arrays, objects, function params)
     * @param elements List of elements that should be offset
     * @param startToken The start token of the list that element should be aligned against, e.g. '['
     * @param endToken The end token of the list, e.g. ']'
     * @param offset The amount that the elements should be offset
     */
    function addElementListIndent(elements: (ASTNode | null)[], startToken: Token, endToken: Token, offset: number | string) {
      if (startToken.loc.end.line === endToken.loc.start.line)
        return

      /**
       * Gets the first token of a given element, including surrounding parentheses.
       * @param element A node in the `elements` list
       * @returns The first token of this element
       */
      function getFirstToken(element: ASTNode) {
        let token: Token = sourceCode.getTokenBefore(element)!

        while (isOpeningParenToken(token) && token !== startToken)
          token = getTokenBeforeToken(token)!

        return getTokenAfterToken(token)!
      }

      // Run through all the tokens in the list, and offset them by one indent level (mainly for comments, other things will end up overridden)
      offsets.setDesiredOffsets(
        [startToken.range[1], endToken.range[0]],
        startToken,
        typeof offset === 'number' ? offset : 1,
      )
      offsets.setDesiredOffset(endToken, startToken, 0)

      // If the preference is "first" but there is no first element (e.g. sparse arrays w/ empty first slot), fall back to 1 level.
      if (offset === 'first' && elements.length && !elements[0])
        return

      const elementFirstTokens: (Token | null)[] = new Array(elements.length)

      for (let index = 0; index < elements.length; index++) {
        const element = elements[index]
        elementFirstTokens[index] = element ? getFirstToken(element) : null
      }

      const firstElementToken = elementFirstTokens[0]

      for (let index = 0; index < elements.length; index++) {
        const element = elements[index]

        if (!element) {
          // Skip holes in arrays
          continue
        }

        const elementFirstToken = elementFirstTokens[index]!

        if (offset === 'off') {
          // Ignore the first token of every element if the "off" option is used
          offsets.ignoreToken(elementFirstToken)
        }

        // Offset the following elements correctly relative to the first element
        if (index === 0)
          continue

        if (offset === 'first' && tokenInfo.isFirstTokenOfLine(elementFirstToken)) {
          if (firstElementToken)
            offsets.matchOffsetOf(firstElementToken, elementFirstToken)
        }
        else {
          const previousElement = elements[index - 1]

          if (!previousElement)
            continue

          const firstTokenOfPreviousElement = elementFirstTokens[index - 1]!
          const previousElementLastToken = sourceCode.getLastToken(previousElement)!

          if (
            previousElementLastToken.loc.end.line - countTrailingLinebreaks(previousElementLastToken.value) > startToken.loc.end.line
          ) {
            offsets.setDesiredOffsets(
              [previousElement.range[1], element.range[1]],
              firstTokenOfPreviousElement,
              0,
            )
          }
        }
      }
    }

    /**
     * Check and decide whether to check for indentation for blockless nodes
     * Scenarios are for or while statements without braces around them
     * @param node node to examine
     */
    function addBlocklessNodeIndent(node: ASTNode) {
      if (node.type !== 'BlockStatement') {
        const lastParentToken = sourceCode.getTokenBefore(node, isNotOpeningParenToken)!

        let firstBodyToken = sourceCode.getFirstToken(node)!
        let lastBodyToken = sourceCode.getLastToken(node)!

        while (
          isOpeningParenToken(getTokenBeforeToken(firstBodyToken)!)
          && isClosingParenToken(getTokenAfterToken(lastBodyToken)!)
        ) {
          firstBodyToken = getTokenBeforeToken(firstBodyToken)!
          lastBodyToken = getTokenAfterToken(lastBodyToken)!
        }

        offsets.setDesiredOffsets([firstBodyToken.range[0], lastBodyToken.range[1]], lastParentToken, 1)
      }
    }

    /**
     * Checks the indentation for nodes that are like function calls (`CallExpression` and `NewExpression`)
     * @param node A CallExpression or NewExpression node
     */
    function addFunctionCallIndent(node: Tree.CallExpression | Tree.NewExpression) {
      let openingParen

      if (node.arguments.length) {
        openingParen = sourceCode.getTokenAfter(
          node.typeArguments ?? node.callee,
          isOpeningParenToken,
        )!
      }
      else {
        openingParen = sourceCode.getLastToken(node, 1)!
      }

      const closingParen = sourceCode.getLastToken(node)!

      markParameterParen(openingParen)
      markParameterParen(closingParen)

      /**
       * If `?.` token exists, set desired offset for that.
       * This logic is copied from `MemberExpression`'s.
       */
      if ('optional' in node && node.optional) {
        const dotToken = sourceCode.getTokenAfter(node.callee, isOptionalChainPunctuator)!
        const calleeParenCount = sourceCode.getTokensBetween(node.callee, dotToken, { filter: isClosingParenToken }).length
        const firstTokenOfCallee = calleeParenCount
          ? sourceCode.getTokenBefore(node.callee, { skip: calleeParenCount - 1 })!
          : sourceCode.getFirstToken(node.callee)!
        const lastTokenOfCallee = getTokenBeforeToken(dotToken)!
        const offsetBase = isTokenOnSameLine(lastTokenOfCallee, openingParen)
          ? lastTokenOfCallee
          : firstTokenOfCallee

        offsets.setDesiredOffset(dotToken, offsetBase, 1)
      }

      const offsetAfterToken = node.callee.type === 'TaggedTemplateExpression'
        ? sourceCode.getFirstToken(node.callee.quasi)!
        : node.typeArguments ?? openingParen
      const offsetToken = sourceCode.getTokenBefore(offsetAfterToken)!

      offsets.setDesiredOffset(openingParen, offsetToken, 0)

      addElementListIndent(node.arguments, openingParen, closingParen, options.CallExpression.arguments)
    }

    /**
     * Checks the indentation of parenthesized values, given a list of tokens in a program
     * @param tokens A list of tokens
     */
    function addParensIndent(tokens: Token[]) {
      interface ParenPair {
        left: Token
        right: Token
        leftIndex: number
        rightIndex: number
      }

      const parenStack: { token: Token, index: number, ignored: boolean }[] = []
      const openPairs: (ParenPair | undefined)[] = new Array(tokens.length)
      const closePairs: (ParenPair | undefined)[] = new Array(tokens.length)
      let hasPairs = false

      for (let i = 0; i < tokens.length; i++) {
        const nextToken = tokens[i]

        const isOpeningParen = isOpeningParenToken(nextToken)
        if (isOpeningParen) {
          parenStack.push({ token: nextToken, index: i, ignored: isParameterParen(nextToken) })
        }

        const isClosingParen = !isOpeningParen && isClosingParenToken(nextToken)
        if (isClosingParen) {
          const left = parenStack.pop()
          if (left) {
            // Only handle parens around expressions, so exclude parentheses that are in function parameters and function call arguments.
            if (
              !left.ignored
              && !isParameterParen(nextToken)
              && left.token.loc.start.line !== nextToken.loc.start.line
            ) {
              const pair: ParenPair = { left: left.token, right: nextToken, leftIndex: left.index, rightIndex: i }
              openPairs[left.index] = pair
              closePairs[i] = pair
              hasPairs = true
            }
          }
        }
      }

      if (!hasPairs)
        return

      const activePairs: ParenPair[] = []
      const applyPairIndent = (token: Token, pair: ParenPair) => {
        const dependency = offsets.getFirstDependency(token)
        if (!dependency || isCommentToken(dependency)) {
          offsets.setDesiredOffset(token, pair.left, 1)
          return
        }

        const depStart = dependency.range[0]
        if (depStart <= pair.left.range[0] || depStart >= pair.right.range[0])
          offsets.setDesiredOffset(token, pair.left, 1)
      }

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        const closingPair = closePairs[i]
        if (closingPair) {
          if (activePairs.length > 1)
            applyPairIndent(token, activePairs[activePairs.length - 2])
          offsets.setDesiredOffset(token, closingPair.left, 0)
          activePairs.pop()
          continue
        }

        const openingPair = openPairs[i]
        if (openingPair) {
          if (activePairs.length)
            applyPairIndent(token, activePairs[activePairs.length - 1])
          activePairs.push(openingPair)
          continue
        }

        if (activePairs.length && (tokenInfo.isFirstTokenOfLine(token) || offsets.isBaseToken(token)))
          applyPairIndent(token, activePairs[activePairs.length - 1])
      }
    }

    /**
     * Ignore all tokens within an unknown node whose offset do not depend
     * on another token's offset within the unknown node
     * @param node Unknown Node
     */
    function ignoreNode(node: ASTNode) {
      const unknownNodeTokens = new Set(sourceCode.getTokens(node, { includeComments: true }))

      unknownNodeTokens.forEach((token) => {
        const dependency = offsets.getFirstDependency(token)
        if (!dependency || !unknownNodeTokens.has(dependency)) {
          const firstTokenOfLine = tokenInfo.getFirstTokenOfLine(token)!

          if (token === firstTokenOfLine)
            offsets.ignoreToken(token)
          else
            offsets.setDesiredOffset(token, firstTokenOfLine, 0)
        }
      })
    }

    /**
     * Check whether the given token is on the first line of a statement.
     * @param token The token to check.
     * @param leafNode The expression node that the token belongs directly.
     * @returns `true` if the token is on the first line of a statement.
     */
    function isOnFirstLineOfStatement(token: Token, leafNode: ASTNode): boolean {
      let node = leafNode

      while (node.parent && !node.parent.type.endsWith('Statement') && !node.parent.type.endsWith('Declaration'))
        node = node.parent

      node = node.parent!

      return !node || node.loc.start.line === token.loc.start.line
    }

    /**
     * Check whether there are any blank (whitespace-only) lines between
     * two tokens on separate lines.
     * @param firstToken The first token.
     * @param secondToken The second token.
     * @returns `true` if the tokens are on separate lines and
     *   there exists a blank line between them, `false` otherwise.
     */
    function hasBlankLinesBetween(firstToken: Token, secondToken: Token): boolean {
      const firstTokenLine = firstToken.loc.end.line
      const secondTokenLine = secondToken.loc.start.line

      if (firstTokenLine >= secondTokenLine - 1)
        return false

      return blankLineCountByLine[secondTokenLine - 1] !== blankLineCountByLine[firstTokenLine]
    }

    const ignoredNodeFirstTokens = new Set<Token>()

    function checkAssignmentOperator(operator: Token) {
      const left = getTokenBeforeToken(operator)!
      const right = getTokenAfterToken(operator)!

      if (typeof options.assignmentOperator === 'number') {
        offsets.setDesiredOffset(operator, left, options.assignmentOperator)
        offsets.setDesiredOffset(right, operator, options.assignmentOperator)
      }
      else {
        offsets.ignoreToken(operator)
        offsets.ignoreToken(right)
      }
    }

    function checkArrayLikeNode(node: Tree.ArrayExpression | Tree.ArrayPattern | Tree.TSTupleType) {
      const elementList = node.type === AST_NODE_TYPES.TSTupleType ? node.elementTypes : node.elements
      const openingBracket = sourceCode.getFirstToken(node)!
      const closingBracket = sourceCode.getTokenAfter([...elementList].reverse().find(_ => _) || openingBracket, isClosingBracketToken)!

      addElementListIndent(elementList, openingBracket, closingBracket, options.ArrayExpression)
    }

    function checkObjectLikeNode(node: Tree.ObjectExpression | Tree.ObjectPattern | Tree.TSEnumDeclaration | Tree.TSTypeLiteral, properties: ASTNode[]) {
      const openingCurly = sourceCode.getFirstToken(node, isOpeningBraceToken)!
      const closingCurly = sourceCode.getTokenAfter(
        properties.length ? properties[properties.length - 1] : openingCurly,
        isClosingBraceToken,
      )!

      addElementListIndent(properties, openingCurly, closingCurly, options.ObjectExpression)
    }

    function checkConditionalNode(node: Tree.ConditionalExpression | Tree.TSConditionalType, test: ASTNode, consequent: ASTNode, alternate: ASTNode) {
      const firstToken = sourceCode.getFirstToken(node)!

      // `flatTernaryExpressions` option is for the following style:
      // var a =
      //     foo > 0 ? bar :
      //     foo < 0 ? baz :
      //     /*else*/ qiz ;
      if (options.flatTernaryExpressions && isTokenOnSameLine(test, consequent) && !isOnFirstLineOfStatement(firstToken, node))
        return

      const ternaryOptions: false | Partial<Record<NodeTypes, boolean>> = options.offsetTernaryExpressions === true
        ? {
            CallExpression: options.offsetTernaryExpressionsOffsetCallExpressions ?? true,
            // for backward compatibility
            AwaitExpression: options.offsetTernaryExpressionsOffsetCallExpressions ?? true,
            NewExpression: true,
          }
        : options.offsetTernaryExpressions!

      function checkBranch(branch: ASTNode, branchFirstToken: Token) {
        let offset = 1
        if (ternaryOptions) {
          const branchType = skipChainExpression(branch).type

          if (branchFirstToken.type === 'Punctuator' || ternaryOptions[branchType]) {
            offset = 2
          }
        }

        offsets.setDesiredOffset(
          branchFirstToken,
          firstToken,
          offset,
        )
      }

      const questionMarkToken = sourceCode.getFirstTokenBetween(test, consequent, isQuestionToken)!
      const colonToken = sourceCode.getFirstTokenBetween(consequent, alternate, isColonToken)!

      const firstConsequentToken = getTokenAfterToken(questionMarkToken)!
      const lastConsequentToken = getTokenBeforeToken(colonToken)!
      const firstAlternateToken = getTokenAfterToken(colonToken)!

      offsets.setDesiredOffset(questionMarkToken, firstToken, 1)
      offsets.setDesiredOffset(colonToken, firstToken, 1)

      checkBranch(consequent, firstConsequentToken)

      /**
       * The alternate and the consequent should usually have the same indentation.
       * If they share part of a line, align the alternate against the first token of the consequent.
       * This allows the alternate to be indented correctly in cases like this:
       * foo ? (
       *   bar
       * ) : ( // this '(' is aligned with the '(' above, so it's considered to be aligned with `foo`
       *   baz // as a result, `baz` is offset by 1 rather than 2
       * )
       */
      if (isTokenOnSameLine(lastConsequentToken, firstAlternateToken)) {
        offsets.setDesiredOffset(firstAlternateToken, firstConsequentToken, 0)
      }
      else {
        /**
         * If the alternate and consequent do not share part of a line, offset the alternate from the first
         * token of the conditional expression. For example:
         * foo ? bar
         *   : baz
         *
         * If `baz` were aligned with `bar` rather than being offset by 1 from `foo`, `baz` would end up
         * having no expected indentation.
         */
        checkBranch(alternate, firstAlternateToken)
      }
    }

    function checkOperatorToken(left: ASTNode, right: ASTNode, operator: string) {
      const operatorToken = sourceCode.getFirstTokenBetween(left, right, token => token.value === operator)!

      /**
       * For backwards compatibility, don't check BinaryExpression indents, e.g.
       * var foo = bar &&
       *                   baz;
       */

      const tokenAfterOperator = getTokenAfterToken(operatorToken)!
      offsets.ignoreToken(operatorToken)
      offsets.ignoreToken(tokenAfterOperator)
      offsets.setDesiredOffset(tokenAfterOperator, operatorToken, 0)
    }

    function checkMemberExpression(
      node: Tree.MemberExpression | Tree.JSXMemberExpression | Tree.MetaProperty | Tree.TSIndexedAccessType | Tree.TSQualifiedName,
      object: ASTNode,
      property: ASTNode,
      computed = false,
    ) {
      const firstNonObjectToken = sourceCode.getFirstTokenBetween(object, property, isNotClosingParenToken)!
      const secondNonObjectToken = getTokenAfterToken(firstNonObjectToken)!

      const objectParenCount = sourceCode.getTokensBetween(object, property, { filter: isClosingParenToken }).length
      const firstObjectToken = objectParenCount
        ? sourceCode.getTokenBefore(object, { skip: objectParenCount - 1 })!
        : sourceCode.getFirstToken(object)!
      const lastObjectToken = getTokenBeforeToken(firstNonObjectToken)!
      const firstPropertyToken = computed ? firstNonObjectToken : secondNonObjectToken

      if (computed) {
        // For computed MemberExpressions, match the closing bracket with the opening bracket.
        offsets.setDesiredOffset(sourceCode.getLastToken(node)!, firstNonObjectToken, 0)
        offsets.setDesiredOffsets(property.range, firstNonObjectToken, 1)
      }

      /**
       * If the object ends on the same line that the property starts, match against the last token
       * of the object, to ensure that the MemberExpression is not indented.
       *
       * Otherwise, match against the first token of the object, e.g.
       * foo
       *   .bar
       *   .baz // <-- offset by 1 from `foo`
       */
      const offsetBase = isTokenOnSameLine(lastObjectToken, firstPropertyToken)
        ? lastObjectToken
        : firstObjectToken

      if (typeof options.MemberExpression === 'number') {
        // Match the dot (for non-computed properties) or the opening bracket (for computed properties) against the object.
        offsets.setDesiredOffset(firstNonObjectToken, offsetBase, options.MemberExpression)

        /**
         * For computed MemberExpressions, match the first token of the property against the opening bracket.
         * Otherwise, match the first token of the property against the object.
         */
        offsets.setDesiredOffset(secondNonObjectToken, computed ? firstNonObjectToken : offsetBase, options.MemberExpression)
      }
      else {
        // If the MemberExpression option is off, ignore the dot and the first token of the property.
        offsets.ignoreToken(firstNonObjectToken)
        offsets.ignoreToken(secondNonObjectToken)

        // To ignore the property indentation, ensure that the property tokens depend on the ignored tokens.
        offsets.setDesiredOffset(firstNonObjectToken, offsetBase, 0)
        offsets.setDesiredOffset(secondNonObjectToken, firstNonObjectToken, 0)
      }
    }

    function checkBlockLikeNode(node: Tree.BlockStatement | Tree.ClassBody | Tree.TSInterfaceBody | Tree.TSEnumBody | Tree.TSModuleBlock) {
      let blockIndentLevel

      if (node.parent && isOuterIIFE(node.parent))
        blockIndentLevel = options.outerIIFEBody
      else if (node.parent && (node.parent.type === 'FunctionExpression' || node.parent.type === 'ArrowFunctionExpression'))
        blockIndentLevel = options.FunctionExpression.body
      else if (node.parent && node.parent.type === 'FunctionDeclaration')
        blockIndentLevel = options.FunctionDeclaration.body
      else
        blockIndentLevel = 1

      /**
       * For blocks that aren't lone statements, ensure that the opening curly brace
       * is aligned with the parent.
       */
      if (!STATEMENT_LIST_PARENTS.has(node.parent.type))
        offsets.setDesiredOffset(sourceCode.getFirstToken(node)!, sourceCode.getFirstToken(node.parent)!, 0)

      addElementListIndent(
        node.type === AST_NODE_TYPES.TSEnumBody ? node.members : node.body,
        sourceCode.getFirstToken(node)!,
        sourceCode.getLastToken(node)!,
        blockIndentLevel,
      )
    }

    function checkHeritages(node: Tree.ClassDeclaration | Tree.ClassExpression | Tree.TSInterfaceDeclaration, heritages: ASTNode[]) {
      const classToken = sourceCode.getFirstToken(node)!
      const extendsToken = sourceCode.getTokenBefore(heritages[0], isNotOpeningParenToken)!

      offsets.setDesiredOffsets([extendsToken.range[0], node.body.range[0]], classToken, 1)
    }

    function checkClassProperty(node: Tree.PropertyDefinition | Tree.AccessorProperty | Tree.TSAbstractPropertyDefinition | Tree.TSAbstractAccessorProperty) {
      const firstToken = sourceCode.getFirstToken(node)!
      const lastToken = sourceCode.getLastToken(node)!
      let keyLastToken: Token

      // Indent key.
      if (node.computed) {
        const bracketTokenL = sourceCode.getTokenBefore(node.key, isOpeningBracketToken)!
        const bracketTokenR = keyLastToken = sourceCode.getTokenAfter(node.key, isClosingBracketToken)!
        const keyRange: [number, number] = [bracketTokenL.range[1], bracketTokenR.range[0]]

        if (bracketTokenL !== firstToken)
          offsets.setDesiredOffset(bracketTokenL, firstToken, 0)

        offsets.setDesiredOffsets(keyRange, bracketTokenL, 1)
        offsets.setDesiredOffset(bracketTokenR, bracketTokenL, 0)
      }
      else {
        const idToken = keyLastToken = sourceCode.getFirstToken(node.key)!

        if (!node.decorators?.length && idToken !== firstToken)
          offsets.setDesiredOffset(idToken, firstToken, 1)
      }

      // Indent initializer.
      if (node.value) {
        const operator = sourceCode.getTokenBefore(node.value, isEqToken)!
        checkAssignmentOperator(operator)

        if (isSemicolonToken(lastToken))
          offsets.setDesiredOffset(lastToken, operator, 1)
      }
      else if (isSemicolonToken(lastToken)) {
        // TODO: ignore like `VariableDeclaration`
        offsets.setDesiredOffset(lastToken, keyLastToken, 1)
      }
    }

    const baseOffsetListeners: RuleListener = {
      'ArrayExpression': checkArrayLikeNode,

      'ArrayPattern': checkArrayLikeNode,

      ObjectExpression(node) {
        checkObjectLikeNode(node, node.properties)
      },

      ObjectPattern(node) {
        checkObjectLikeNode(node, node.properties)
      },

      ArrowFunctionExpression(node) {
        const maybeOpeningParen = sourceCode.getFirstToken(node, { skip: node.async ? 1 : 0 })!

        if (isOpeningParenToken(maybeOpeningParen)) {
          const openingParen = maybeOpeningParen
          const closingParen = sourceCode.getTokenBefore(
            node.returnType ?? node.body,
            { filter: isClosingParenToken },
          )!

          markParameterParen(openingParen)
          markParameterParen(closingParen)
          addElementListIndent(node.params, openingParen, closingParen, options.FunctionExpression.parameters)
        }

        addBlocklessNodeIndent(node.body)
      },

      AssignmentExpression(node) {
        const operator = sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator)!

        checkAssignmentOperator(operator)
      },

      AssignmentPattern(node) {
        const operator = sourceCode.getFirstTokenBetween(node.left, node.right, isEqToken)!

        checkAssignmentOperator(operator)
      },

      BinaryExpression(node) {
        checkOperatorToken(node.left, node.right, node.operator)
      },

      LogicalExpression(node) {
        checkOperatorToken(node.left, node.right, node.operator)
      },

      'BlockStatement': checkBlockLikeNode,

      'ClassBody': checkBlockLikeNode,

      'CallExpression': addFunctionCallIndent,

      ClassDeclaration(node) {
        if (!node.superClass)
          return

        checkHeritages(node, [node.superClass])
      },

      ClassExpression(node) {
        if (!node.superClass)
          return

        checkHeritages(node, [node.superClass])
      },

      ConditionalExpression(node) {
        checkConditionalNode(node, node.test, node.consequent, node.alternate)
      },

      'DoWhileStatement, WhileStatement, ForInStatement, ForOfStatement, WithStatement': function (
        node:
          | Tree.DoWhileStatement
          | Tree.WhileStatement
          | Tree.ForInStatement
          | Tree.ForOfStatement
          | Tree.WithStatement,
      ) {
        addBlocklessNodeIndent(node.body)
      },

      ExportNamedDeclaration(node) {
        if (node.declaration === null) {
          const closingCurly = node.source
            ? sourceCode.getTokenBefore(node.source, isClosingBraceToken)!
            : sourceCode.getLastToken(node, isClosingBraceToken)!

          // Indent the specifiers in `export {foo, bar, baz}`
          addElementListIndent(node.specifiers, sourceCode.getFirstToken(node, { skip: 1 })!, closingCurly, 1)

          if (node.source) {
            const fromToken = sourceCode.getTokenAfter(
              closingCurly,
              token => token.type === 'Identifier' && token.value === 'from',
            )!
            const lastToken = sourceCode.getLastToken(node, isNotSemicolonToken)!
            // Indent everything after and including the `from` token in `export {foo, bar, baz} from 'qux'`
            offsets.setDesiredOffsets([fromToken.range[0], lastToken.range[1]], sourceCode.getFirstToken(node)!, 1)

            const lastClosingCurly = sourceCode.getLastToken(node, isClosingBraceToken)
            if (lastClosingCurly && node.source.range[1] < lastClosingCurly.range[0]) {
              // Has attributes
              const openingCurly = sourceCode.getTokenAfter(node.source, isOpeningBraceToken)!
              const closingCurly = lastClosingCurly
              addElementListIndent(node.attributes, openingCurly, closingCurly, 1)
            }
          }
        }
      },

      ExportAllDeclaration(node) {
        const fromToken = sourceCode.getTokenAfter(
          node.exported || sourceCode.getFirstToken(node)!,
          token => token.type === 'Identifier' && token.value === 'from',
        )!
        const lastToken = sourceCode.getLastToken(node, isNotSemicolonToken)!

        // Indent everything after and including the `from` token in `export * from 'qux'`
        offsets.setDesiredOffsets([fromToken.range[0], lastToken.range[1]], sourceCode.getFirstToken(node)!, 1)

        const lastClosingCurly = sourceCode.getLastToken(node, isClosingBraceToken)
        if (lastClosingCurly && node.source.range[1] < lastClosingCurly.range[0]) {
          // Has attributes
          const openingCurly = sourceCode.getTokenAfter(node.source, isOpeningBraceToken)!
          const closingCurly = lastClosingCurly
          addElementListIndent(node.attributes, openingCurly, closingCurly, 1)
        }
      },

      ForStatement(node) {
        const forOpeningParen = sourceCode.getFirstToken(node, 1)!

        if (node.init)
          offsets.setDesiredOffsets(node.init.range, forOpeningParen, 1)

        if (node.test)
          offsets.setDesiredOffsets(node.test.range, forOpeningParen, 1)

        if (node.update)
          offsets.setDesiredOffsets(node.update.range, forOpeningParen, 1)

        addBlocklessNodeIndent(node.body)
      },

      'FunctionDeclaration, FunctionExpression': function (node: Tree.FunctionDeclaration | Tree.FunctionExpression) {
        const paramsClosingParen = sourceCode.getTokenBefore(
          node.returnType ?? node.body,
          { filter: isClosingParenToken },
        )!

        const paramsOpeningParen = sourceCode.getTokenBefore(
          node.params.length
            ? (node.params[0].decorators?.[0] ?? node.params[0])
            : paramsClosingParen,
          { filter: isOpeningParenToken },
        )!

        markParameterParen(paramsOpeningParen)
        markParameterParen(paramsClosingParen)
        addElementListIndent(node.params, paramsOpeningParen, paramsClosingParen, options[node.type].parameters)

        if (node.returnType) {
          offsets.setDesiredOffsets(node.returnType.range, paramsClosingParen, options[node.type].returnType)
        }
      },

      IfStatement(node) {
        addBlocklessNodeIndent(node.consequent)
        if (node.alternate)
          addBlocklessNodeIndent(node.alternate)
      },

      /**
       * For blockless nodes with semicolon-first style, don't indent the semicolon.
       * e.g.
       * if (foo)
       *     bar()
       * ; [1, 2, 3].map(foo)
       *
       * Traversal into the node sets indentation of the semicolon, so we need to override it on exit.
       */
      ':matches(DoWhileStatement, ForStatement, ForInStatement, ForOfStatement, IfStatement, WhileStatement, WithStatement):exit': function (
        node: Tree.DoWhileStatement | Tree.ForStatement | Tree.ForInStatement | Tree.ForOfStatement | Tree.IfStatement | Tree.WhileStatement | Tree.WithStatement,
      ) {
        let nodesToCheck

        if (node.type === 'IfStatement') {
          nodesToCheck = [node.consequent]
          if (node.alternate)
            nodesToCheck.push(node.alternate)
        }
        else {
          nodesToCheck = [node.body]
        }

        for (const nodeToCheck of nodesToCheck) {
          const lastToken = sourceCode.getLastToken(nodeToCheck)!

          if (isSemicolonToken(lastToken)) {
            const tokenBeforeLast = getTokenBeforeToken(lastToken)!
            const tokenAfterLast = getTokenAfterToken(lastToken)

            // override indentation of `;` only if its line looks like a semicolon-first style line
            if (
              !isTokenOnSameLine(tokenBeforeLast, lastToken)
              && tokenAfterLast
              && isTokenOnSameLine(lastToken, tokenAfterLast)
            ) {
              offsets.setDesiredOffset(
                lastToken,
                sourceCode.getFirstToken(node)!,
                0,
              )
            }
          }
        }
      },

      ImportDeclaration(node) {
        if (node.specifiers.some(specifier => specifier.type === 'ImportSpecifier')) {
          const openingCurly = sourceCode.getFirstToken(node, isOpeningBraceToken)!
          const closingCurly = sourceCode.getTokenBefore(node.source, isClosingBraceToken)!

          addElementListIndent(node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier'), openingCurly, closingCurly, options.ImportDeclaration)
        }

        const fromToken = node.specifiers.length
          ? sourceCode.getTokenAfter(node.specifiers[node.specifiers.length - 1], token => token.type === 'Identifier' && token.value === 'from')
          : sourceCode.getFirstToken(node, token => token.type === 'Identifier' && token.value === 'from')
        const lastToken = sourceCode.getLastToken(node, isNotSemicolonToken)!
        if (fromToken) {
          offsets.setDesiredOffsets([fromToken.range[0], lastToken.range[1]], sourceCode.getFirstToken(node)!, 1)
        }

        const lastClosingCurly = sourceCode.getLastToken(node, isClosingBraceToken)
        if (lastClosingCurly && node.source.range[1] < lastClosingCurly.range[0]) {
          // Has attributes
          const openingCurly = sourceCode.getTokenAfter(node.source, isOpeningBraceToken)!
          const closingCurly = lastClosingCurly

          if (!fromToken) {
            const withToken = sourceCode.getTokenBefore(openingCurly, token => token.value === 'with')!
            offsets.setDesiredOffsets([withToken.range[0], lastToken.range[1]], sourceCode.getFirstToken(node)!, 1)
          }

          addElementListIndent(node.attributes, openingCurly, closingCurly, 1)
        }
      },

      ImportExpression(node) {
        const openingParen = sourceCode.getFirstToken(node, 1)!
        const closingParen = sourceCode.getLastToken(node)!

        markParameterParen(openingParen)
        markParameterParen(closingParen)
        offsets.setDesiredOffset(openingParen, getTokenBeforeToken(openingParen)!, 0)

        addElementListIndent([node.source], openingParen, closingParen, options.CallExpression.arguments)
      },

      MemberExpression(node) {
        checkMemberExpression(node, node.object, node.property, node.computed)
      },

      MetaProperty(node) {
        checkMemberExpression(node, node.meta, node.property)
      },

      NewExpression(node) {
        // Only indent the arguments if the NewExpression has parens (e.g. `new Foo(bar)` or `new Foo()`, but not `new Foo`
        if (node.arguments.length > 0
          || isClosingParenToken(sourceCode.getLastToken(node)!)
          && isOpeningParenToken(sourceCode.getLastToken(node, 1)!)) {
          addFunctionCallIndent(node)
        }
      },

      Property(node) {
        if (!node.shorthand && !node.method && node.kind === 'init') {
          const colon = sourceCode.getFirstTokenBetween(node.key, node.value, isColonToken)!

          offsets.ignoreToken(getTokenAfterToken(colon)!)
        }
      },

      'PropertyDefinition': checkClassProperty,
      'AccessorProperty': checkClassProperty,
      'TSAbstractPropertyDefinition': checkClassProperty,
      'TSAbstractAccessorProperty': checkClassProperty,

      StaticBlock(node) {
        const openingCurly = sourceCode.getFirstToken(node, { skip: 1 })! // skip the `static` token
        const closingCurly = sourceCode.getLastToken(node)!

        addElementListIndent(node.body, openingCurly, closingCurly, options.StaticBlock.body)
      },

      SwitchStatement(node) {
        const openingCurly = sourceCode.getTokenAfter(node.discriminant, isOpeningBraceToken)!
        const closingCurly = sourceCode.getLastToken(node)!

        offsets.setDesiredOffsets([openingCurly.range[1], closingCurly.range[0]], openingCurly, options.SwitchCase)

        if (node.cases.length) {
          getCommentsBetween(
            sourceCode,
            node.cases[node.cases.length - 1],
            closingCurly,
          ).forEach(token => offsets.ignoreToken(token))
        }
      },

      SwitchCase(node) {
        if (!(node.consequent.length === 1 && node.consequent[0].type === 'BlockStatement')) {
          const caseKeyword = sourceCode.getFirstToken(node)!
          const tokenAfterCurrentCase = sourceCode.getTokenAfter(node)!

          offsets.setDesiredOffsets([caseKeyword.range[1], tokenAfterCurrentCase.range[0]], caseKeyword, 1)
        }
      },

      TemplateLiteral(node) {
        node.expressions.forEach((expression, index) => {
          const previousQuasi = node.quasis[index]
          const nextQuasi = node.quasis[index + 1]
          const tokenToAlignFrom = isSingleLine(previousQuasi)
            ? sourceCode.getFirstToken(previousQuasi)
            : null

          const startsOnSameLine = isTokenOnSameLine(previousQuasi, expression)
          const endsOnSameLine = isTokenOnSameLine(expression, nextQuasi)

          if (tokenToAlignFrom || (endsOnSameLine && !startsOnSameLine)) {
            offsets.setDesiredOffsets([previousQuasi.range[1], nextQuasi.range[0]], tokenToAlignFrom, 1)
            offsets.setDesiredOffset(sourceCode.getFirstToken(nextQuasi), tokenToAlignFrom, 0)
            return
          }

          /*
            Make block based on ${ line indent, unless expression starts with a new line but ends on same line
            Exception example: `
              expression starting with new line ${
                  'ending'} on the same line
            `
          */

          // minus 2 for exclude ${
          const tokenBeforeText = sourceCode.text.slice(previousQuasi.range[1] - previousQuasi.loc.end.column, previousQuasi.range[1] - 2).split('')
          let numIndentation = tokenBeforeText.findIndex(char => char !== ' ' && char !== '\t')
          if (numIndentation === -1) {
            numIndentation = tokenBeforeText.length
          }

          const numSpaces = tokenBeforeText.slice(0, numIndentation).filter(char => char === ' ').length
          const numTabs = numIndentation - numSpaces
          const indentOffset = numTabs + Math.ceil(numSpaces / (indentType === 'tab' ? options.tabLength : indentSize))
          const innerIndentation = endsOnSameLine
            ? indentOffset
            : indentOffset + 1
          offsets.setDesiredOffsets([previousQuasi.range[1], nextQuasi.range[0]], tokenToAlignFrom, innerIndentation)
          offsets.setDesiredOffset(sourceCode.getFirstToken(nextQuasi), tokenToAlignFrom, indentOffset)
        })
      },

      VariableDeclaration(node) {
        // https://github.com/typescript-eslint/typescript-eslint/issues/441
        if (node.declarations.length === 0)
          return

        const kind = node.kind === 'await using' ? 'using' : node.kind
        let variableIndent = Object.hasOwn(options.VariableDeclarator, kind)
          ? options.VariableDeclarator[kind]
          : DEFAULT_VARIABLE_INDENT
        const alignFirstVariable = variableIndent === 'first'

        const firstToken = sourceCode.getFirstToken(node)!
        const lastToken = sourceCode.getLastToken(node)!

        const hasDeclaratorOnNewLine = node.declarations.at(-1)!.loc.start.line > node.loc.start.line

        if (hasDeclaratorOnNewLine) {
          if (alignFirstVariable) {
            addElementListIndent(
              node.declarations,
              firstToken,
              lastToken,
              variableIndent,
            )

            const firstTokenOfFirstElement = sourceCode.getFirstToken(node.declarations[0])!

            variableIndent = (tokenInfo.getTokenIndent(firstTokenOfFirstElement).length - tokenInfo.getTokenIndent(firstToken).length) / indentSize
          }

          /**
           * VariableDeclarator indentation is a bit different from other forms of indentation, in that the
           * indentation of an opening bracket sometimes won't match that of a closing bracket. For example,
           * the following indentations are correct:
           *
           * var foo = {
           *   ok: true
           * };
           *
           * var foo = {
           *     ok: true,
           *   },
           *   bar = 1;
           *
           * Account for when exiting the AST (after indentations have already been set for the nodes in
           * the declaration) by manually increasing the indentation level of the tokens in this declarator
           * on the same line as the start of the declaration, provided that there are declarators that
           * follow this one.
           */
          offsets.setDesiredOffsets(node.range, firstToken, variableIndent, true)
        }
        else {
          if (alignFirstVariable)
            variableIndent = DEFAULT_VARIABLE_INDENT

          offsets.setDesiredOffsets(node.range, firstToken, variableIndent)
        }

        if (isSemicolonToken(lastToken))
          offsets.ignoreToken(lastToken)
      },

      VariableDeclarator(node) {
        if (node.init) {
          const operator = sourceCode.getTokenBefore(node.init, isNotOpeningParenToken)!
          checkAssignmentOperator(operator)
        }

        const lastToken = sourceCode.getLastToken(node)!
        if (isSemicolonToken(lastToken))
          offsets.ignoreToken(lastToken)
      },

      JSXText(node) {
        if (!node.parent)
          return
        if (node.parent.type !== 'JSXElement' && node.parent.type !== 'JSXFragment')
          return

        const nodeIndentRegExp = new RegExp(`\n(${offsets._indentType}*)[\t ]*\\S`, 'g')
        const nodeIndentsPerLine = Array.from(
          String(node.value).matchAll(nodeIndentRegExp),
          match => (match[1] ? match[1].length : 0),
        )

        if (nodeIndentsPerLine.length === 0)
          return

        const parentIndentText = sourceCode.lines[node.parent.loc.start.line - 1].slice(0, node.parent.loc.start.column)
        const parentIndent = new RegExp(`^[${offsets._indentType}]+`).exec(parentIndentText)
        const parentIndentSize = parentIndent ? parentIndent[0].length : 0

        const targetIndent = parentIndentSize + indentSize

        nodeIndentsPerLine.forEach((nodeIndent) => {
          if (nodeIndent === targetIndent)
            return

          context.report({
            node,
            messageId: 'wrongIndentation',
            data: createErrorMessageData(targetIndent, nodeIndent, nodeIndent),
            fix(fixer) {
              const indentStr = new Array(targetIndent + 1).join(offsets._indentType)
              const regExp = /\n[\t ]*(\S)/g
              const fixedText = node.raw.replace(regExp, (match, p1) => `\n${indentStr}${p1}`)
              return fixer.replaceText(node, fixedText)
            },
          })
        })
      },

      JSXAttribute(node) {
        if (!node.value)
          return

        const operator = sourceCode.getFirstTokenBetween(node.name, node.value, isEqToken)!
        checkAssignmentOperator(operator)
      },

      JSXElement(node) {
        if (node.closingElement) {
          addElementListIndent(
            node.children,
            sourceCode.getFirstToken(node.openingElement)!,
            sourceCode.getFirstToken(node.closingElement)!,
            1,
          )
        }
      },

      JSXOpeningElement(node) {
        const firstToken = sourceCode.getFirstToken(node)!
        let closingToken

        if (node.selfClosing) {
          closingToken = sourceCode.getLastToken(node, { skip: 1 })!
          offsets.setDesiredOffset(sourceCode.getLastToken(node)!, closingToken, 0)
        }
        else {
          closingToken = sourceCode.getLastToken(node)!
        }
        offsets.setDesiredOffsets(node.name.range, firstToken, 0)
        addElementListIndent(node.attributes, firstToken, closingToken, 1)
      },

      JSXClosingElement(node) {
        const firstToken = sourceCode.getFirstToken(node)

        offsets.setDesiredOffsets(node.name.range, firstToken, 1)
      },

      JSXFragment(node) {
        const firstOpeningToken = sourceCode.getFirstToken(node.openingFragment)!
        const firstClosingToken = sourceCode.getFirstToken(node.closingFragment)!

        addElementListIndent(node.children, firstOpeningToken, firstClosingToken, 1)
      },

      JSXOpeningFragment(node) {
        const firstToken = sourceCode.getFirstToken(node)!
        const closingToken = sourceCode.getLastToken(node)!

        offsets.setDesiredOffsets(node.range, firstToken, 1)
        offsets.matchOffsetOf(firstToken, closingToken)
      },

      JSXClosingFragment(node) {
        const firstToken = sourceCode.getFirstToken(node)!
        const closingToken = sourceCode.getLastToken(node)!

        offsets.setDesiredOffsets(node.range, firstToken, 1)

        const slashToken = sourceCode.getLastToken(node, token => token.value === '/')
        if (slashToken) {
          const tokenToMatch = isTokenOnSameLine(slashToken, closingToken) ? slashToken : closingToken

          offsets.matchOffsetOf(firstToken, tokenToMatch)
        }
      },

      JSXExpressionContainer(node) {
        const openingCurly = sourceCode.getFirstToken(node)!
        const closingCurly = sourceCode.getLastToken(node)!

        offsets.setDesiredOffsets(
          [openingCurly.range[1], closingCurly.range[0]],
          openingCurly,
          1,
        )
      },

      JSXSpreadAttribute(node) {
        const openingCurly = sourceCode.getFirstToken(node)!
        const closingCurly = sourceCode.getLastToken(node)!

        offsets.setDesiredOffsets(
          [openingCurly.range[1], closingCurly.range[0]],
          openingCurly,
          1,
        )
      },

      JSXMemberExpression(node) {
        checkMemberExpression(node, node.object, node.property)
      },

      TSTypeAliasDeclaration(node) {
        const operator = sourceCode.getTokenBefore(node.typeAnnotation, isNotOpeningParenToken)!
        checkAssignmentOperator(operator)

        const lastToken = sourceCode.getLastToken(node)!
        if (isSemicolonToken(lastToken))
          offsets.ignoreToken(lastToken)
      },

      'TSTupleType': checkArrayLikeNode,

      'TSEnumBody': checkBlockLikeNode,

      TSEnumMember(node) {
        if (!node.initializer)
          return

        const operator = sourceCode.getTokenBefore(node.initializer, isEqToken)!
        checkAssignmentOperator(operator)
      },

      TSTypeLiteral(node) {
        checkObjectLikeNode(node, node.members)
      },

      TSMappedType(node) {
        const startToken = sourceCode.getFirstToken(node, isOpeningBraceToken)!
        const endToken = sourceCode.getLastToken(node, isClosingBraceToken)!

        offsets.setDesiredOffsets([startToken.range[1], endToken.range[0]], startToken, 1)
        offsets.setDesiredOffset(endToken, startToken, 0)
      },

      TSAsExpression(node) {
        checkOperatorToken(node.expression, node.typeAnnotation, 'as')
      },

      // TODO: TSSatisfiesExpression

      TSConditionalType(node) {
        checkConditionalNode(node, node.extendsType, node.trueType, node.falseType)
      },

      TSImportEqualsDeclaration(node) {
        if (node.moduleReference) {
          const operator = sourceCode.getTokenBefore(node.moduleReference, isEqToken)!
          checkAssignmentOperator(operator)
        }

        const lastToken = sourceCode.getLastToken(node)!
        if (isSemicolonToken(lastToken))
          offsets.ignoreToken(lastToken)
      },

      TSIndexedAccessType(node) {
        checkMemberExpression(node, node.objectType, node.indexType, true)
      },

      'TSInterfaceBody': checkBlockLikeNode,

      TSInterfaceDeclaration(node) {
        if (node.extends.length === 0)
          return

        checkHeritages(node, node.extends)
      },

      TSQualifiedName(node) {
        checkMemberExpression(node, node.left, node.right)
      },

      TSTypeParameter(node) {
        if (!node.default)
          return

        const operator = sourceCode.getTokenBefore(node.default, isEqToken)!
        checkAssignmentOperator(operator)
      },

      TSTypeParameterDeclaration(node) {
        if (!node.params.length)
          return

        const firstToken = sourceCode.getFirstToken(node)!
        const closingToken = sourceCode.getLastToken(node)!

        addElementListIndent(node.params, firstToken, closingToken, 1)
      },

      TSTypeParameterInstantiation(node) {
        if (!node.params.length)
          return

        const firstToken = sourceCode.getFirstToken(node)!
        const closingToken = sourceCode.getLastToken(node)!

        addElementListIndent(node.params, firstToken, closingToken, 1)
      },

      'TSModuleBlock': checkBlockLikeNode,

      '*': function (node: ASTNode) {
        const firstToken = sourceCode.getFirstToken(node)

        // Ensure that the children of every node are indented at least as much as the first token.
        if (firstToken && !ignoredNodeFirstTokens.has(firstToken))
          offsets.setDesiredOffsets(node.range, firstToken, 0)
      },
    }

    const listenerCallQueue: { listener?: RuleFunction<any>, node: ASTNode }[] = []

    /**
     * To ignore the indentation of a node:
     * 1. Don't call the node's listener when entering it (if it has a listener)
     * 2. Don't set any offsets against the first token of the node.
     * 3. Call `ignoreNode` on the node sometime after exiting it and before validating offsets.
     */
    const offsetListeners: Record<string, (node: ASTNode) => void> = {}

    for (const [selector, listener] of Object.entries(baseOffsetListeners)) {
      /**
       * Offset listener calls are deferred until traversal is finished, and are called as
       * part of the final `Program:exit` listener. This is necessary because a node might
       * be matched by multiple selectors.
       *
       * Example: Suppose there is an offset listener for `Identifier`, and the user has
       * specified in configuration that `MemberExpression > Identifier` should be ignored.
       * Due to selector specificity rules, the `Identifier` listener will get called first. However,
       * if a given Identifier node is supposed to be ignored, then the `Identifier` offset listener
       * should not have been called at all. Without doing extra selector matching, we don't know
       * whether the Identifier matches the `MemberExpression > Identifier` selector until the
       * `MemberExpression > Identifier` listener is called.
       *
       * To avoid this, the `Identifier` listener isn't called until traversal finishes and all
       * ignored nodes are known.
       */
      offsetListeners[selector] = node => listenerCallQueue.push({ listener: listener as RuleFunction<any>, node })
    }

    // For each ignored node selector, set up a listener to collect it into the `ignoredNodes` set.
    const ignoredNodes = new Set<ASTNode>()

    /**
     * Ignores a node
     * @param node The node to ignore
     */
    function addToIgnoredNodes(node: ASTNode): void {
      ignoredNodes.add(node)
      ignoredNodeFirstTokens.add(sourceCode.getFirstToken(node)!)
    }

    const ignoredNodeListeners = options.ignoredNodes.reduce(
      (listeners, ignoredSelector) => Object.assign(listeners, { [ignoredSelector]: addToIgnoredNodes }),
      {},
    )

    return {
      // Listeners
      ...offsetListeners,

      // Ignored nodes
      ...ignoredNodeListeners,

      // overwrite the base rule here so we can use our KNOWN_NODES list instead
      '*:exit': function (node: ASTNode) {
        // For nodes we care about, skip the default handling, because it just marks the node as ignored...
        if (!KNOWN_NODES.has(node.type))
          addToIgnoredNodes(node)
      },

      'Program:exit': function () {
        // If ignoreComments option is enabled, ignore all comment tokens.
        if (options.ignoreComments) {
          sourceCode.getAllComments()
            .forEach(comment => offsets.ignoreToken(comment))
        }

        // Invoke the queued offset listeners for the nodes that aren't ignored.
        for (let i = 0; i < listenerCallQueue.length; i++) {
          const nodeInfo = listenerCallQueue[i]

          if (!ignoredNodes.has(nodeInfo.node))
            nodeInfo.listener?.(nodeInfo.node)
        }

        // Update the offsets for ignored nodes to prevent their child tokens from being reported.
        ignoredNodes.forEach(ignoreNode)

        /**
         * Create a Map from (tokenOrComment) => (precedingToken).
         * This is necessary because SourceCode.getTokenBefore does not handle a comment as an argument correctly.
         */
        const precedingTokens = new WeakMap<Token, NonCommentToken | null>()
        const followingTokens = new WeakMap<Token, NonCommentToken | null>()

        const resolveTokenBefore = (tokenOrComment: Token | null) => {
          if (!tokenOrComment)
            return null
          if (isCommentToken(tokenOrComment))
            return precedingTokens.get(tokenOrComment) ?? null
          return tokenOrComment
        }

        for (let i = 0; i < sourceCode.ast.comments.length; i++) {
          const comment = sourceCode.ast.comments[i]
          const tokenOrCommentBefore = sourceCode.getTokenBefore(comment, { includeComments: true })
          const tokenBefore = resolveTokenBefore(tokenOrCommentBefore)

          precedingTokens.set(comment, tokenBefore)

          if (!tokenInfo.isFirstTokenOfLine(comment))
            continue

          const tokenAfter = tokenBefore ? getTokenAfterToken(tokenBefore) : sourceTokens[0]

          followingTokens.set(comment, tokenAfter ?? null)
          offsets.markBaseToken(tokenBefore)
          offsets.markBaseToken(tokenAfter ?? null)

          /**
           * If a comment precedes a line that begins with a semicolon token, align to that token, i.e.
           *
           * let foo
           * // comment
           * ;(async () => {})()
           */
          if (tokenAfter && isSemicolonToken(tokenAfter) && !isTokenOnSameLine(comment, tokenAfter))
            offsets.setDesiredOffset(comment, tokenAfter, 0)
        }

        addParensIndent(sourceCode.ast.tokens)

        for (let i = 1; i <= lineCount; i++) {
          if (!tokenInfo.firstTokensByLineNumber[i]) {
            // Don't check indentation on blank lines
            continue
          }

          const firstTokenOfLine = tokenInfo.firstTokensByLineNumber[i]!

          if (firstTokenOfLine.loc.start.line !== i) {
            // Don't check the indentation of multi-line tokens (e.g. template literals or block comments) twice.
            continue
          }

          const indentStart = firstTokenOfLine.range[0] - firstTokenOfLine.loc.start.column
          const indentLength = firstTokenOfLine.loc.start.column

          if (isCommentToken(firstTokenOfLine)) {
            const tokenBefore = precedingTokens.get(firstTokenOfLine)
            const tokenAfter = followingTokens.get(firstTokenOfLine)
            const mayAlignWithBefore = !!tokenBefore && !hasBlankLinesBetween(tokenBefore, firstTokenOfLine)
            const mayAlignWithAfter = !!tokenAfter && !hasBlankLinesBetween(firstTokenOfLine, tokenAfter)

            // If a comment matches the expected indentation of the token immediately before or after, don't report it.
            if (
              mayAlignWithBefore && isIndentMatchRange(indentStart, indentLength, offsets.getDesiredIndentValue(tokenBefore!))
              || mayAlignWithAfter && isIndentMatchRange(indentStart, indentLength, offsets.getDesiredIndentValue(tokenAfter!))
            ) {
              continue
            }
          }

          const desiredIndent = offsets.getDesiredIndentValue(firstTokenOfLine)

          // If the token matches the expected indentation, don't report it.
          if (isIndentMatchRange(indentStart, indentLength, desiredIndent))
            continue

          // Otherwise, report the token/comment.
          const neededIndent = typeof desiredIndent === 'string'
            ? desiredIndent
            : indentChar.repeat(desiredIndent)

          report(firstTokenOfLine, neededIndent, indentStart, indentLength)
        }
      },
    }
  },
})
