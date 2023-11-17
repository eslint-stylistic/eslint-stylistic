import type { ESLint, Linter } from 'eslint'
import type { UnprefixedRuleOptions } from './rule-options'

export type * from './rule-options'

export type Rules = {
  [K in keyof UnprefixedRuleOptions]: ESLint.RuleModule
}

declare const plugin: {
  rules: Rules
  configs: {
    /**
     * Enable all rules, in Flat Config Format
     */
    'all-flat': Linter.FlatConfig
    /**
     * Enable all rules, in Legacy Config Format
     */
    'all-extends': Linter.BaseConfig
  }
}

export default plugin
