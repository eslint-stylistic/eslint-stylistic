/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: aHiKXiB9SNxmPpx2kVe6rwCoifxytkGG_twErLHAHRQ */

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
    | 'operator'
    | 'beforeUnaryExpressions'
