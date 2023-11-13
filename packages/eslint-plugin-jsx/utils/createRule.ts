import type { TSESLint } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'

export function createRule(rule: Omit<TSESLint.RuleModule<string, unknown[]>, 'defaultOptions'>) {
  return rule as unknown as Rule.RuleModule
}
