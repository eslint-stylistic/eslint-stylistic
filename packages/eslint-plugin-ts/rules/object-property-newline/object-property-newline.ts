import type { MessageIds, RuleOptions } from './types'
import type { Tree } from '#types'
import { createRule } from '#utils/create-rule'
import { getJsRule } from '#utils/get-js-rule'

const baseRule = getJsRule('object-property-newline')

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
