/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ZKLP0E4wnP */

export type ComputedPropertySpacingSchema0 =
  | 'always'
  | 'never'

export interface ComputedPropertySpacingSchema1 {
  enforceForClassMembers?: boolean
}

export type ComputedPropertySpacingRuleOptions = [
  ComputedPropertySpacingSchema0?,
  ComputedPropertySpacingSchema1?,
]

export type RuleOptions = ComputedPropertySpacingRuleOptions
export type MessageIds =
  | 'unexpectedSpaceBefore'
  | 'unexpectedSpaceAfter'
  | 'missingSpaceBefore'
  | 'missingSpaceAfter'
