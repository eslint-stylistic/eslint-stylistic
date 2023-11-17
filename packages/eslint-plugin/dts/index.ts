import type { Rule } from 'eslint'
import type { configs } from '../configs'
import type { UnprefixedRuleOptions } from './rule-options'

export type * from './rule-options'
export type * from '../configs'

export type Rules = {
  [K in keyof UnprefixedRuleOptions]: Rule.RuleModule
}

declare const plugin: {
  rules: Rules
  configs: typeof configs
}

export default plugin
