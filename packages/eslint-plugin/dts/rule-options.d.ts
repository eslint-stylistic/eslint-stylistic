import type { UnprefixedRuleOptions as JS } from '@stylistic/eslint-plugin-js'
import type { UnprefixedRuleOptions as JSX } from '@stylistic/eslint-plugin-jsx'
import type { UnprefixedRuleOptions as TS } from '@stylistic/eslint-plugin-ts'

export interface UnprefixedRuleOptions extends JS, JSX, TS {}

export type RuleOptions = {
  [K in keyof UnprefixedRuleOptions as `@stylistic/${K}`]: UnprefixedRuleOptions[K]
}
