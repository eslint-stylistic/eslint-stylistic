import type { ESLint } from 'eslint'
import type { UnprefixedRuleOptions } from './rule-options'

export type * from './rule-options'

export type Rules = {
  [K in keyof UnprefixedRuleOptions]: ESLint.RuleModule
}

declare const plugin: {
  rules: Rules
}

export default plugin
