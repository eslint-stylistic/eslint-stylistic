import type { ASTNode, SourceCode, Token, Tree } from '#types'
import type { RuleOptions } from '../types'
import type { OffsetStorage } from './offset-storage'
import type { TokenInfo } from './token-info'
import {
  AST_NODE_TYPES,
  createGlobalLinebreakMatcher,
  isClosingBraceToken,
  isClosingBracketToken,
  isClosingParenToken,
  isColonToken,
  isEqToken,
  isNotClosingParenToken,
  isNotOpeningParenToken,
  isOpeningBraceToken,
  isOpeningBracketToken,
  isOpeningParenToken,
  isOptionalChainPunctuator,
  isQuestionToken,
  isSemicolonToken,
  isTokenOnSameLine,
  skipChainExpression,
  STATEMENT_LIST_PARENTS,
} from '#utils/ast'

type ElementListOffset = 'first' | 'off' | number

export interface IndentConfig {
  SwitchCase: number
  VariableDeclarator: {
    var: number | 'first'
    let: number | 'first'
    const: number | 'first'
    using: number | 'first'
  }
  outerIIFEBody: number | 'off'
  assignmentOperator: number | 'off'
  FunctionDeclaration: { parameters: number | 'first' | 'off', body: number, returnType: number }
  FunctionExpression: { parameters: number | 'first' | 'off', body: number, returnType: number }
  StaticBlock: { body: number }
  CallExpression: { arguments: number | 'first' | 'off' }
  MemberExpression: number | 'off'
  ArrayExpression: number | 'first' | 'off'
  ObjectExpression: number | 'first' | 'off'
  ImportDeclaration: number | 'first' | 'off'
  flatTernaryExpressions: boolean
  ignoredNodes: string[]
  ignoreComments: boolean
  offsetTernaryExpressions: NonNullable<RuleOptions[1]>['offsetTernaryExpressions']
  tabLength: number
}

export interface IndentContext {
  sourceCode: SourceCode
  offsets: OffsetStorage
  tokenInfo: TokenInfo
  parameterParens: WeakSet<Token>
  indentSize: number
  indentType: 'space' | 'tab'
  options: IndentConfig
  ternaryOptions: false | Partial<Record<string, boolean>>
}

/**
 * Check to see if the node is a file level IIFE
 * @param node The function node to check.
 * @returns True if the node is the outer IIFE
 */
