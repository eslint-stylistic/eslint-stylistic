/**
 * Note this file is rather type-unsafe in its current state.
 * This is due to some really funky type conversions between different node types.
 * This is done intentionally based on the internal implementation of the base indent rule.
 */

import type { ASTNode, JSONSchema, RuleFunction, RuleListener, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import type { IndentContext } from './utils/handlers'
import { AST_NODE_TYPES, getCommentsBetween, isClosingBraceToken, isClosingParenToken, isColonToken, isCommentToken, isEqToken, isNotOpeningParenToken, isNotSemicolonToken, isOpeningBraceToken, isOpeningParenToken, isSemicolonToken, isSingleLine, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { isESTreeSourceCode } from '#utils/eslint-core'
import {
  addBlocklessNodeIndent,
  addElementListIndent,
  addFunctionCallIndent,
  addParensIndent,
  checkArrayLikeNode,
  checkAssignmentOperator,
  checkBlockLikeNode,
  checkClassProperty,
  checkConditionalNode,
  checkHeritages,
  checkMemberExpression,
  checkObjectLikeNode,
  checkOperatorToken,
  ignoreNode,
} from './utils/handlers'
import { OffsetStorage } from './utils/offset-storage'
import { TokenInfo } from './utils/token-info'
import { hasBlankLinesBetween, validateTokenIndent } from './utils/validator'

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

    let indentType: IndentContext['indentType'] = 'space'
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

    const ternaryOptions: false | Partial<Record<string, boolean>> = options.offsetTernaryExpressions !== false
      ? {
          CallExpression: true,
          AwaitExpression: true,
          NewExpression: true,
          ...options.offsetTernaryExpressions === true ? {} : options.offsetTernaryExpressions,
        }
      : false

    const ctx: IndentContext = {
      sourceCode,
      offsets,
      tokenInfo,
      parameterParens,
      indentSize,
      indentType,
      options,
      ternaryOptions,
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

    const ignoredNodeFirstTokens = new Set<Token>()

    const baseOffsetListeners: RuleListener = {
      'ArrayExpression': node => checkArrayLikeNode(ctx, node),

      'ArrayPattern': node => checkArrayLikeNode(ctx, node),

      ObjectExpression(node) {
        checkObjectLikeNode(ctx, node, node.properties)
      },

      ObjectPattern(node) {
        checkObjectLikeNode(ctx, node, node.properties)
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
          addElementListIndent(ctx, node.params, openingParen, closingParen, options.FunctionExpression.parameters)
        }

        addBlocklessNodeIndent(ctx, node.body)
      },

      AssignmentExpression(node) {
        const operator = sourceCode.getFirstTokenBetween(node.left, node.right, token => token.value === node.operator)!

        checkAssignmentOperator(ctx, operator)
      },

      AssignmentPattern(node) {
        const operator = sourceCode.getFirstTokenBetween(node.left, node.right, isEqToken)!

        checkAssignmentOperator(ctx, operator)
      },

      BinaryExpression(node) {
        checkOperatorToken(ctx, node.left, node.right, node.operator)
      },

      LogicalExpression(node) {
        checkOperatorToken(ctx, node.left, node.right, node.operator)
      },

      'BlockStatement': node => checkBlockLikeNode(ctx, node),

      'ClassBody': node => checkBlockLikeNode(ctx, node),

      'CallExpression': node => addFunctionCallIndent(ctx, node),

      ClassDeclaration(node) {
        if (!node.superClass)
          return

        checkHeritages(ctx, node, [node.superClass])
      },

      ClassExpression(node) {
        if (!node.superClass)
          return

        checkHeritages(ctx, node, [node.superClass])
      },

      ConditionalExpression(node) {
        checkConditionalNode(ctx, node, node.test, node.consequent, node.alternate)
      },

      'DoWhileStatement, WhileStatement, ForInStatement, ForOfStatement, WithStatement': function (
        node:
          | Tree.DoWhileStatement
          | Tree.WhileStatement
          | Tree.ForInStatement
          | Tree.ForOfStatement
          | Tree.WithStatement,
      ) {
        addBlocklessNodeIndent(ctx, node.body)
      },

      ExportNamedDeclaration(node) {
        if (node.declaration === null) {
          const closingCurly = node.source
            ? sourceCode.getTokenBefore(node.source, isClosingBraceToken)!
            : sourceCode.getLastToken(node, isClosingBraceToken)!

          // Indent the specifiers in `export {foo, bar, baz}`
          addElementListIndent(ctx, node.specifiers, sourceCode.getFirstToken(node, { skip: 1 })!, closingCurly, 1)

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
              addElementListIndent(ctx, node.attributes, openingCurly, closingCurly, 1)
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
          addElementListIndent(ctx, node.attributes, openingCurly, closingCurly, 1)
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

        addBlocklessNodeIndent(ctx, node.body)
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
        addElementListIndent(ctx, node.params, paramsOpeningParen, paramsClosingParen, options[node.type].parameters)

        if (node.returnType) {
          offsets.setDesiredOffsets(node.returnType.range, paramsClosingParen, options[node.type].returnType)
        }
      },

      IfStatement(node) {
        addBlocklessNodeIndent(ctx, node.consequent)
        if (node.alternate)
          addBlocklessNodeIndent(ctx, node.alternate)
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

          addElementListIndent(ctx, node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier'), openingCurly, closingCurly, options.ImportDeclaration)
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

          addElementListIndent(ctx, node.attributes, openingCurly, closingCurly, 1)
        }
      },

      ImportExpression(node) {
        const openingParen = sourceCode.getFirstToken(node, 1)!
        const closingParen = sourceCode.getLastToken(node)!

        parameterParens.add(openingParen)
        parameterParens.add(closingParen)
        offsets.setDesiredOffset(openingParen, sourceCode.getTokenBefore(openingParen)!, 0)

        addElementListIndent(ctx, [node.source], openingParen, closingParen, options.CallExpression.arguments)
      },

      MemberExpression(node) {
        checkMemberExpression(ctx, node, node.object, node.property, node.computed)
      },

      MetaProperty(node) {
        checkMemberExpression(ctx, node, node.meta, node.property)
      },

      NewExpression(node) {
        // Only indent the arguments if the NewExpression has parens (e.g. `new Foo(bar)` or `new Foo()`, but not `new Foo`
        if (node.arguments.length > 0
          || isClosingParenToken(sourceCode.getLastToken(node)!)
          && isOpeningParenToken(sourceCode.getLastToken(node, 1)!)) {
          addFunctionCallIndent(ctx, node)
        }
      },

      Property(node) {
        if (!node.shorthand && !node.method && node.kind === 'init') {
          const colon = sourceCode.getFirstTokenBetween(node.key, node.value, isColonToken)!

          offsets.ignoreToken(sourceCode.getTokenAfter(colon)!)
        }
      },

      'PropertyDefinition': node => checkClassProperty(ctx, node),
      'AccessorProperty': node => checkClassProperty(ctx, node),
      'TSAbstractPropertyDefinition': node => checkClassProperty(ctx, node),
      'TSAbstractAccessorProperty': node => checkClassProperty(ctx, node),

      StaticBlock(node) {
        const openingCurly = sourceCode.getFirstToken(node, { skip: 1 })! // skip the `static` token
        const closingCurly = sourceCode.getLastToken(node)!

        addElementListIndent(ctx, node.body, openingCurly, closingCurly, options.StaticBlock.body)
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
              ctx,
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
          checkAssignmentOperator(ctx, operator)
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
        checkAssignmentOperator(ctx, operator)
      },

      JSXElement(node) {
        if (node.closingElement) {
          addElementListIndent(
            ctx,
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
        addElementListIndent(ctx, node.attributes, firstToken, closingToken, 1)
      },

      JSXClosingElement(node) {
        const firstToken = sourceCode.getFirstToken(node)

        offsets.setDesiredOffsets(node.name.range, firstToken, 1)
      },

      JSXFragment(node) {
        const firstOpeningToken = sourceCode.getFirstToken(node.openingFragment)!
        const firstClosingToken = sourceCode.getFirstToken(node.closingFragment)!

        addElementListIndent(ctx, node.children, firstOpeningToken, firstClosingToken, 1)
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
        checkMemberExpression(ctx, node, node.object, node.property)
      },

      TSTypeAnnotation(node) {
        // handled by FunctionDeclaration.returnType, FunctionExpression.returnType
        if (node.parent.type === 'FunctionDeclaration' || node.parent.type === 'FunctionExpression')
          return

        const colon = sourceCode.getFirstToken(node)!
        const right = sourceCode.getTokenAfter(colon)!
        offsets.setDesiredOffset(right, colon, 1)
      },

      TSTypeAliasDeclaration(node) {
        const operator = sourceCode.getTokenBefore(node.typeAnnotation, isNotOpeningParenToken)!
        checkAssignmentOperator(ctx, operator)

        const lastToken = sourceCode.getLastToken(node)!
        if (isSemicolonToken(lastToken))
          offsets.ignoreToken(lastToken)
      },

      'TSTupleType': node => checkArrayLikeNode(ctx, node),

      'TSEnumBody': node => checkBlockLikeNode(ctx, node),

      TSEnumMember(node) {
        if (!node.initializer)
          return

        const operator = sourceCode.getTokenBefore(node.initializer, isEqToken)!
        checkAssignmentOperator(ctx, operator)
      },

      TSTypeLiteral(node) {
        checkObjectLikeNode(ctx, node, node.members)
      },

      TSMappedType(node) {
        const startToken = sourceCode.getFirstToken(node, isOpeningBraceToken)!
        const endToken = sourceCode.getLastToken(node, isClosingBraceToken)!

        offsets.setDesiredOffsets([startToken.range[1], endToken.range[0]], startToken, 1)
        offsets.setDesiredOffset(endToken, startToken, 0)
      },

      TSAsExpression(node) {
        checkOperatorToken(ctx, node.expression, node.typeAnnotation, 'as')
      },

      // TODO: TSSatisfiesExpression

      TSConditionalType(node) {
        checkConditionalNode(ctx, node, node.extendsType, node.trueType, node.falseType)
      },

      TSImportEqualsDeclaration(node) {
        if (node.moduleReference) {
          const operator = sourceCode.getTokenBefore(node.moduleReference, isEqToken)!
          checkAssignmentOperator(ctx, operator)
        }

        const lastToken = sourceCode.getLastToken(node)!
        if (isSemicolonToken(lastToken))
          offsets.ignoreToken(lastToken)
      },

      TSIndexedAccessType(node) {
        checkMemberExpression(ctx, node, node.objectType, node.indexType, true)
      },

      'TSInterfaceBody': node => checkBlockLikeNode(ctx, node),

      TSInterfaceDeclaration(node) {
        if (node.extends.length === 0)
          return

        checkHeritages(ctx, node, node.extends)
      },

      TSQualifiedName(node) {
        checkMemberExpression(ctx, node, node.left, node.right)
      },

      TSTypeParameter(node) {
        if (!node.default)
          return

        const operator = sourceCode.getTokenBefore(node.default, isEqToken)!
        checkAssignmentOperator(ctx, operator)
      },

      TSTypeParameterDeclaration(node) {
        if (!node.params.length)
          return

        const firstToken = sourceCode.getFirstToken(node)!
        const closingToken = sourceCode.getLastToken(node)!

        addElementListIndent(ctx, node.params, firstToken, closingToken, 1)
      },

      TSTypeParameterInstantiation(node) {
        if (!node.params.length)
          return

        const firstToken = sourceCode.getFirstToken(node)!
        const closingToken = sourceCode.getLastToken(node)!

        addElementListIndent(ctx, node.params, firstToken, closingToken, 1)
      },

      'TSModuleBlock': node => checkBlockLikeNode(ctx, node),

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
        ignoredNodes.forEach(node => ignoreNode(ctx, node))

        addParensIndent(ctx, sourceCode.ast.tokens)

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
            const mayAlignWithBefore = tokenBefore && !hasBlankLinesBetween(tokenInfo, tokenBefore, firstTokenOfLine)
            const mayAlignWithAfter = tokenAfter && !hasBlankLinesBetween(tokenInfo, firstTokenOfLine, tokenAfter)

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
              mayAlignWithBefore && validateTokenIndent(tokenInfo, firstTokenOfLine, offsets.getDesiredIndent(tokenBefore)!)
              || mayAlignWithAfter && validateTokenIndent(tokenInfo, firstTokenOfLine, offsets.getDesiredIndent(tokenAfter)!)
            ) {
              continue
            }
          }

          // If the token matches the expected indentation, don't report it.
          if (validateTokenIndent(tokenInfo, firstTokenOfLine, offsets.getDesiredIndent(firstTokenOfLine)!))
            continue

          // Otherwise, report the token/comment.
          report(firstTokenOfLine, offsets.getDesiredIndent(firstTokenOfLine)!)
        }
      },
    }
  },
})
