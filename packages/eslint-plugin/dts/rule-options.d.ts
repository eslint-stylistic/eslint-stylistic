import type { UnprefixedRuleOptions as JS } from '@stylistic/eslint-plugin-js/rule-options'
import type { UnprefixedRuleOptions as JSX } from '@stylistic/eslint-plugin-jsx/rule-options'
import type { UnprefixedRuleOptions as TS } from '@stylistic/eslint-plugin-ts/rule-options'

export interface UnprefixedRuleOptions extends JS, JSX, TS {}

export type RuleOptions = {
  [K in keyof UnprefixedRuleOptions as `@stylistic/${K}`]: UnprefixedRuleOptions[K]
}
