/**
 * @fileoverview Comma style - enforces comma styles of two types: last and first
 * @author Vignesh Anand aka vegetableman
 */

import type { ASTNode, NodeTypes, RuleFixer, RuleListener, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isCommaToken, isNotClosingParenToken, isTokenOnSameLine, LINEBREAK_MATCHER } from '#utils/ast'
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
     * @param previousItemToken The token to check.
     * @param commaToken The token to check.
     * @param currentItemToken The token to check.
     * @returns Fixer function
     * @private
     */
    function getFixerFunction(styleType: string, previousItemToken: Token, commaToken: Token, currentItemToken: Token) {
      const text
                = sourceCode.text.slice(previousItemToken.range[1], commaToken.range[0])
                + sourceCode.text.slice(commaToken.range[1], currentItemToken.range[0])
      const range = [previousItemToken.range[1], currentItemToken.range[0]] as const

      return function (fixer: RuleFixer) {
        return fixer.replaceTextRange(range, getReplacedText(styleType, text))
      }
    }

    /**
     * Validates the spacing around single items in lists.
     * @param previousItemToken The last token from the previous item.
     * @param commaToken The token representing the comma.
     * @param currentItemToken The first token of the current item.
     * @param reportItem The item to use when reporting an error.
     * @private
     */
    function validateCommaItemSpacing(previousItemToken: Token, commaToken: Token, currentItemToken: Token, reportItem: ASTNode | Token): void {
      // if single line
      if (isTokenOnSameLine(commaToken, currentItemToken)
        && isTokenOnSameLine(previousItemToken, commaToken)) {

        // do nothing.

      }
      else if (!isTokenOnSameLine(commaToken, currentItemToken)
        && !isTokenOnSameLine(previousItemToken, commaToken)) {
        const comment = sourceCode.getCommentsAfter(commaToken)[0]
        const styleType = comment && comment.type === 'Block' && isTokenOnSameLine(commaToken, comment)
          ? style
          : 'between'

        // lone comma
        context.report({
          node: reportItem,
          loc: commaToken.loc,
          messageId: 'unexpectedLineBeforeAndAfterComma',
          fix: getFixerFunction(styleType, previousItemToken, commaToken, currentItemToken),
        })
      }
      else if (style === 'first' && !isTokenOnSameLine(commaToken, currentItemToken)) {
        context.report({
          node: reportItem,
          loc: commaToken.loc,
          messageId: 'expectedCommaFirst',
          fix: getFixerFunction(style, previousItemToken, commaToken, currentItemToken),
        })
      }
      else if (style === 'last' && isTokenOnSameLine(commaToken, currentItemToken)) {
        context.report({
          node: reportItem,
          loc: commaToken.loc,
          messageId: 'expectedCommaLast',
          fix: getFixerFunction(style, previousItemToken, commaToken, currentItemToken),
        })
      }
    }

    /**
     * Checks the comma placement with regards to a declaration/property/element
     * @param node The binary expression node to check
     * @param items The child nodes.
     * @private
     */
    function validateComma<T extends NodeType>(node: T, items: (ASTNode | null)[]): void {
      const arrayLiteral = (node.type === 'ArrayExpression' || node.type === 'ArrayPattern')

      if (items.length > 1 || arrayLiteral) {
        // seed as opening [
        let previousItemToken = sourceCode.getFirstToken(node)!

        items.forEach((item) => {
          const commaToken = item ? sourceCode.getTokenBefore(item)! : previousItemToken
          const currentItemToken = item ? sourceCode.getFirstToken(item)! : sourceCode.getTokenAfter(commaToken)!
          const reportItem = item || currentItemToken

          /**
           * This works by comparing three token locations:
           * - previousItemToken is the last token of the previous item
           * - commaToken is the location of the comma before the current item
           * - currentItemToken is the first token of the current item
           *
           * These values get switched around if item is undefined.
           * previousItemToken will refer to the last token not belonging
           * to the current item, which could be a comma or an opening
           * square bracket. currentItemToken could be a comma.
           *
           * All comparisons are done based on these tokens directly, so
           * they are always valid regardless of an undefined item.
           */
          if (isCommaToken(commaToken))
            validateCommaItemSpacing(previousItemToken, commaToken, currentItemToken!, reportItem)

          if (item) {
            const tokenLastItem = sourceCode.getLastToken(item)
            if (tokenLastItem && isCommaToken(tokenLastItem)) {
              // TypeElement such as TSPropertySignature may have a comma at the end of the node.
              previousItemToken = sourceCode.getTokenBefore(tokenLastItem)!
            }
            else {
              const tokenAfterItem = sourceCode.getTokenAfter(item, isNotClosingParenToken)

              previousItemToken = tokenAfterItem
                ? sourceCode.getTokenBefore(tokenAfterItem)!
                : sourceCode.ast.tokens[sourceCode.ast.tokens.length - 1] as ReturnType<typeof sourceCode.getLastToken>
            }
          }
          else {
            previousItemToken = currentItemToken
          }
        })

        /**
         * Special case for array literals that have empty last items, such
         * as [ 1, 2, ]. These arrays only have two items show up in the
         * AST, so we need to look at the token to verify that there's no
         * dangling comma.
         */
        if (arrayLiteral) {
          const lastToken = sourceCode.getLastToken(node)!
          const nextToLastToken = sourceCode.getTokenBefore(lastToken)!

          if (isCommaToken(nextToLastToken)) {
            validateCommaItemSpacing(
              sourceCode.getTokenBefore(nextToLastToken)!,
              nextToLastToken,
              lastToken,
              lastToken,
            )
          }
        }
      }
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
        visitModulesSpecifiers(node)
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
        visitModulesSpecifiers(node)
        visitImportAttributes(node)
      }
    }
    if (!exceptions.ImportExpression) {
      nodes.ImportExpression = (node) => {
        if (node.options)
          validateComma(node, [node.source, node.options])
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
    /** Checks the comma placement in module specifiers. */
    function visitModulesSpecifiers(node: Tree.ImportDeclaration | Tree.ExportNamedDeclaration) {
      validateComma(node, node.specifiers)
    }

    /** Checks the comma placement in TypeScript class implements. */
    function visitClassImplements(node: Tree.ClassDeclaration | Tree.ClassExpression) {
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
