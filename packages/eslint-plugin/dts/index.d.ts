import type { ESLint } from 'eslint'
import type { Configs } from './configs'
import type { Rules } from './rules'

export type { Configs } from './configs'
export type { StylisticCustomizeOptions } from './options'
export type { RuleOptions, UnprefixedRuleOptions } from './rule-options'
export type { Rules } from './rules'

declare const plugin: {
  rules: Rules
  configs: ESLint.Plugin['configs'] & Configs
}

export default plugin
