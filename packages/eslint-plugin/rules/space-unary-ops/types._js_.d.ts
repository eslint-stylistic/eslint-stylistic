/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 7GbNk3mdSm */

export interface Schema0 {
  words?: boolean
  nonwords?: boolean
  overrides?: {
    [k: string]: boolean
  }
}

export type RuleOptions = [Schema0?]
export type MessageIds =
  | 'unexpectedBefore'
  | 'unexpectedAfter'
  | 'unexpectedAfterWord'
  | 'wordOperator'
  | 'operator'
  | 'beforeUnaryExpressions'
