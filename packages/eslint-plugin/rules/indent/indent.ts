/**
 * Note this file is rather type-unsafe in its current state.
 * This is due to some really funky type conversions between different node types.
 * This is done intentionally based on the internal implementation of the base indent rule.
 */

import type { ASTNode, JSONSchema, NodeTypes, RuleFunction, RuleListener, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { AST_NODE_TYPES, createGlobalLinebreakMatcher, getCommentsBetween, isClosingBraceToken, isClosingBracketToken, isClosingParenToken, isColonToken, isCommentToken, isEqToken, isNotClosingParenToken, isNotOpeningParenToken, isNotSemicolonToken, isOpeningBraceToken, isOpeningBracketToken, isOpeningParenToken, isOptionalChainPunctuator, isQuestionToken, isSemicolonToken, isSingleLine, isTokenOnSameLine, skipChainExpression, STATEMENT_LIST_PARENTS } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { isESTreeSourceCode } from '#utils/eslint-core'
import { OffsetStorage } from './utils/offset-storage'
import { TokenInfo } from './utils/token-info'

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

type ElementListOffset = 'first' | 'off' | number

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
          binaryOps: {
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
      tabLength: 4,
      binaryOps: 1 as BinaryOpsOption,
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
    const tokenInfo = new TokenInfo(sourceCode)
    const offsets = new OffsetStorage(tokenInfo, indentSize, indentType === 'space' ? ' ' : '\t', sourceCode.text.length)
    const parameterParens = new WeakSet()

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

    /**
     * Reports a given indent violation
     * @param token Token violating the indent rule
     * @param neededIndent Expected indentation string
     */
    function report(token: Token, neededIndent: string) {
      const actualIndent = Array.from(tokenInfo.getTokenIndent(token))
      const numSpaces = actualIndent.filter(char => char === ' ').length
      const numTabs = actualIndent.filter(char => char === '\t').length

      context.report({
        node: token,
        messageId: 'wrongIndentation',
        data: createErrorMessageData(neededIndent.length, numSpaces, numTabs),
        loc: {
          start: { line: token.loc.start.line, column: 0 },
          end: { line: token.loc.start.line, column: token.loc.start.column },
        },
        fix(fixer) {
          const range = [token.range[0] - token.loc.start.column, token.range[0]] as [number, number]
          const newText = neededIndent

          return fixer.replaceTextRange(range, newText)
        },
      })
    }

    /**
     * Checks if a token's indentation is correct
     * @param token Token to examine
     * @param desiredIndent Desired indentation of the string
     * @returns `true` if the token's indentation is correct
     */
    function validateTokenIndent(token: Token, desiredIndent: string): boolean {
      const indentation = tokenInfo.getTokenIndent(token)

      return indentation === desiredIndent
    }

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
    function addElementListIndent(elements: (ASTNode | null)[], startToken: Token, endToken: Token, offset: ElementListOffset) {
      if (isTokenOnSameLine(startToken, endToken))
        return

      /**
       * Gets the first token of a given element, including surrounding parentheses.
       * @param element A node in the `elements` list
       * @returns The first token of this element
       */
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
    function addBlocklessNodeIndent(node: ASTNode) {
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

      addElementListIndent(node.arguments, openingParen, closingParen, options.CallExpression.arguments)
    }

    /**
     * Checks the indentation of parenthesized values, given a list of tokens in a program
     * @param tokens A list of tokens
     */
    function addParensIndent(tokens: Token[]) {
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
    function ignoreNode(node: ASTNode) {
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

      if (firstTokenLine === secondTokenLine || firstTokenLine === secondTokenLine - 1)
        return false

      for (let line = firstTokenLine + 1; line < secondTokenLine; ++line) {
        if (!tokenInfo.firstTokensByLineNumber.has(line))
          return true
      }

      return false
    }

    const ignoredNodeFirstTokens = new Set<Token>()

    function checkAssignmentOperator(operator: Token) {
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

    const ternaryOptions: false | Partial<Record<NodeTypes, boolean>> = options.offsetTernaryExpressions !== false
      ? {
          CallExpression: true,
          AwaitExpression: true,
          NewExpression: true,
          ...options.offsetTernaryExpressions === true ? {} : options.offsetTernaryExpressions,
        }
      : false

    function checkConditionalNode(node: Tree.ConditionalExpression | Tree.TSConditionalType, test: ASTNode, consequent: ASTNode, alternate: ASTNode) {
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

    function checkOperatorToken(left: ASTNode, right: ASTNode, operator: string) {
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

    function checkMemberExpression(
      node: Tree.MemberExpression | Tree.JSXMemberExpression | Tree.MetaProperty | Tree.TSIndexedAccessType | Tree.TSQualifiedName,
      object: ASTNode,
      property: ASTNode,
      computed = false,
    ) {
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

          parameterParens.add(openingParen)
          parameterParens.add(closingParen)
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

        parameterParens.add(paramsOpeningParen)
        parameterParens.add(paramsClosingParen)
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
            const tokenBeforeLast = sourceCode.getTokenBefore(lastToken)!
            const tokenAfterLast = sourceCode.getTokenAfter(lastToken)

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

        parameterParens.add(openingParen)
        parameterParens.add(closingParen)
        offsets.setDesiredOffset(openingParen, sourceCode.getTokenBefore(openingParen)!, 0)

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

          offsets.ignoreToken(sourceCode.getTokenAfter(colon)!)
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
        const variableIndent = Object.hasOwn(options.VariableDeclarator, kind)
          ? options.VariableDeclarator[kind]
          : DEFAULT_VARIABLE_INDENT
        const alignFirstVariable = variableIndent === 'first'
        let numericVariableIndent = alignFirstVariable ? DEFAULT_VARIABLE_INDENT : variableIndent

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
            const firstTokenOfFirstTokenLine = tokenInfo.getFirstTokenOfLine(firstToken)!
            const firstVariableIndentWidth = tokenInfo.getTokenIndent(firstTokenOfFirstElement).length - tokenInfo.getTokenIndent(firstTokenOfFirstTokenLine).length

            numericVariableIndent = indentSize === 0 ? 0 : firstVariableIndentWidth / indentSize
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
          offsets.setDesiredOffsets(node.range, firstToken, numericVariableIndent, true)
        }
        else {
          offsets.setDesiredOffsets(node.range, firstToken, numericVariableIndent)
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
        if (firstToken && !ignoredNodeFirstTokens.has(firstToken) && !isSingleLine(node))
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

        addParensIndent(sourceCode.ast.tokens)

        /**
         * Create a Map from (tokenOrComment) => (precedingToken).
         * This is necessary because sourceCode.getTokenBefore does not handle a comment as an argument correctly.
         */
        const precedingTokens = new WeakMap()

        for (let i = 0; i < sourceCode.ast.comments.length; i++) {
          const comment = sourceCode.ast.comments[i]

          const tokenOrCommentBefore = sourceCode.getTokenBefore(comment, { includeComments: true })!
          const hasToken = precedingTokens.has(tokenOrCommentBefore)
            ? precedingTokens.get(tokenOrCommentBefore)
            : tokenOrCommentBefore

          precedingTokens.set(comment, hasToken)
        }

        for (let i = 1; i < sourceCode.lines.length + 1; i++) {
          if (!tokenInfo.firstTokensByLineNumber.has(i)) {
            // Don't check indentation on blank lines
            continue
          }

          const firstTokenOfLine = tokenInfo.firstTokensByLineNumber.get(i)!

          if (firstTokenOfLine.loc.start.line !== i) {
            // Don't check the indentation of multi-line tokens (e.g. template literals or block comments) twice.
            continue
          }

          if (isCommentToken(firstTokenOfLine)) {
            const tokenBefore = precedingTokens.get(firstTokenOfLine)
            const tokenAfter = tokenBefore ? sourceCode.getTokenAfter(tokenBefore) : sourceCode.ast.tokens[0]
            const mayAlignWithBefore = tokenBefore && !hasBlankLinesBetween(tokenBefore, firstTokenOfLine)
            const mayAlignWithAfter = tokenAfter && !hasBlankLinesBetween(firstTokenOfLine, tokenAfter)

            /**
             * If a comment precedes a line that begins with a semicolon token, align to that token, i.e.
             *
             * let foo
             * // comment
             * ;(async () => {})()
             */
            if (tokenAfter && isSemicolonToken(tokenAfter) && !isTokenOnSameLine(firstTokenOfLine, tokenAfter))
              offsets.setDesiredOffset(firstTokenOfLine, tokenAfter, 0)

            // If a comment matches the expected indentation of the token immediately before or after, don't report it.
            if (
              mayAlignWithBefore && validateTokenIndent(firstTokenOfLine, offsets.getDesiredIndent(tokenBefore)!)
              || mayAlignWithAfter && validateTokenIndent(firstTokenOfLine, offsets.getDesiredIndent(tokenAfter)!)
            ) {
              continue
            }
          }

          // If the token matches the expected indentation, don't report it.
          if (validateTokenIndent(firstTokenOfLine, offsets.getDesiredIndent(firstTokenOfLine)!))
            continue

          // Otherwise, report the token/comment.
          report(firstTokenOfLine, offsets.getDesiredIndent(firstTokenOfLine)!)
        }
      },
    }
  },
})
