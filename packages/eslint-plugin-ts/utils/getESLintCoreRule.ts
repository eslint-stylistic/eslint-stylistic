import jsRules from '@stylistic/eslint-plugin-js'
import type { TSESLint } from '@typescript-eslint/utils'

export function getESLintCoreRule(ruleId: keyof typeof jsRules.rules) {
  if (ruleId in jsRules.rules)
    return jsRules.rules[ruleId] as unknown as TSESLint.RuleModule<any, readonly any[]>
  throw new Error(`Failed to find core rule ${ruleId}, this is an internal bug of @stylistic/eslint-plugin-ts`)
}
