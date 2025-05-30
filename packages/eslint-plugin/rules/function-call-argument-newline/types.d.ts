/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 2q70CUD0hf1bWFxDUHD1MpOAf3tZJOu0A5v4DuHpQGU */

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
