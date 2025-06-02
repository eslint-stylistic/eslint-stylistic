/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 6p0DVBA1jyP_DivtKE5cJHDUrlqPRmfL1c7UrlwUA24 */

export type GeneratorStarSpacingSchema0 =
  | ('before' | 'after' | 'both' | 'neither')
  | {
    before?: boolean
    after?: boolean
    named?:
        | ('before' | 'after' | 'both' | 'neither')
        | {
          before?: boolean
          after?: boolean
        }
    anonymous?:
        | ('before' | 'after' | 'both' | 'neither')
        | {
          before?: boolean
          after?: boolean
        }
    method?:
        | ('before' | 'after' | 'both' | 'neither')
        | {
          before?: boolean
          after?: boolean
        }
  }

export type GeneratorStarSpacingRuleOptions = [
  GeneratorStarSpacingSchema0?,
]

export type RuleOptions = GeneratorStarSpacingRuleOptions
export type MessageIds =
  | 'missingBefore'
  | 'missingAfter'
  | 'unexpectedBefore'
  | 'unexpectedAfter'
