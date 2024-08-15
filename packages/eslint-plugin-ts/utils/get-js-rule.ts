import jsRules from '@stylistic/eslint-plugin-js'
import type { TSESLint } from '@typescript-eslint/utils'

export function getJsRule(ruleId: keyof typeof jsRules.rules) {
  return jsRules.rules[ruleId] as unknown as TSESLint.RuleModule<any, readonly any[]>
}
