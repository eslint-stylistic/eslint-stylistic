/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: WKQe0orC7z285Xaajj2oQmnoj_l63UyKP_jh9x_fBfs */

export type ArrayBracketNewlineSchema0
  = | ('always' | 'never' | 'consistent')
    | {
      multiline?: boolean
      minItems?: number | null
    }

export type ArrayBracketNewlineRuleOptions = [
  ArrayBracketNewlineSchema0?,
]

export type RuleOptions = ArrayBracketNewlineRuleOptions
export type MessageIds
  = | 'unexpectedOpeningLinebreak'
    | 'unexpectedClosingLinebreak'
    | 'missingOpeningLinebreak'
    | 'missingClosingLinebreak'
