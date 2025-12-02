import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isDecimalIntegerNumericToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

type SupportedNode = Tree.MemberExpression | Tree.TSQualifiedName | Tree.TSImportType

export default createRule<RuleOptions, MessageIds>({
  name: 'dot-location',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent newlines before and after dots',
    },
    schema: [
      {
        type: 'string',
        enum: ['object', 'property'],
      },
    ],
    fixable: 'code',
    messages: {
      expectedDotAfterObject: 'Expected dot to be on same line as object.',
      expectedDotBeforeProperty: 'Expected dot to be on same line as property.',
    },
    defaultOptions: ['object'],
  },

  create(context, [config]) {
    const onObject = config === 'object'

    const sourceCode = context.sourceCode

    /** Reports if the dot between object and property is on the correct location. */
    function checkDotLocation(node: SupportedNode) {
      const property = node.type === 'MemberExpression'
        ? node.property
        : node.type === 'TSImportType'
          ? node.qualifier!
          : node.right
      const dotToken = sourceCode.getTokenBefore(property, token => token.value === '.')

      if (!dotToken)
        return

      if (onObject) {
        // `obj` expression can be parenthesized, but those paren tokens are not a part of the `obj` node.
        const tokenBeforeDot = sourceCode.getTokenBefore(dotToken)

        if (tokenBeforeDot && !isTokenOnSameLine(tokenBeforeDot, dotToken)) {
          context.report({
            node,
            loc: dotToken.loc,
            messageId: 'expectedDotAfterObject',
            * fix(fixer) {
              if (dotToken.value.startsWith('.') && isDecimalIntegerNumericToken(tokenBeforeDot))
                yield fixer.insertTextAfter(tokenBeforeDot, ` ${dotToken.value}`)
              else
                yield fixer.insertTextAfter(tokenBeforeDot, dotToken.value)

              yield fixer.remove(dotToken)
            },
          })
        }
      }
      else if (!isTokenOnSameLine(dotToken, property)) {
        context.report({
          node,
          loc: dotToken.loc,
          messageId: 'expectedDotBeforeProperty',
          * fix(fixer) {
            yield fixer.remove(dotToken)
            yield fixer.insertTextBefore(property, dotToken.value)
          },
        })
      }
    }

    return {
      MemberExpression(node) {
        if (node.computed)
          return

        checkDotLocation(node)
      },
      TSQualifiedName(node) {
        checkDotLocation(node)
      },
      TSImportType(node) {
        if (!node.qualifier)
          return

        checkDotLocation(node)
      },
    }
  },
})
