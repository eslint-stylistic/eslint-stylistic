import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { castRuleModule, createRule } from '#utils/create-rule'
import _baseRule from './object-property-newline._js_'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

export default createRule<RuleOptions, MessageIds>({
  name: 'object-property-newline',
  package: 'ts',
  meta: {
    ...baseRule.meta,
    docs: {
      description: 'Enforce placing object properties on separate lines',
    },
  },
  defaultOptions: [
    {
      allowAllPropertiesOnSameLine: false,
      allowMultiplePropertiesPerLine: false,
    },
  ],

  create(context) {
    const rules = baseRule.create(context)
    const allowSameLine = context.options[0] && (
      (context.options[0].allowAllPropertiesOnSameLine || context.options[0].allowMultiplePropertiesPerLine /* Deprecated */)
    )
    const messageId = allowSameLine
      ? 'propertiesOnNewlineAll'
      : 'propertiesOnNewline'

    const sourceCode = context.sourceCode

    return {
      ObjectExpression(node) {
        if (allowSameLine) {
          if (node.properties.length > 1) {
            const firstTokenOfFirstProperty = sourceCode.getFirstToken(node.properties[0])!
            const lastTokenOfLastProperty = sourceCode.getLastToken(node.properties[node.properties.length - 1])!

            if (firstTokenOfFirstProperty.loc.end.line === lastTokenOfLastProperty.loc.start.line) {
              // All keys and values are on the same line
              return
            }
          }
        }

        for (let i = 1; i < node.properties.length; i++) {
          const lastTokenOfPreviousProperty = sourceCode.getLastToken(node.properties[i - 1])!
          const firstTokenOfCurrentProperty = sourceCode.getFirstToken(node.properties[i])!

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
      },
      TSTypeLiteral(node: Tree.TSTypeLiteral) {
        return rules.ObjectExpression!({
          ...node,
          // @ts-expect-error only used to get token and loc
          properties: node.members,
        })
      },
      TSInterfaceBody(node: Tree.TSInterfaceBody) {
        return rules.ObjectExpression!({
          ...node,
          // @ts-expect-error only used to get token and loc
          properties: node.body,
        })
      },
    }
  },
})
