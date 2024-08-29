/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: AzVlrpbsAK */

export type ArrayBracketNewlineSchema0 =
  | ('always' | 'never' | 'consistent')
  | {
    multiline?: boolean
    minItems?: number | null
  }

export type ArrayBracketNewlineRuleOptions = [
  ArrayBracketNewlineSchema0?,
]

export type RuleOptions = ArrayBracketNewlineRuleOptions
export type MessageIds =
  | 'unexpectedOpeningLinebreak'
  | 'unexpectedClosingLinebreak'
  | 'missingOpeningLinebreak'
  | 'missingClosingLinebreak'
