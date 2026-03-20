/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 6CTfcIykfag9YtcuxXQXFuQ_7ZcIKi64z2UVt4X6lPI */

export type ComputedPropertySpacingSchema0
  = | 'always'
    | 'never'

export interface ComputedPropertySpacingSchema1 {
  enforceForClassMembers?: boolean
}

export type ComputedPropertySpacingRuleOptions = [
  ComputedPropertySpacingSchema0?,
  ComputedPropertySpacingSchema1?,
]

export type RuleOptions = ComputedPropertySpacingRuleOptions
export type MessageIds
  = | 'unexpectedSpaceBefore'
    | 'unexpectedSpaceAfter'
    | 'missingSpaceBefore'
    | 'missingSpaceAfter'
