import type { Rule } from 'eslint'
import type { UnprefixedRuleOptions } from './rule-options'

export type Rules = {
  [K in keyof UnprefixedRuleOptions]: Rule.RuleModule
}
