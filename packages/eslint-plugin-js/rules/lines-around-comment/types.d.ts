/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: nNlg74jmQH */

export interface LinesAroundCommentSchema0 {
  beforeBlockComment?: boolean
  afterBlockComment?: boolean
  beforeLineComment?: boolean
  afterLineComment?: boolean
  allowBlockStart?: boolean
  allowBlockEnd?: boolean
  allowClassStart?: boolean
  allowClassEnd?: boolean
  allowObjectStart?: boolean
  allowObjectEnd?: boolean
  allowArrayStart?: boolean
  allowArrayEnd?: boolean
  ignorePattern?: string
  applyDefaultIgnorePatterns?: boolean
  afterHashbangComment?: boolean
}

export type LinesAroundCommentRuleOptions = [
  LinesAroundCommentSchema0?,
]

export type RuleOptions = LinesAroundCommentRuleOptions
export type MessageIds = 'after' | 'before'
