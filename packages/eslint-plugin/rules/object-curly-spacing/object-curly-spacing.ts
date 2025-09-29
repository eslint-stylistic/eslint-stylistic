import type { ASTNode, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  isClosingBraceToken,
  isClosingBracketToken,
  isOpeningBraceToken,
  isTokenOnSameLine,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

const SUPPORTED_NODES = ['ObjectPattern', 'ObjectExpression', 'ImportDeclaration', 'ImportAttributes', 'ExportNamedDeclaration', 'ExportAllDeclaration', 'TSMappedType', 'TSTypeLiteral', 'TSInterfaceBody', 'TSEnumBody'] as const

type SupportedNodeTypes = typeof SUPPORTED_NODES[number]
type SupportedNodes = Extract<ASTNode, { type: SupportedNodeTypes }>

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
          overrides: {
            type: 'object',
            properties: Object.fromEntries(
              SUPPORTED_NODES.map(node => [
                node,
                {
                  type: 'string',
                  enum: ['always', 'never'],
                },
              ]),
            ),
            additionalProperties: false,
          },
          emptyObject: {
            type: 'string',
            enum: ['ignore', 'always', 'never'],
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
      requiredSpaceInEmpty: 'A space is required in empty \'{{node}}\'.',
      unexpectedSpaceInEmpty: 'There should be no space in empty \'{{node}}\'.',
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
      overrides: secondOption?.overrides ?? {},
      emptyObject: secondOption?.emptyObject ?? 'ignore',
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
      node: SupportedNodes,
      openingToken: Token,
      closingToken: Token,
      nodeType: SupportedNodeTypes = node.type,
    ): void {
      const tokenAfterOpening = sourceCode.getTokenAfter(openingToken, { includeComments: true })!

      const spaced = options.overrides[nodeType]
        ? options.overrides[nodeType] === 'always'
        : options.spaced

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
            ? !spaced
            : spaced

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
            ? !spaced
            : spaced

        const lastSpaced = sourceCode.isSpaceBetween!(tokenBeforeClosing, closingToken)

        if (closingCurlyBraceMustBeSpaced && !lastSpaced)
          reportRequiredEndingSpace(node, closingToken)

        if (!closingCurlyBraceMustBeSpaced && lastSpaced)
          reportNoEndingSpace(node, closingToken)
      }
    }

    function checkSpaceInEmptyObjectLike(node: SupportedNodes, openingToken: Token, closingToken: Token) {
      if (options.emptyObject === 'ignore')
        return

      const hasComment = sourceCode.getCommentsBefore(closingToken).length > 0
      // only report if there are no comments and the brace on the same line
      if (!hasComment && openingToken.loc.start.line === closingToken.loc.end.line) {
        const sourceBetween = sourceCode.getText().slice(openingToken.range[0] + 1, closingToken.range[1] - 1)
        if (sourceBetween.trim() !== '')
          return
        const hasSpace = sourceBetween.length > 0
        const hasSingleSpace = sourceBetween === ' '

        if (options.emptyObject === 'always') {
          if (!hasSpace || !hasSingleSpace) {
            context.report({
              node,
              loc: { start: openingToken.loc.end, end: closingToken.loc.start },
              messageId: 'requiredSpaceInEmpty',
              data: {
                node: node.type,
              },
              fix(fixer) {
                if (!hasSpace) {
                  return fixer.insertTextAfter(openingToken, ' ')
                }
                else {
                  return fixer.replaceTextRange([openingToken.range[1], closingToken.range[0]], ' ')
                }
              },
            })
          }
        }
        else if (options.emptyObject === 'never' && hasSpace) {
          context.report({
            node,
            loc: { start: openingToken.loc.end, end: closingToken.loc.start },
            messageId: 'unexpectedSpaceInEmpty',
            data: {
              node: node.type,
            },
            fix(fixer) {
              return fixer.removeRange([openingToken.range[1], closingToken.range[0]])
            },
          })
        }
      }
    }

    function getBraceToken(node: SupportedNodes, nodeType: SupportedNodeTypes = node.type): [Token, Token] {
      switch (nodeType) {
        case 'ImportDeclaration':
        case 'ExportNamedDeclaration':
        case 'ExportAllDeclaration':{
          const attrTokens = sourceCode.getTokens(node)
          const openingAttrToken = attrTokens.find(token => isOpeningBraceToken(token))!
          const closingAttrToken = attrTokens.find(token => isClosingBraceToken(token))!
          return [openingAttrToken, closingAttrToken]
        }
        case 'ImportAttributes':{
          const attrTokens = sourceCode.getTokens(node)
          const openingAttrToken = attrTokens.findLast(token => isOpeningBraceToken(token))!
          const closingAttrToken = attrTokens.findLast(token => isClosingBraceToken(token))!
          return [openingAttrToken, closingAttrToken]
        }
        case 'ObjectPattern':
        case 'ObjectExpression':
        case 'TSMappedType':
        case 'TSTypeLiteral':
        case 'TSInterfaceBody':
        case 'TSEnumBody': {
          const allTokens = sourceCode.getTokens(node)
          const openingToken = allTokens.find(token => isOpeningBraceToken(token))!
          const closingToken = allTokens.findLast(token => isClosingBraceToken(token))!
          return [openingToken, closingToken]
        }
        /* v8 ignore start */
        default:
          throw new Error(`Unsupported node type: ${nodeType}`)
        /* v8 ignore stop */
      }
    }

    /**
     * Reports a given object-like node if spacing in curly braces is invalid.
     * @param node An object-like node to check.
     * @param properties The properties of the object-like node
     */
    function checkForObjectLike(node: SupportedNodes, properties: ASTNode[], nodeType: SupportedNodeTypes = node.type) {
      const [openingToken, closingToken] = getBraceToken(node, nodeType)
      if (properties.length === 0) {
        checkSpaceInEmptyObjectLike(node, openingToken, closingToken)
        return
      }

      validateBraceSpacing(node, openingToken, closingToken, nodeType)
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
      ImportDeclaration(node) {
        if (node.attributes)
          checkForObjectLike(node, node.attributes, 'ImportAttributes')

        const firstSpecifierIndex = node.specifiers.findIndex(specifier => specifier.type === 'ImportSpecifier')

        if (firstSpecifierIndex === -1) {
          checkForObjectLike(node, [])
          return
        }

        checkForObjectLike(node, node.specifiers.slice(firstSpecifierIndex))
      },
      // export {name} from 'yo';
      ExportNamedDeclaration(node) {
        checkForObjectLike(node, node.specifiers)

        if (node.attributes)
          checkForObjectLike(node, node.attributes, 'ImportAttributes')
      },
      ExportAllDeclaration(node) {
        if (node.attributes)
          checkForObjectLike(node, node.attributes, 'ImportAttributes')
      },
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
