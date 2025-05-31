/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: sgRKd9EmqWwgUrWdVPISPNql93oD-5v4QFDGrR08O1I */

export interface NoMultipleEmptyLinesSchema0 {
  max: number
  maxEOF?: number
  maxBOF?: number
}

export type NoMultipleEmptyLinesRuleOptions = [
  NoMultipleEmptyLinesSchema0?,
]

export type RuleOptions = NoMultipleEmptyLinesRuleOptions
export type MessageIds
  = | 'blankBeginningOfFile'
    | 'blankEndOfFile'
    | 'consecutiveBlank'
