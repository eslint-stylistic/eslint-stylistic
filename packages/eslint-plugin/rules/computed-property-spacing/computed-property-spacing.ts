import type { ASTNode, RuleListener, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isClosingBracketToken, isOpeningBracketToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

type SupportedNode
  = | Tree.Property
    | Tree.PropertyDefinition
    | Tree.AccessorProperty
    | Tree.MemberExpression
    | Tree.MethodDefinition
    | Tree.TSIndexedAccessType

export default createRule<RuleOptions, MessageIds>({
  name: 'computed-property-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing inside computed property brackets',
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
          enforceForClassMembers: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: ['never', { enforceForClassMembers: true }],
    messages: {
      unexpectedSpaceBefore: 'There should be no space before \'{{tokenValue}}\'.',
      unexpectedSpaceAfter: 'There should be no space after \'{{tokenValue}}\'.',

      missingSpaceBefore: 'A space is required before \'{{tokenValue}}\'.',
      missingSpaceAfter: 'A space is required after \'{{tokenValue}}\'.',
    },
  },
  create(context, [style, options]) {
    const sourceCode = context.sourceCode
    const propertyNameMustBeSpaced = style === 'always'
    const {
      enforceForClassMembers,
    } = options!

    /**
     * Reports that there shouldn't be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     * @param tokenAfter The token after `token`.
     */
    function reportNoBeginningSpace(node: ASTNode, token: Token, tokenAfter: Token): void {
      context.report({
        node,
        loc: { start: token.loc.end, end: tokenAfter.loc.start },
        messageId: 'unexpectedSpaceAfter',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([token.range[1], tokenAfter.range[0]])
        },
      })
    }

    /**
     * Reports that there shouldn't be a space before the last token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     * @param tokenBefore The token before `token`.
     */
    function reportNoEndingSpace(node: ASTNode, token: Token, tokenBefore: Token): void {
      context.report({
        node,
        loc: { start: tokenBefore.loc.end, end: token.loc.start },
        messageId: 'unexpectedSpaceBefore',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.removeRange([tokenBefore.range[1], token.range[0]])
        },
      })
    }

    /**
     * Reports that there should be a space after the first token
     * @param node The node to report in the event of an error.
     * @param token The token to use for the report.
     */
    function reportRequiredBeginningSpace(node: ASTNode, token: Token): void {
      context.report({
        node,
        loc: token.loc,
        messageId: 'missingSpaceAfter',
        data: {
          tokenValue: token.value,
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
    function reportRequiredEndingSpace(node: ASTNode, token: Token): void {
      context.report({
        node,
        loc: token.loc,
        messageId: 'missingSpaceBefore',
        data: {
          tokenValue: token.value,
        },
        fix(fixer) {
          return fixer.insertTextBefore(token, ' ')
        },
      })
    }

    type ExtractNodeKeys<T> = {
      [K in keyof T]: T[K] extends ASTNode ? K : never
    }[keyof T]

    /**
     * Returns a function that checks the spacing of a node on the property name
     * that was passed in.
     * @param propertyName The property on the node to check for spacing
     * @returns A function that will check spacing on a node
     */
    function checkSpacing<T extends SupportedNode, K = ExtractNodeKeys<T>>(propertyName: K) {
      return function (node: SupportedNode) {
        if (node.type !== 'TSIndexedAccessType' && !node.computed)
          return

        const property = node[propertyName as ExtractNodeKeys<typeof node>]

        const before = sourceCode.getTokenBefore(property, isOpeningBracketToken)!
        const first = sourceCode.getTokenAfter(before, { includeComments: true })!
        const after = sourceCode.getTokenAfter(property, isClosingBracketToken)!
        const last = sourceCode.getTokenBefore(after, { includeComments: true })!

        if (isTokenOnSameLine(before, first)) {
          if (propertyNameMustBeSpaced) {
            if (!sourceCode.isSpaceBetween(before, first) && isTokenOnSameLine(before, first))
              reportRequiredBeginningSpace(node, before)
          }
          else {
            if (sourceCode.isSpaceBetween(before, first))
              reportNoBeginningSpace(node, before, first)
          }
        }

        if (isTokenOnSameLine(last, after)) {
          if (propertyNameMustBeSpaced) {
            if (!sourceCode.isSpaceBetween(last, after) && isTokenOnSameLine(last, after))
              reportRequiredEndingSpace(node, after)
          }
          else {
            if (sourceCode.isSpaceBetween(last, after))
              reportNoEndingSpace(node, after, last)
          }
        }
      }
    }

    const listeners: RuleListener = {
      Property: checkSpacing<Tree.Property>('key'),
      MemberExpression: checkSpacing<Tree.MemberExpression>('property'),
      TSIndexedAccessType: checkSpacing<Tree.TSIndexedAccessType>('indexType'),
    }

    if (enforceForClassMembers) {
      listeners.MethodDefinition = checkSpacing<Tree.MethodDefinition>('key')
      listeners.PropertyDefinition = checkSpacing<Tree.PropertyDefinition>('key')
      listeners.AccessorProperty = checkSpacing<Tree.AccessorProperty>('key')
    }

    return listeners
  },
})
