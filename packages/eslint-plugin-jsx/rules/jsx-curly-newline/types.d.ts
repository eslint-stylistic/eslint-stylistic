export type Schema0 =
  | ('consistent' | 'never')
  | {
    singleline?: 'consistent' | 'require' | 'forbid'
    multiline?: 'consistent' | 'require' | 'forbid'
  }

export type RuleOptions = [Schema0?]
