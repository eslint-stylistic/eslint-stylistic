import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isDecimalInteger, isOpeningBracketToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

type SupportedNode = Tree.MemberExpression | Tree.TSIndexedAccessType | Tree.TSQualifiedName | Tree.TSImportType

export default createRule<RuleOptions, MessageIds>({
  name: 'no-whitespace-before-property',
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow whitespace before properties',
    },

    fixable: 'whitespace',
    schema: [],

    messages: {
      unexpectedWhitespace: 'Unexpected whitespace before property {{propName}}.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    function reportError(descriptor: {
      node: SupportedNode
      leftToken: ASTNode | Token
      rightToken: ASTNode | Token
      propName: string
      replacementText?: string
      preventAutoFix?: () => boolean
    }) {
      const {
        node,
        leftToken,
        rightToken,
        propName,
        replacementText = '',
        preventAutoFix,
      } = descriptor

      context.report({
        node,
        messageId: 'unexpectedWhitespace',
        data: {
          propName,
        },
        fix(fixer) {
          // Don't fix if comments exist.
          if (sourceCode.commentsExistBetween(leftToken, rightToken))
            return null

          if (preventAutoFix?.())
            return null

          return fixer.replaceTextRange([leftToken.range[1], rightToken.range[0]], replacementText)
        },
      })
    }

    return {
      MemberExpression(node) {
        if (!isTokenOnSameLine(node.object, node.property))
          return

        let rightToken: Token
        let leftToken: Token

        if (node.computed) {
          rightToken = sourceCode.getTokenBefore(node.property, isOpeningBracketToken)!
          leftToken = sourceCode.getTokenBefore(rightToken, node.optional ? 1 : 0)!
        }
        else {
          rightToken = sourceCode.getFirstToken(node.property)!
          leftToken = sourceCode.getTokenBefore(rightToken, 1)!
        }

        if (!sourceCode.isSpaceBetween(leftToken, rightToken))
          return

        let replacementText = ''

        if (node.optional)
          replacementText = '?.'
        else if (!node.computed)
          replacementText = '.'

        reportError({
          node,
          leftToken,
          rightToken,
          propName: sourceCode.getText(node.property),
          replacementText,
          // If the object is a number literal, fixing it to something like 5.toString() would cause a SyntaxError.
          preventAutoFix: () => !node.computed && !node.optional && isDecimalInteger(node.object),
        })
      },
      TSIndexedAccessType(node) {
        const leftToken = node.objectType
        const rightToken = sourceCode.getTokenBefore(node.indexType)!

        if (!sourceCode.isSpaceBetween(leftToken, rightToken))
          return

        reportError({
          node,
          leftToken,
          rightToken,
          propName: sourceCode.getText(node.indexType),
        })
      },
      TSQualifiedName(node) {
        const leftToken = node.left
        const rightToken = node.right

        if (!sourceCode.isSpaceBetween(leftToken, rightToken))
          return

        reportError({
          node,
          leftToken,
          rightToken,
          replacementText: '.',
          propName: sourceCode.getText(node.right),
        })
      },
      TSImportType(node) {
        if (!node.qualifier)
          return

        const rightToken = node.qualifier
        const leftToken = sourceCode.getTokenBefore(rightToken, 1)!

        if (!sourceCode.isSpaceBetween(leftToken, rightToken))
          return

        reportError({
          node,
          leftToken,
          rightToken,
          replacementText: '.',
          propName: sourceCode.getText(node.qualifier),
        })
      },
    }
  },
})
