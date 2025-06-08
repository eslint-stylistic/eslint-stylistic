/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 7ZOKN86HWNMa1S0dgsc6qdcHfKhGOwmb9W60zIwjHMo */

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
  allowInterfaceStart?: boolean
  allowInterfaceEnd?: boolean
  allowTypeStart?: boolean
  allowTypeEnd?: boolean
  allowEnumStart?: boolean
  allowEnumEnd?: boolean
  allowModuleStart?: boolean
  allowModuleEnd?: boolean
  ignorePattern?: string
  applyDefaultIgnorePatterns?: boolean
  afterHashbangComment?: boolean
  allowGroupStart?: ('(' | '[' | '{')[]
  allowGroupEnd?: (')' | ']' | '}')[]
}

export type LinesAroundCommentRuleOptions = [
  LinesAroundCommentSchema0?,
]

export type RuleOptions = LinesAroundCommentRuleOptions
export type MessageIds = 'after' | 'before'
