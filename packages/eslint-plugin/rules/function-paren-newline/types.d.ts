/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: DrPNTis4KE */

export type FunctionParenNewlineSchema0 =
  | (
    | 'always'
    | 'never'
    | 'consistent'
    | 'multiline'
    | 'multiline-arguments'
    )
  | {
    minItems?: number
  }

export type FunctionParenNewlineRuleOptions = [
  FunctionParenNewlineSchema0?,
]

export type RuleOptions = FunctionParenNewlineRuleOptions
export type MessageIds =
  | 'expectedBefore'
  | 'expectedAfter'
  | 'expectedBetween'
  | 'unexpectedBefore'
  | 'unexpectedAfter'
