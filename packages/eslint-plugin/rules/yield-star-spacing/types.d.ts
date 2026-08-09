/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: iJF_VO2_4_ujnVoIeaUVFZjSmzJdTCdF_cmoQx0gk_A */

export type YieldStarSpacingSchema0 =
  | ('before' | 'after' | 'both' | 'neither')
  | {
    before?: boolean
    after?: boolean
  }

export type YieldStarSpacingRuleOptions = [
  YieldStarSpacingSchema0?,
]

export type RuleOptions = YieldStarSpacingRuleOptions
export type MessageIds =
  | 'missingBefore'
  | 'missingAfter'
  | 'unexpectedBefore'
  | 'unexpectedAfter'
