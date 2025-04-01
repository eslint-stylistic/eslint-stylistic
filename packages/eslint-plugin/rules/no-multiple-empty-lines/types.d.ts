/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: doIm5j60g7 */

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
