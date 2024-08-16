/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: U55gtxk4Fd */

export type Schema0 = 'always' | 'never'

export interface Schema1 {
  exceptions?: ('{}' | '[]' | '()' | 'empty')[]
}

export type RuleOptions = [Schema0?, Schema1?]
export type MessageIds =
  | 'missingOpeningSpace'
  | 'missingClosingSpace'
  | 'rejectedOpeningSpace'
  | 'rejectedClosingSpace'
