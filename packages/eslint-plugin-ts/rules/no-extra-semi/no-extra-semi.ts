import { createRule } from '../../utils'
import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('no-extra-semi')

export default createRule<RuleOptions, MessageIds>({
  name: 'no-extra-semi',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow unnecessary semicolons',
      extendsBaseRule: true,
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
      'TSAbstractMethodDefinition, TSAbstractPropertyDefinition': function (
        node: never,
      ): void {
        if (rules.MethodDefinition) {
          // for ESLint <= v7
          rules.MethodDefinition(node)
        }
        else if (rules['MethodDefinition, PropertyDefinition']) {
          // for ESLint >= v8 < v8.3.0
          rules['MethodDefinition, PropertyDefinition'](node)
        }
        else {
          // for ESLint >= v8.3.0
          rules['MethodDefinition, PropertyDefinition, StaticBlock']?.(node)
        }
      },
    }
  },
})
