/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: E0B_HpsBrWma5eE8VAwxPP8smmRlKCp_3EwEQ5C3Hss */

export type LineCommentPositionSchema0
  = | ('above' | 'beside')
    | {
      position?: 'above' | 'beside'
      ignorePattern?: string
      applyDefaultIgnorePatterns?: boolean
    }

export type LineCommentPositionRuleOptions = [
  LineCommentPositionSchema0?,
]

export type RuleOptions = LineCommentPositionRuleOptions
export type MessageIds = 'above' | 'beside'
