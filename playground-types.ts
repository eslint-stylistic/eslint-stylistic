import type { Linter } from 'eslint'
import type { RuleOptions } from '@stylistic/eslint-plugin'
import type { RuleConfig } from '@antfu/eslint-define-config'

export type TypedFlatConfig = Omit<Linter.FlatConfig, 'rules' | 'plugins'> & {
  rules?: {
    [K in keyof RuleOptions]?: RuleConfig<RuleOptions[K]>
  } & {
    [key: string]: RuleConfig<any[]>
  }
  plugins?: {
    [key: string]: unknown
  }
}
