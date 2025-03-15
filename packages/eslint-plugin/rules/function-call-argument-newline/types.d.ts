/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: j2dbADp7Jl */

export type FunctionCallArgumentNewlineSchema0
  = | 'always'
    | 'never'
    | 'consistent'

export type FunctionCallArgumentNewlineRuleOptions = [
  FunctionCallArgumentNewlineSchema0?,
]

export type RuleOptions
  = FunctionCallArgumentNewlineRuleOptions
export type MessageIds
  = | 'unexpectedLineBreak'
    | 'missingLineBreak'
