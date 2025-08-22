/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: _diSuC7dA1T1EMmf3Yzfioi86UupZcFBOdESE82AcYc */

export interface SpaceUnaryOpsSchema0 {
  nonwords?: boolean
  overrides?: {
    [k: string]: boolean
  }
}

export type SpaceUnaryOpsRuleOptions = [
  SpaceUnaryOpsSchema0?,
]

export type RuleOptions = SpaceUnaryOpsRuleOptions
export type MessageIds
  = | 'unexpectedBefore'
    | 'unexpectedAfter'
    | 'requireAfter'
    | 'requireBefore'
