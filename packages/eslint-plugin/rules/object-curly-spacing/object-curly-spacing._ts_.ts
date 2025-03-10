import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isNotCommaToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import {
  isClosingBraceToken,
  isClosingBracketToken,
  isTokenOnSameLine,
} from '@typescript-eslint/utils/ast-utils'

export default createRule<RuleOptions, MessageIds>({
  name: 'object-curly-spacing',
  package: 'ts',
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
      token: Tree.Token,
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
      token: Tree.Token,
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
      token: Tree.Token,
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
      token: Tree.Token,
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
     * @param first The first token to check (should be the opening brace)
     * @param second The second token to check (should be first after the opening brace)
     * @param penultimate The penultimate token to check (should be last before closing brace)
     * @param last The last token to check (should be closing brace)
     */
    function validateBraceSpacing(
      node: Tree.ObjectExpression | Tree.ObjectPattern | Tree.ImportDeclaration | Tree.ExportNamedDeclaration | Tree.TSMappedType | Tree.TSTypeLiteral,
      first: Tree.Token,
      second: Tree.Token,
      penultimate: Tree.Token,
      last: Tree.Token,
    ): void {
      if (isTokenOnSameLine(first, second)) {
        const firstSpaced = sourceCode.isSpaceBetween!(first, second)
        const secondType = sourceCode.getNodeByRangeIndex(
          second.range[0],
        )!.type

        const openingCurlyBraceMustBeSpaced =
          options.arraysInObjectsException
          && [
            AST_NODE_TYPES.TSMappedType,
            AST_NODE_TYPES.TSIndexSignature,
          ].includes(secondType)
            ? !options.spaced
            : options.spaced

        if (openingCurlyBraceMustBeSpaced && !firstSpaced)
          reportRequiredBeginningSpace(node, first)

        if (
          !openingCurlyBraceMustBeSpaced
          && firstSpaced
          && second.type !== AST_TOKEN_TYPES.Line
        ) {
          reportNoBeginningSpace(node, first)
        }
      }

      if (isTokenOnSameLine(penultimate, last)) {
        const shouldCheckPenultimate =
          (options.arraysInObjectsException
            && isClosingBracketToken(penultimate))
          || (options.objectsInObjectsException
            && isClosingBraceToken(penultimate))
        const penultimateType = shouldCheckPenultimate
          ? sourceCode.getNodeByRangeIndex(penultimate.range[0])!.type
          : undefined

        const closingCurlyBraceMustBeSpaced =
          (
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

        const lastSpaced = sourceCode.isSpaceBetween!(penultimate, last)

        if (closingCurlyBraceMustBeSpaced && !lastSpaced)
          reportRequiredEndingSpace(node, last)

        if (!closingCurlyBraceMustBeSpaced && lastSpaced)
          reportNoEndingSpace(node, last)
      }
    }

    /**
     * Gets '}' token of an object node.
     *
     * Because the last token of object patterns might be a type annotation,
     * this traverses tokens preceded by the last property, then returns the
     * first '}' token.
     * @param node The node to get. This node is an
     *      ObjectExpression or an ObjectPattern. And this node has one or
     *      more properties.
     * @returns '}' token.
     */
    function getClosingBraceOfObject(
      node: Tree.ObjectPattern | Tree.ObjectExpression | Tree.TSTypeLiteral,
    ): Tree.Token | null {
      const lastProperty = node.type === 'TSTypeLiteral'
        ? node.members[node.members.length - 1]
        : node.properties[node.properties.length - 1]

      return sourceCode.getTokenAfter(lastProperty, isClosingBraceToken)
    }

    /**
     * Reports a given object node if spacing in curly braces is invalid.
     * @param node An ObjectExpression or ObjectPattern node to check.
     */
    function checkForObject(node:
      | Tree.ObjectExpression
      | Tree.ObjectPattern) {
      if (node.properties.length === 0)
        return

      const first = sourceCode.getFirstToken(node)!
      const last = getClosingBraceOfObject(node)!
      const second = sourceCode.getTokenAfter(first, { includeComments: true })!
      const penultimate = sourceCode.getTokenBefore(last, { includeComments: true })!

      validateBraceSpacing(node, first, second, penultimate, last)
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
      const second = sourceCode.getTokenAfter(first, { includeComments: true })!
      const penultimate = sourceCode.getTokenBefore(last, { includeComments: true })!

      validateBraceSpacing(node, first, second, penultimate, last)
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
      const second = sourceCode.getTokenAfter(first, { includeComments: true })!
      const penultimate = sourceCode.getTokenBefore(last, { includeComments: true })!

      validateBraceSpacing(node, first, second, penultimate, last)
    }

    return {
      // var {x} = y;
      ObjectPattern: checkForObject,
      // var y = {x: 'y'}
      ObjectExpression: checkForObject,
      // import {y} from 'x';
      ImportDeclaration: checkForImport,
      // export {name} from 'yo';
      ExportNamedDeclaration: checkForExport,
      TSMappedType(node: Tree.TSMappedType): void {
        const first = sourceCode.getFirstToken(node)!
        const last = sourceCode.getLastToken(node)!
        const second = sourceCode.getTokenAfter(first, {
          includeComments: true,
        })!
        const penultimate = sourceCode.getTokenBefore(last, {
          includeComments: true,
        })!

        validateBraceSpacing(node, first, second, penultimate, last)
      },
      TSTypeLiteral(node: Tree.TSTypeLiteral): void {
        if (node.members.length === 0)
          return

        const first = sourceCode.getFirstToken(node)!
        const last = getClosingBraceOfObject(node)!
        const second = sourceCode.getTokenAfter(first, {
          includeComments: true,
        })!
        const penultimate = sourceCode.getTokenBefore(last, {
          includeComments: true,
        })!

        validateBraceSpacing(node, first, second, penultimate, last)
      },
    }
  },
})
