/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 38qIJQzq8j */

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
    | 'wordOperator'
    | 'operator'
    | 'beforeUnaryExpressions'
