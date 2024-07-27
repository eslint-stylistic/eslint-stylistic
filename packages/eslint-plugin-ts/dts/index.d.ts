import type { Linter, Rule } from 'eslint'
import type { UnprefixedRuleOptions } from './rule-options'

export type * from './rule-options'

export type Rules = {
  [K in keyof UnprefixedRuleOptions]: Rule.RuleModule
}

declare const plugin: {
  rules: Rules
  configs: {
    /**
     * Disable all legacy rules from `@typescript-eslint`
     *
     * This config works for both flat and legacy config format
     */
    'disable-legacy': Linter.Config
    /**
     * Enable all rules, in Flat Config Format
     */
    'all-flat': Linter.Config
    /**
     * Enable all rules, in Legacy Config Format
     */
    'all-extends': Linter.BaseConfig
  }
}

export default plugin
