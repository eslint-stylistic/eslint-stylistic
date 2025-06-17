import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  isClosingBraceToken,
  isClosingBracketToken,
  isNotCommaToken,
  isTokenOnSameLine,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'object-curly-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing inside braces',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'string',
        enum: ['always', 'never'],
      },
      {
        type: 'object',
        properties: {
          arraysInObjects: {
            type: 'boolean',
          },
          objectsInObjects: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireSpaceBefore: 'A space is required before \'{{token}}\'.',
      requireSpaceAfter: 'A space is required after \'{{token}}\'.',
      unexpectedSpaceBefore: 'There should be no space before \'{{token}}\'.',
      unexpectedSpaceAfter: 'There should be no space after \'{{token}}\'.',
    },
  },
  defaultOptions: ['never'],
  create(context) {
    const [firstOption, secondOption] = context.options
    const spaced = firstOption === 'always'
    const sourceCode = context.sourceCode

    /**
     * Determines whether an option is set, relative to the spacing option.
     * If spaced is "always", then check whether option is set to false.
     * If spaced is "never", then check whether option is set to true.
     * @param option The option to exclude.
     * @returns Whether or not the property is excluded.
     */
    function isOptionSet(
      option: keyof NonNullable<RuleOptions[1]>,
    ): boolean {
      return secondOption ? secondOption[option] === !spaced : false
    }

    const options = {
      spaced,
      arraysInObjectsException: isOptionSet('arraysInObjects'),
      objectsInObjectsException: isOptionSet('objectsInObjects'),
    }

    /**
     * Reports that there shouldn't be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoBeginningSpace(
      node: ASTNode,
      token: Token,
    ): void {
      const nextToken = sourceCode.getTokenAfter(token, { includeComments: true })!

      context.report({
        node,
        loc: { start: token.loc.end, end: nextToken.loc.start },
        messageId: 'unexpectedSpaceAfter',
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([token.range[1], nextToken.range[0]])
        },
      })
    }

    /**
     * Reports that there shouldn't be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportNoEndingSpace(
      node: ASTNode,
      token: Token,
    ): void {
      const previousToken = sourceCode.getTokenBefore(token, { includeComments: true })!

      context.report({
        node,
        loc: { start: previousToken.loc.end, end: token.loc.start },
        messageId: 'unexpectedSpaceBefore',
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([previousToken.range[1], token.range[0]])
        },
      })
    }

    /**
     * Reports that there should be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredBeginningSpace(
      node: ASTNode,
      token: Token,
    ): void {
      context.report({
        node,
        loc: token.loc,
        messageId: 'requireSpaceAfter',
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.insertTextAfter(token, ' ')
        },
      })
    }

    /**
     * Reports that there should be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredEndingSpace(
      node: ASTNode,
      token: Token,
    ): void {
      context.report({
        node,
        loc: token.loc,
        messageId: 'requireSpaceBefore',
        data: {
          token: token.value,
        },
        fix(fixer) {
          return fixer.insertTextBefore(token, ' ')
        },
      })
    }

    /**
     * Determines if spacing in curly braces is valid.
     * @param node The AST node to check.
     * @param openingToken The first token to check (should be the opening brace)
     * @param closingToken The last token to check (should be closing brace)
     */
    function validateBraceSpacing(
      node: ASTNode,
      openingToken: Token,
      closingToken: Token,
    ): void {
      const tokenAfterOpening = sourceCode.getTokenAfter(openingToken, { includeComments: true })!

      if (isTokenOnSameLine(openingToken, tokenAfterOpening)) {
        const firstSpaced = sourceCode.isSpaceBetween!(openingToken, tokenAfterOpening)
        const secondType = sourceCode.getNodeByRangeIndex(
          tokenAfterOpening.range[0],
        )!.type

        const openingCurlyBraceMustBeSpaced
          = options.arraysInObjectsException
            && [
              AST_NODE_TYPES.TSMappedType,
              AST_NODE_TYPES.TSIndexSignature,
            ].includes(secondType)
            ? !options.spaced
            : options.spaced

        if (openingCurlyBraceMustBeSpaced && !firstSpaced)
          reportRequiredBeginningSpace(node, openingToken)

        if (
          !openingCurlyBraceMustBeSpaced
          && firstSpaced
          && tokenAfterOpening.type !== AST_TOKEN_TYPES.Line
        ) {
          reportNoBeginningSpace(node, openingToken)
        }
      }

      const tokenBeforeClosing = sourceCode.getTokenBefore(closingToken, { includeComments: true })!

      if (isTokenOnSameLine(tokenBeforeClosing, closingToken)) {
        const shouldCheckPenultimate
          = (options.arraysInObjectsException
            && isClosingBracketToken(tokenBeforeClosing))
          || (options.objectsInObjectsException
            && isClosingBraceToken(tokenBeforeClosing))
        const penultimateType = shouldCheckPenultimate
          ? sourceCode.getNodeByRangeIndex(tokenBeforeClosing.range[0])!.type
          : undefined

        const closingCurlyBraceMustBeSpaced
          = (
            options.arraysInObjectsException
            && [
              AST_NODE_TYPES.ArrayExpression,
              AST_NODE_TYPES.TSTupleType,
            ].includes(penultimateType!)
          )
          || (
            options.objectsInObjectsException
            && penultimateType !== undefined
            && [
              AST_NODE_TYPES.ObjectExpression,
              AST_NODE_TYPES.ObjectPattern,
              AST_NODE_TYPES.TSMappedType,
              AST_NODE_TYPES.TSTypeLiteral,
            ].includes(penultimateType)
          )
            ? !options.spaced
            : options.spaced

        const lastSpaced = sourceCode.isSpaceBetween!(tokenBeforeClosing, closingToken)

        if (closingCurlyBraceMustBeSpaced && !lastSpaced)
          reportRequiredEndingSpace(node, closingToken)

        if (!closingCurlyBraceMustBeSpaced && lastSpaced)
          reportNoEndingSpace(node, closingToken)
      }
    }

    /**
     * Reports a given object-like node if spacing in curly braces is invalid.
     * @param node An object-like node to check.
     * @param properties The properties of the object-like node
     */
    function checkForObjectLike(node: ASTNode, properties: ASTNode[]) {
      if (properties.length === 0)
        return

      const closeToken = sourceCode.getTokenAfter(properties.at(-1)!, isClosingBraceToken)!

      const openingToken = sourceCode.getFirstToken(node)!

      validateBraceSpacing(node, openingToken, closeToken)
    }

    /**
     * Reports a given import node if spacing in curly braces is invalid.
     * @param node An ImportDeclaration node to check.
     */
    function checkForImport(node: Tree.ImportDeclaration) {
      if (node.specifiers.length === 0)
        return

      let firstSpecifier = node.specifiers[0]
      const lastSpecifier = node.specifiers[node.specifiers.length - 1]

      if (lastSpecifier.type !== 'ImportSpecifier')
        return

      if (firstSpecifier.type !== 'ImportSpecifier')
        firstSpecifier = node.specifiers[1]

      const first = sourceCode.getTokenBefore(firstSpecifier)!
      const last = sourceCode.getTokenAfter(lastSpecifier, isNotCommaToken)!

      validateBraceSpacing(node, first, last)
    }

    /**
     * Reports a given export node if spacing in curly braces is invalid.
     * @param node An ExportNamedDeclaration node to check.
     */
    function checkForExport(node: Tree.ExportNamedDeclaration) {
      if (node.specifiers.length === 0)
        return

      const firstSpecifier = node.specifiers[0]
      const lastSpecifier = node.specifiers[node.specifiers.length - 1]
      const first = sourceCode.getTokenBefore(firstSpecifier)!
      const last = sourceCode.getTokenAfter(lastSpecifier, isNotCommaToken)!

      validateBraceSpacing(node, first, last)
    }

    return {
      // var {x} = y;
      ObjectPattern(node) {
        checkForObjectLike(node, node.properties)
      },
      // var y = {x: 'y'}
      ObjectExpression(node) {
        checkForObjectLike(node, node.properties)
      },
      // import {y} from 'x';
      ImportDeclaration: checkForImport,
      // export {name} from 'yo';
      ExportNamedDeclaration: checkForExport,
      TSMappedType(node) {
        const openingToken = sourceCode.getFirstToken(node)!
        const closeToken = sourceCode.getLastToken(node)!

        validateBraceSpacing(node, openingToken, closeToken)
      },
      TSTypeLiteral(node) {
        checkForObjectLike(node, node.members)
      },
      TSInterfaceBody(node) {
        checkForObjectLike(node, node.body)
      },
      TSEnumBody(node) {
        checkForObjectLike(node, node.members)
      },
    }
  },
})
