import type { UnprefixedRuleOptions } from '@stylistic/eslint-plugin-js'
import jsRules from '@stylistic/eslint-plugin-js'
import type { TSESLint } from '@typescript-eslint/utils'

export function getESLintCoreRule(ruleId: keyof UnprefixedRuleOptions) {
  if (ruleId in jsRules.rules)
    // TODO: fix this type
    return jsRules.rules[ruleId] as TSESLint.RuleModule<any, readonly any[]>
  throw new Error(`Failed to find core rule ${ruleId}, this is an internal bug of @stylistic/eslint-plugin-ts`)
}
