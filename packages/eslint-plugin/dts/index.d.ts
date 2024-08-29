import type { Rules } from './rules'
import type { Configs } from './configs'

export type * from './rule-options'
export type * from './rules'
export type * from './configs'
export type * from './options'

declare const plugin: {
  rules: Rules
  configs: ESLint.Plugin['configs'] & Configs
}

export default plugin
