/**
 * @fileoverview Comma style - enforces comma styles of two types: last and first
 * @author Vignesh Anand aka vegetableman
 */

import type { ASTNode, NodeTypes, RuleFixer, RuleListener, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  isCommaToken,
  isNotClosingParenToken,
  isNotCommaToken,
  isNotOpeningParenToken,
  isOpeningBracketToken,
  isTokenOnSameLine,
  LINEBREAK_MATCHER,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'comma-style',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent comma style',
    },

    fixable: 'code',

    schema: [
      {
        type: 'string',
        enum: ['first', 'last'],
      },
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'object',
            additionalProperties: {
              type: 'boolean',
            },
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      unexpectedLineBeforeAndAfterComma: 'Bad line breaking before and after \',\'.',
      expectedCommaFirst: '\',\' should be placed first.',
      expectedCommaLast: '\',\' should be placed last.',
    },
  },

  create(context) {
    const style = context.options[0] || 'last'
    const sourceCode = context.sourceCode
    const exceptions = {
      ArrayPattern: true,
      ArrowFunctionExpression: true,
      CallExpression: true,
      FunctionDeclaration: true,
      FunctionExpression: true,
      ImportDeclaration: true,
      ObjectPattern: true,
      NewExpression: true,
      ExportAllDeclaration: true,
      ExportNamedDeclaration: true,
      ImportExpression: true,
      SequenceExpression: true,
      ClassDeclaration: true,
      ClassExpression: true,
      TSDeclareFunction: true,
      TSFunctionType: true,
      TSConstructorType: true,
      TSEmptyBodyFunctionExpression: true,
      TSEnumBody: true,
      TSTypeLiteral: true,
      TSIndexSignature: true,
      TSMethodSignature: true,
      TSCallSignatureDeclaration: true,
      TSConstructSignatureDeclaration: true,
      TSInterfaceBody: true,
      TSInterfaceDeclaration: true,
      TSTupleType: true,
      TSTypeParameterDeclaration: true,
      TSTypeParameterInstantiation: true,
    } as Record<NodeTypes, boolean>

    if (context.options.length === 2 && Object.prototype.hasOwnProperty.call(context.options[1], 'exceptions')) {
      context.options[1] ??= { exceptions: {} }
      const rawExceptions = context.options[1].exceptions!
      const keys = Object.keys(rawExceptions)

      for (let i = 0; i < keys.length; i++)
        exceptions[keys[i] as keyof typeof exceptions] = rawExceptions[keys[i]]
    }

    /**
     * Modified text based on the style
     * @param styleType Style type
     * @param text Source code text
     * @returns modified text
     * @private
     */
    function getReplacedText(styleType: string, text: string): string {
      switch (styleType) {
        case 'between':
          return `,${text.replace(LINEBREAK_MATCHER, '')}`

        case 'first':
          return `${text},`

        case 'last':
          return `,${text}`

        default:
          return ''
      }
    }

    /**
     * Determines the fixer function for a given style.
     * @param styleType comma style
     * @param tokenBeforeComma The token before the comma token.
     * @param commaToken The token representing the comma.
     * @param tokenAfterComma The token after the comma token.
     * @returns Fixer function
     * @private
     */
    function getFixerFunction(styleType: string, tokenBeforeComma: Token, commaToken: Token, tokenAfterComma: Tree.Token) {
      const text
                = sourceCode.text.slice(tokenBeforeComma.range[1], commaToken.range[0])
                + sourceCode.text.slice(commaToken.range[1], tokenAfterComma.range[0])
      const range = [tokenBeforeComma.range[1], tokenAfterComma.range[0]] as const

      return function (fixer: RuleFixer) {
        return fixer.replaceTextRange(range, getReplacedText(styleType, text))
      }
    }

    /**
     * Validates the spacing around single items in lists.
     * @param tokenBeforeComma The token before the comma token.
     * @param commaToken The token representing the comma.
     * @param tokenAfterComma The token after the comma token.
     * @private
     */
    function validateCommaItemSpacing(tokenBeforeComma: Token, commaToken: Token, tokenAfterComma: Tree.Token): void {
      // if single line
      if (isTokenOnSameLine(commaToken, tokenAfterComma)
        && isTokenOnSameLine(tokenBeforeComma, commaToken)) {

        // do nothing.

      }
      else if (!isTokenOnSameLine(commaToken, tokenAfterComma)
        && !isTokenOnSameLine(tokenBeforeComma, commaToken)) {
        const comment = sourceCode.getCommentsAfter(commaToken)[0]
        const styleType = comment && comment.type === 'Block' && isTokenOnSameLine(commaToken, comment)
          ? style
          : 'between'

        // lone comma
        context.report({
          node: commaToken,
          messageId: 'unexpectedLineBeforeAndAfterComma',
          fix: getFixerFunction(styleType, tokenBeforeComma, commaToken, tokenAfterComma),
        })
      }
      else if (style === 'first' && !isTokenOnSameLine(commaToken, tokenAfterComma)) {
        context.report({
          node: commaToken,
          messageId: 'expectedCommaFirst',
          fix: getFixerFunction(style, tokenBeforeComma, commaToken, tokenAfterComma),
        })
      }
      else if (style === 'last' && isTokenOnSameLine(commaToken, tokenAfterComma)) {
        context.report({
          node: commaToken,
          messageId: 'expectedCommaLast',
          fix: getFixerFunction(style, tokenBeforeComma, commaToken, tokenAfterComma),
        })
      }
    }

    /**
     * Extracts the comma tokens from the node and its items.
     * @param node The node to extract the comma tokens from.
     * @param items The child nodes.
     * @private
     */
    function extractCommaTokens(node: NodeType, items: (ASTNode | null)[]): Token[] {
      if (items.length === 0) {
        // If there are no items, return an empty array.
        return []
      }
      const definedItems = items.filter((item): item is ASTNode => Boolean(item))
      if (definedItems.length === 0) {
        // If no items are defined, it returns all the commas in the node.
        // e.g. [,,,]
        return sourceCode.getTokens(node).filter(isCommaToken)
      }

      const commaTokens: Token[] = []

      const firstItem = definedItems[0]

      // Extracts all commas before the first item
      let prevToken = sourceCode.getTokenBefore(firstItem)
      while (prevToken && node.range[0] <= prevToken.range[0]) {
        if (isCommaToken(prevToken)) {
          commaTokens.unshift(prevToken)
        }
        else if (isNotOpeningParenToken(prevToken)) {
          break
        }
        prevToken = sourceCode.getTokenBefore(prevToken)
      }

      // Extracts all commas between the items
      let prevItem: ASTNode | null = null
      for (const item of definedItems) {
        if (prevItem) {
          commaTokens.push(
            ...sourceCode.getTokensBetween(prevItem, item)
              .filter(isCommaToken),
          )
        }
        const tokenLastItem = sourceCode.getLastToken(item)
        if (tokenLastItem && isCommaToken(tokenLastItem)) {
          // TypeElement such as TSPropertySignature may have a comma at the end of the node.
          commaTokens.push(tokenLastItem)
        }
        prevItem = item
      }

      // Extracts all commas after the last item
      let nextToken = sourceCode.getTokenAfter(prevItem!)
      while (nextToken && nextToken.range[1] <= node.range[1]) {
        if (isCommaToken(nextToken)) {
          commaTokens.push(nextToken)
        }
        else if (isNotClosingParenToken(nextToken)) {
          break
        }

        nextToken = sourceCode.getTokenAfter(nextToken)
      }

      return commaTokens
    }

    /**
     * Checks the comma placement with regards to a declaration/property/element
     * @param node The binary expression node to check
     * @param items The child nodes.
     * @private
     */
    function validateComma(node: NodeType, items: (ASTNode | null)[]): void {
      const commaTokens = extractCommaTokens(node, items)
      commaTokens.forEach((commaToken) => {
        const tokenBeforeComma = sourceCode.getTokenBefore(commaToken)!
        const tokenAfterComma = sourceCode.getTokenAfter(commaToken)!

        if (isOpeningBracketToken(tokenBeforeComma)) {
          // Ignore the first comma in an array.
          return
        }
        if (
          isCommaToken(tokenBeforeComma)
          && isOpeningBracketToken(sourceCode.getTokenBefore(tokenBeforeComma, isNotCommaToken)!)
        ) {
          // Ignore commas at the beginning of an array.
          return
        }
        if (isCommaToken(tokenAfterComma) && !isTokenOnSameLine(commaToken, tokenAfterComma)) {
          // Ignore consecutive commas.
          return
        }

        /**
         * This works by comparing three token locations:
         * - tokenBeforeComma is the token before the comma token.
         * - commaToken is the comma token.
         * - tokenAfterComma is the token after the comma token.
         */
        validateCommaItemSpacing(tokenBeforeComma, commaToken, tokenAfterComma)
      })
    }

    type NodeType =
      | Tree.VariableDeclaration
      | Tree.ArrayExpression
      | Tree.ObjectExpression
      | Tree.ObjectPattern
      | Tree.ArrayPattern
      | Tree.FunctionDeclaration
      | Tree.FunctionExpression
      | Tree.CallExpression
      | Tree.ImportDeclaration
      | Tree.NewExpression
      | Tree.ArrowFunctionExpression
      | Tree.ExportAllDeclaration
      | Tree.ExportNamedDeclaration
      | Tree.ImportExpression
      | Tree.SequenceExpression
      | Tree.ClassDeclaration
      | Tree.ClassExpression
      | Tree.TSDeclareFunction
      | Tree.TSFunctionType
      | Tree.TSConstructorType
      | Tree.TSEmptyBodyFunctionExpression
      | Tree.TSEnumBody
      | Tree.TSTypeLiteral
      | Tree.TSIndexSignature
      | Tree.TSMethodSignature
      | Tree.TSCallSignatureDeclaration
      | Tree.TSConstructSignatureDeclaration
      | Tree.TSInterfaceBody
      | Tree.TSInterfaceDeclaration
      | Tree.TSTupleType
      | Tree.TSTypeParameterDeclaration
      | Tree.TSTypeParameterInstantiation

    const nodes: RuleListener = {}

    if (!exceptions.VariableDeclaration) {
      nodes.VariableDeclaration = node =>
        validateComma(node, node.declarations)
    }
    if (!exceptions.ObjectExpression) {
      nodes.ObjectExpression = validateObjectProperties
    }
    if (!exceptions.ObjectPattern) {
      nodes.ObjectPattern = validateObjectProperties
    }
    if (!exceptions.ArrayExpression) {
      nodes.ArrayExpression = validateArrayElements
    }
    if (!exceptions.ArrayPattern) {
      nodes.ArrayPattern = validateArrayElements
    }
    if (!exceptions.FunctionDeclaration) {
      nodes.FunctionDeclaration = validateFunctionParams
    }
    if (!exceptions.FunctionExpression) {
      nodes.FunctionExpression = validateFunctionParams
    }
    if (!exceptions.ArrowFunctionExpression) {
      nodes.ArrowFunctionExpression = validateFunctionParams
    }
    if (!exceptions.CallExpression) {
      nodes.CallExpression = validateCallArguments
    }
    if (!exceptions.ImportDeclaration) {
      nodes.ImportDeclaration = (node) => {
        validateComma(node, node.specifiers)
        visitImportAttributes(node)
      }
    }
    if (!exceptions.NewExpression) {
      nodes.NewExpression = validateCallArguments
    }
    if (!exceptions.ExportAllDeclaration) {
      nodes.ExportAllDeclaration = visitImportAttributes
    }
    if (!exceptions.ExportNamedDeclaration) {
      nodes.ExportNamedDeclaration = (node) => {
        validateComma(node, node.specifiers)
        visitImportAttributes(node)
      }
    }
    if (!exceptions.ImportExpression) {
      nodes.ImportExpression = (node) => {
        validateComma(node, [node.source, node.options ?? null])
      }
    }
    if (!exceptions.SequenceExpression) {
      nodes.SequenceExpression = node =>
        validateComma(node, node.expressions)
    }
    if (!exceptions.ClassDeclaration) {
      nodes.ClassDeclaration = visitClassImplements
    }
    if (!exceptions.ClassExpression) {
      nodes.ClassExpression = visitClassImplements
    }
    if (!exceptions.TSDeclareFunction) {
      nodes.TSDeclareFunction = validateFunctionParams
    }
    if (!exceptions.TSFunctionType) {
      nodes.TSFunctionType = validateFunctionParams
    }
    if (!exceptions.TSConstructorType) {
      nodes.TSConstructorType = validateFunctionParams
    }
    if (!exceptions.TSEmptyBodyFunctionExpression) {
      nodes.TSEmptyBodyFunctionExpression = validateFunctionParams
    }
    if (!exceptions.TSMethodSignature) {
      nodes.TSMethodSignature = validateFunctionParams
    }
    if (!exceptions.TSCallSignatureDeclaration) {
      nodes.TSCallSignatureDeclaration = validateFunctionParams
    }
    if (!exceptions.TSConstructSignatureDeclaration) {
      nodes.TSConstructSignatureDeclaration = validateFunctionParams
    }
    if (!exceptions.TSTypeParameterDeclaration) {
      nodes.TSTypeParameterDeclaration = validateTypeParams
    }
    if (!exceptions.TSTypeParameterInstantiation) {
      nodes.TSTypeParameterInstantiation = validateTypeParams
    }
    if (!exceptions.TSEnumBody) {
      nodes.TSEnumBody = visitMembers
    }
    if (!exceptions.TSTypeLiteral) {
      nodes.TSTypeLiteral = visitMembers
    }
    if (!exceptions.TSIndexSignature) {
      nodes.TSIndexSignature = node =>
        validateComma(node, node.parameters)
    }
    if (!exceptions.TSInterfaceDeclaration) {
      nodes.TSInterfaceDeclaration = node =>
        validateComma(node, node.extends)
    }
    if (!exceptions.TSInterfaceBody) {
      nodes.TSInterfaceBody = node =>
        validateComma(node, node.body)
    }
    if (!exceptions.TSTupleType) {
      nodes.TSTupleType = node =>
        validateComma(node, node.elementTypes)
    }

    return nodes

    /** Checks the comma placement in object properties. */
    function validateObjectProperties(node: Tree.ObjectExpression | Tree.ObjectPattern) {
      validateComma(node, node.properties)
    }
    /** Checks the comma placement in array elements. */
    function validateArrayElements(node: Tree.ArrayExpression | Tree.ArrayPattern) {
      validateComma(node, node.elements)
    }
    /** Checks the comma placement in function parameters. */
    function validateFunctionParams(
      node: Tree.FunctionDeclaration
        | Tree.FunctionExpression
        | Tree.ArrowFunctionExpression
        | Tree.TSDeclareFunction
        | Tree.TSFunctionType
        | Tree.TSConstructorType
        | Tree.TSEmptyBodyFunctionExpression
        | Tree.TSMethodSignature
        | Tree.TSCallSignatureDeclaration
        | Tree.TSConstructSignatureDeclaration,
    ) {
      validateComma(node, node.params)
    }
    /** Checks the comma placement in call arguments. */
    function validateCallArguments(node: Tree.CallExpression | Tree.NewExpression) {
      validateComma(node, node.arguments)
    }
    /** Checks the comma placement in import attributes. */
    function visitImportAttributes(node: Tree.ImportDeclaration | Tree.ExportAllDeclaration | Tree.ExportNamedDeclaration) {
      if (!node.attributes)
        // The old parser's AST does not have attributes.
        return
      validateComma(node, node.attributes)
    }

    /** Checks the comma placement in TypeScript class implements. */
    function visitClassImplements(node: Tree.ClassDeclaration | Tree.ClassExpression) {
      if (!node.implements)
        // The js parser's AST does not have implements.
        return
      validateComma(node, node.implements)
    }
    /** Checks the comma placement in TypeScript enum/literal members. */
    function visitMembers(node: Tree.TSEnumBody | Tree.TSTypeLiteral) {
      validateComma(node, node.members)
    }
    /** Checks the comma placement in type parameters. */
    function validateTypeParams(
      node: Tree.TSTypeParameterDeclaration
        | Tree.TSTypeParameterInstantiation,
    ) {
      validateComma(node, node.params)
    }
  },
})
