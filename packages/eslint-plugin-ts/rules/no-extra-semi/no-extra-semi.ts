import { createRule } from '../../../utils/create-rule'
import { getJsRule } from '../../../utils/get-js-rule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getJsRule('no-extra-semi')

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
