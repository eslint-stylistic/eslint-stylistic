import jsRules from '@stylistic/eslint-plugin-js'
import type { Rule } from 'eslint'

export const getESLintCoreRule: (ruleId: string) => Rule.RuleModule = (ruleId) => {
  if (ruleId in jsRules.rules)
    return jsRules.rules[ruleId]()
  throw new Error(`Failed to find core rule ${ruleId}, this is an internal bug of @stylistic/eslint-plugin-ts`)
}
