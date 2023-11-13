/* GENERATED, DO NOT EDIT DIRECTLY */

export type Schema0 =
  | ('consistent' | 'never')
  | {
    singleline?: 'consistent' | 'require' | 'forbid'
    multiline?: 'consistent' | 'require' | 'forbid'
  }

export type RuleOptions = [Schema0?]
export type MessageIds = 'expectedBefore' | 'expectedAfter' | 'unexpectedBefore' | 'unexpectedAfter'
