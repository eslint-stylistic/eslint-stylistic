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

    return {
      ...rules,
      TSTypeLiteral(node: Tree.TSTypeLiteral) {
        // Use the ObjectExpression handler but with the TSTypeLiteral node
        return rules.ObjectExpression!({
          ...node,
          // @ts-expect-error only used to get token and loc
          properties: node.members,
        })
      },
      TSInterfaceBody(node: Tree.TSInterfaceBody) {
        // Use the ObjectExpression handler but with the TSInterfaceBody node
        return rules.ObjectExpression!({
          ...node,
          // @ts-expect-error only used to get token and loc
          properties: node.body,
        })
      },
    }
  },
})
