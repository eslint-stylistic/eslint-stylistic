import type { UnprefixedRuleOptions as JS } from '@stylistic/eslint-plugin-js'
import type { UnprefixedRuleOptions as JSX } from '@stylistic/eslint-plugin-jsx'
import type { UnprefixedRuleOptions as TS } from '@stylistic/eslint-plugin-ts'
import type { UnprefixedRuleOptions as PLUS } from '@stylistic/eslint-plugin-plus'

export type UnprefixedRuleOptions = JS & JSX & TS & PLUS

export type RuleOptions = {
  [K in keyof UnprefixedRuleOptions as `@stylistic/${K}`]: UnprefixedRuleOptions[K]
}
