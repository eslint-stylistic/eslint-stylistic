/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: sHmAHfAD-dTU0BMSRETEuscZ_pJ7XrVxC-5M7bNjsa8 */

export interface SpaceUnaryOpsSchema0 {
  words?: boolean
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
    | 'unexpectedAfterWord'
    | 'requireAfterWord'
    | 'requireAfter'
    | 'requireBefore'
