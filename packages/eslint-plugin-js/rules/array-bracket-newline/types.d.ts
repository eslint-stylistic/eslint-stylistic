/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: AzVlrpbsAK */

export type Schema0 =
  | ('always' | 'never' | 'consistent')
  | {
    multiline?: boolean
    minItems?: number | null
  }

export type RuleOptions = [Schema0?]
export type MessageIds =
  | 'unexpectedOpeningLinebreak'
  | 'unexpectedClosingLinebreak'
  | 'missingOpeningLinebreak'
  | 'missingClosingLinebreak'
