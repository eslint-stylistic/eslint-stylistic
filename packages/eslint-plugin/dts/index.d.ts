import type { ESLint } from 'eslint'
import type { Configs } from './configs'
import type { Rules } from './rules'

export type * from './configs'
export type * from './options'
export type * from './rule-options'
export type * from './rules'

declare const plugin: {
  rules: Rules
  configs: ESLint.Plugin['configs'] & Configs
}

export default plugin
