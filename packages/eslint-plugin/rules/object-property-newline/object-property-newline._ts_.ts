import { castRuleModule, createRule } from '#utils/create-rule'
import type { Tree } from '#types'
import _baseRule from './object-property-newline._js_'
import type { MessageIds, RuleOptions } from './types'

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
