/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 4IIVU1ZDqG */

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
