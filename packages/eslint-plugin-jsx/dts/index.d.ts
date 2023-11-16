import type { Linter, Rule } from 'eslint'
import type { UnprefixedRuleOptions } from './rule-options'

export type * from './rule-options'

export type Rules = {
  [K in keyof UnprefixedRuleOptions]: Rule.RuleModule
}

declare const plugin: {
  rules: Rules
  configs: {
    'disable-legacy': Linter.FlatConfig
  }
}

export default plugin