export function isOuterIIFE(node: ASTNode) {
  if (!node.parent || node.parent.type !== 'CallExpression' || node.parent.callee !== node)
    return false

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
export function countTrailingLinebreaks(string: string) {
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
export function addElementListIndent(
  ctx: IndentContext,
  elements: (ASTNode | null)[],
  startToken: Token,
  endToken: Token,
  offset: ElementListOffset,
) {
  const { sourceCode, offsets, tokenInfo } = ctx

  if (isTokenOnSameLine(startToken, endToken))
    return

  function getFirstToken(element: ASTNode) {
    let token: Token = sourceCode.getTokenBefore(element)!

    while (isOpeningParenToken(token) && token !== startToken)
      token = sourceCode.getTokenBefore(token)!

    return sourceCode.getTokenAfter(token)!
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

  elements
    .forEach((element, index) => {
      if (!element) {
        // Skip holes in arrays
        return
      }
      if (offset === 'off') {
        // Ignore the first token of every element if the "off" option is used
        offsets.ignoreToken(getFirstToken(element))
      }

      // Offset the following elements correctly relative to the first element
      if (index === 0)
        return

      if (offset === 'first' && tokenInfo.isFirstTokenOfLine(getFirstToken(element))) {
        offsets.matchOffsetOf(getFirstToken(elements[0]!), getFirstToken(element))
      }
      else {
        const previousElement = elements[index - 1]!
        const firstTokenOfPreviousElement = previousElement && getFirstToken(previousElement)!
        const previousElementLastToken = previousElement && sourceCode.getLastToken(previousElement)!

        if (
          previousElement && previousElementLastToken.loc.end.line - countTrailingLinebreaks(previousElementLastToken.value) > startToken.loc.end.line
        ) {
          offsets.setDesiredOffsets(
            [previousElement.range[1], element.range[1]],
            firstTokenOfPreviousElement,
            0,
          )
        }
      }
    })
}

/**
 * Check and decide whether to check for indentation for blockless nodes
 * Scenarios are for or while statements without braces around them
 * @param node node to examine
 */
export function addBlocklessNodeIndent(ctx: IndentContext, node: ASTNode) {
  const { sourceCode, offsets } = ctx

  if (node.type !== 'BlockStatement') {
    const lastParentToken = sourceCode.getTokenBefore(node, isNotOpeningParenToken)!

    let firstBodyToken = sourceCode.getFirstToken(node)!
    let lastBodyToken = sourceCode.getLastToken(node)!

    while (
      isOpeningParenToken(sourceCode.getTokenBefore(firstBodyToken)!)
      && isClosingParenToken(sourceCode.getTokenAfter(lastBodyToken)!)
    ) {
      firstBodyToken = sourceCode.getTokenBefore(firstBodyToken)!
      lastBodyToken = sourceCode.getTokenAfter(lastBodyToken)!
    }

    offsets.setDesiredOffsets([firstBodyToken.range[0], lastBodyToken.range[1]], lastParentToken, 1)
  }
}

/**
 * Checks the indentation for nodes that are like function calls (`CallExpression` and `NewExpression`)
 * @param node A CallExpression or NewExpression node
 */
export function addFunctionCallIndent(ctx: IndentContext, node: Tree.CallExpression | Tree.NewExpression) {
  const { sourceCode, offsets, parameterParens, options } = ctx
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

  parameterParens.add(openingParen)
  parameterParens.add(closingParen)

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
    const lastTokenOfCallee = sourceCode.getTokenBefore(dotToken)!
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

  addElementListIndent(ctx, node.arguments, openingParen, closingParen, options.CallExpression.arguments)
}

/**
 * Checks the indentation of parenthesized values, given a list of tokens in a program
 * @param tokens A list of tokens
 */
export function addParensIndent(ctx: IndentContext, tokens: Token[]) {
  const { sourceCode, offsets, parameterParens } = ctx
  const parenStack = []
  const parenPairs = []

  for (let i = 0; i < tokens.length; i++) {
    const nextToken = tokens[i]

    if (isOpeningParenToken(nextToken))
      parenStack.push(nextToken)
    else if (isClosingParenToken(nextToken))
      parenPairs.push({ left: parenStack.pop(), right: nextToken })
  }

  for (let i = parenPairs.length - 1; i >= 0; i--) {
    const leftParen = parenPairs[i].left!
    const rightParen = parenPairs[i].right!

    if (isTokenOnSameLine(leftParen, rightParen))
      continue

    // We only want to handle parens around expressions, so exclude parentheses that are in function parameters and function call arguments.
    if (!parameterParens.has(leftParen) && !parameterParens.has(rightParen)) {
      const parenthesizedTokens: Set<Token> = new Set(sourceCode.getTokensBetween(leftParen, rightParen))

      parenthesizedTokens.forEach((token) => {
        const dependency = offsets.getFirstDependency(token)

        if (!dependency || !parenthesizedTokens.has(dependency))
          offsets.setDesiredOffset(token, leftParen, 1)
      })
    }

    offsets.setDesiredOffset(rightParen, leftParen, 0)
  }
}

/**
 * Ignore all tokens within an unknown node whose offset do not depend
 * on another token's offset within the unknown node
 * @param node Unknown Node
 */
export function ignoreNode(ctx: IndentContext, node: ASTNode) {
  const { sourceCode, offsets, tokenInfo } = ctx
  const unknownNodeTokens: Set<Token> = new Set(sourceCode.getTokens(node, { includeComments: true }))

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
export function isOnFirstLineOfStatement(token: Token, leafNode: ASTNode): boolean {
  let node = leafNode

  while (node.parent && !node.parent.type.endsWith('Statement') && !node.parent.type.endsWith('Declaration'))
    node = node.parent

  node = node.parent!

  return !node || node.loc.start.line === token.loc.start.line
}

/**
 * Check indentation for assignment operator and its right-hand side
 */
export function checkAssignmentOperator(ctx: IndentContext, operator: Token) {
  const { sourceCode, offsets, options } = ctx
  const left = sourceCode.getTokenBefore(operator)!
  const right = sourceCode.getTokenAfter(operator)!

  if (typeof options.assignmentOperator === 'number') {
    offsets.setDesiredOffset(operator, left, options.assignmentOperator)
    offsets.setDesiredOffset(right, operator, options.assignmentOperator)
  }
  else {
    offsets.ignoreToken(operator)
    offsets.ignoreToken(right)
  }
}

/**
 * Check indentation for array-like nodes (ArrayExpression, ArrayPattern, TSTupleType)
 */
export function checkArrayLikeNode(ctx: IndentContext, node: Tree.ArrayExpression | Tree.ArrayPattern | Tree.TSTupleType) {
  const { sourceCode, options } = ctx
  const elementList = node.type === AST_NODE_TYPES.TSTupleType ? node.elementTypes : node.elements
  const openingBracket = sourceCode.getFirstToken(node)!
  const closingBracket = sourceCode.getTokenAfter([...elementList].reverse().find(_ => _) || openingBracket, isClosingBracketToken)!

  addElementListIndent(ctx, elementList, openingBracket, closingBracket, options.ArrayExpression)
}

/**
 * Check indentation for object-like nodes (ObjectExpression, ObjectPattern, TSEnumDeclaration, TSTypeLiteral)
 */
export function checkObjectLikeNode(ctx: IndentContext, node: Tree.ObjectExpression | Tree.ObjectPattern | Tree.TSEnumDeclaration | Tree.TSTypeLiteral, properties: ASTNode[]) {
  const { sourceCode, options } = ctx
  const openingCurly = sourceCode.getFirstToken(node, isOpeningBraceToken)!
  const closingCurly = sourceCode.getTokenAfter(
    properties.length ? properties[properties.length - 1] : openingCurly,
    isClosingBraceToken,
  )!

  addElementListIndent(ctx, properties, openingCurly, closingCurly, options.ObjectExpression)
}

/**
 * Check indentation for conditional/ternary expressions
 */
export function checkConditionalNode(
  ctx: IndentContext,
  node: Tree.ConditionalExpression | Tree.TSConditionalType,
  test: ASTNode,
  consequent: ASTNode,
  alternate: ASTNode,
) {
  const { sourceCode, offsets, options, ternaryOptions } = ctx
  const firstToken = sourceCode.getFirstToken(node)!

  // `flatTernaryExpressions` option is for the following style:
  // var a =
  //     foo > 0 ? bar :
  //     foo < 0 ? baz :
  //     /*else*/ qiz ;
  if (options.flatTernaryExpressions && isTokenOnSameLine(test, consequent) && !isOnFirstLineOfStatement(firstToken, node))
    return

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

  const firstConsequentToken = sourceCode.getTokenAfter(questionMarkToken)!
  const lastConsequentToken = sourceCode.getTokenBefore(colonToken)!
  const firstAlternateToken = sourceCode.getTokenAfter(colonToken)!

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

/**
 * Check indentation for binary/logical operator tokens
 */
export function checkOperatorToken(ctx: IndentContext, left: ASTNode, right: ASTNode, operator: string) {
  const { sourceCode, offsets } = ctx
  const operatorToken = sourceCode.getFirstTokenBetween(left, right, token => token.value === operator)!

  /**
   * For backwards compatibility, don't check BinaryExpression indents, e.g.
   * var foo = bar &&
   *                   baz;
   */

  const tokenAfterOperator = sourceCode.getTokenAfter(operatorToken)!
  offsets.ignoreToken(operatorToken)
  offsets.ignoreToken(tokenAfterOperator)
  offsets.setDesiredOffset(tokenAfterOperator, operatorToken, 0)
}

/**
 * Check indentation for member expressions
 */
export function checkMemberExpression(
  ctx: IndentContext,
  node: Tree.MemberExpression | Tree.JSXMemberExpression | Tree.MetaProperty | Tree.TSIndexedAccessType | Tree.TSQualifiedName,
  object: ASTNode,
  property: ASTNode,
  computed = false,
) {
  const { sourceCode, offsets, options } = ctx
  const firstNonObjectToken = sourceCode.getFirstTokenBetween(object, property, isNotClosingParenToken)!
  const secondNonObjectToken = sourceCode.getTokenAfter(firstNonObjectToken)!

  const objectParenCount = sourceCode.getTokensBetween(object, property, { filter: isClosingParenToken }).length
  const firstObjectToken = objectParenCount
    ? sourceCode.getTokenBefore(object, { skip: objectParenCount - 1 })!
    : sourceCode.getFirstToken(object)!
  const lastObjectToken = sourceCode.getTokenBefore(firstNonObjectToken)!
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

/**
 * Check indentation for block-like nodes (BlockStatement, ClassBody, TSInterfaceBody, TSEnumBody, TSModuleBlock)
 */
export function checkBlockLikeNode(ctx: IndentContext, node: Tree.BlockStatement | Tree.ClassBody | Tree.TSInterfaceBody | Tree.TSEnumBody | Tree.TSModuleBlock) {
  const { sourceCode, offsets, options } = ctx
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
    ctx,
    node.type === AST_NODE_TYPES.TSEnumBody ? node.members : node.body,
    sourceCode.getFirstToken(node)!,
    sourceCode.getLastToken(node)!,
    blockIndentLevel,
  )
}

/**
 * Check indentation for class/interface heritage clauses
 */
export function checkHeritages(ctx: IndentContext, node: Tree.ClassDeclaration | Tree.ClassExpression | Tree.TSInterfaceDeclaration, heritages: ASTNode[]) {
  const { sourceCode, offsets } = ctx
  const classToken = sourceCode.getFirstToken(node)!
  const extendsToken = sourceCode.getTokenBefore(heritages[0], isNotOpeningParenToken)!

  offsets.setDesiredOffsets([extendsToken.range[0], node.body.range[0]], classToken, 1)
}

/**
 * Check indentation for class properties
 */
export function checkClassProperty(ctx: IndentContext, node: Tree.PropertyDefinition | Tree.AccessorProperty | Tree.TSAbstractPropertyDefinition | Tree.TSAbstractAccessorProperty) {
  const { sourceCode, offsets } = ctx
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
    checkAssignmentOperator(ctx, operator)

    if (isSemicolonToken(lastToken))
      offsets.setDesiredOffset(lastToken, operator, 1)
  }
  else if (isSemicolonToken(lastToken)) {
    // TODO: ignore like `VariableDeclaration`
    offsets.setDesiredOffset(lastToken, keyLastToken, 1)
  }
}
