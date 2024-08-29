import type { MessageIds, RuleOptions } from './types._ts_'
import _baseRule from './no-extra-semi._js_'
import { castRuleModule, createRule } from '#utils/create-rule'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

export default createRule<RuleOptions, MessageIds>({
  name: 'no-extra-semi',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow unnecessary semicolons',
    },
    fixable: 'code',
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema: baseRule.meta.schema,
    messages: baseRule.meta.messages,
  },
  defaultOptions: [],
  create(context) {
    const rules = baseRule.create(context)

    return {
      ...rules,
      'TSAbstractMethodDefinition, TSAbstractPropertyDefinition': function (node: never): void {
        rules['MethodDefinition, PropertyDefinition, StaticBlock']?.(node)
      },
    }
  },
})
