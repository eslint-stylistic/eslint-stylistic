/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: e2Haj08rfAq4MOSeRT_RDC0iAb3Fz-2x-mRdt0DkPdI */

export type LineCommentPositionSchema0
  = | ('above' | 'beside')
    | {
      position?: 'above' | 'beside'
      ignorePattern?: string
      applyDefaultPatterns?: boolean
      applyDefaultIgnorePatterns?: boolean
    }

export type LineCommentPositionRuleOptions = [
  LineCommentPositionSchema0?,
]

export type RuleOptions = LineCommentPositionRuleOptions
export type MessageIds = 'above' | 'beside'
