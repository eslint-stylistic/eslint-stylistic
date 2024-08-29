/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: U55gtxk4Fd */

export type SpaceInParensSchema0 = 'always' | 'never'

export interface SpaceInParensSchema1 {
  exceptions?: ('{}' | '[]' | '()' | 'empty')[]
}

export type SpaceInParensRuleOptions = [
  SpaceInParensSchema0?,
  SpaceInParensSchema1?,
]

export type RuleOptions = SpaceInParensRuleOptions
export type MessageIds =
  | 'missingOpeningSpace'
  | 'missingClosingSpace'
  | 'rejectedOpeningSpace'
  | 'rejectedClosingSpace'
