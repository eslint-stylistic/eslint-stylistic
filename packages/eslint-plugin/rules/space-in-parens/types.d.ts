/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ihThufpOcY */

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
