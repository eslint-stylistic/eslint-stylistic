import type { ESLint } from 'eslint'
import type { UnprefixedRuleOptions } from './rule-options'

export type * from './rule-options'

declare const plugin: {
  rules: {
    [K in keyof UnprefixedRuleOptions]: ESLint.RuleModule
  }
}

export default plugin
