export type Schema0 = 'always' | 'never'

export interface Schema1 {
  exceptAfterSingleLine?: boolean
  exceptAfterOverload?: boolean
}

export type RuleOptions = [Schema0?, Schema1?]
