import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'object-property-newline',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce placing object properties on separate lines',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowAllPropertiesOnSameLine: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: 'whitespace',
    messages: {
      propertiesOnNewlineAll: 'Object properties must go on a new line if they aren\'t all on the same line.',
      propertiesOnNewline: 'Object properties must go on a new line.',
    },
  },
  defaultOptions: [
    {
      allowAllPropertiesOnSameLine: false,
    },
  ],

  create(context) {
    const allowSameLine = context.options[0] && (context.options[0].allowAllPropertiesOnSameLine)

    const messageId = allowSameLine
      ? 'propertiesOnNewlineAll'
      : 'propertiesOnNewline'

    const sourceCode = context.sourceCode

    function check(node: ASTNode, children: Tree.ObjectLiteralElement[] | Tree.TypeElement[]) {
      if (allowSameLine) {
        if (children.length > 1) {
          const firstTokenOfFirstProperty = sourceCode.getFirstToken(children[0])!
          const lastTokenOfLastProperty = sourceCode.getLastToken(children[children.length - 1])!

          if (firstTokenOfFirstProperty.loc.end.line === lastTokenOfLastProperty.loc.start.line) {
            // All keys and values are on the same line
            return
          }
        }
      }

      for (let i = 1; i < children.length; i++) {
        const lastTokenOfPreviousProperty = sourceCode.getLastToken(children[i - 1])!
        const firstTokenOfCurrentProperty = sourceCode.getFirstToken(children[i])!

        if (lastTokenOfPreviousProperty.loc.end.line === firstTokenOfCurrentProperty.loc.start.line) {
          context.report({
            node,
            loc: firstTokenOfCurrentProperty.loc,
            messageId,
            fix(fixer) {
              const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty)!
              const rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]] as const

              // Don't perform a fix if there are any comments between the comma and the next property.
              if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim())
                return null

              return fixer.replaceTextRange(rangeAfterComma, '\n')
            },
          })
        }
      }
    }

    return {
      ObjectExpression(node) {
        check(node, node.properties)
      },
      TSTypeLiteral(node) {
        check(node, node.members)
      },
      TSInterfaceBody(node) {
        check(node, node.body)
      },
    }
  },
})
