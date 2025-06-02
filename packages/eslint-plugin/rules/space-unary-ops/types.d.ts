/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: G9RVJDXZp1P_2jDjDkZI4P6p50O5qo0gyHUwlZ4JZOg */

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
export type MessageIds =
  | 'unexpectedBefore'
  | 'unexpectedAfter'
  | 'unexpectedAfterWord'
  | 'wordOperator'
  | 'operator'
  | 'beforeUnaryExpressions'
