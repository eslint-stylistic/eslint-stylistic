/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: -JLonaHr69Q7HNRoq1pL5bnrWnsGRymOTM-AEuqK-zU */

export type SpaceInParensSchema0 = 'always' | 'never'

export interface SpaceInParensSchema1 {
  exceptions?: ('{}' | '[]' | '()' | 'empty')[]
}

export type SpaceInParensRuleOptions = [
  SpaceInParensSchema0?,
  SpaceInParensSchema1?,
]

export type RuleOptions = SpaceInParensRuleOptions
export type MessageIds
  = | 'missingOpeningSpace'
    | 'missingClosingSpace'
    | 'rejectedOpeningSpace'
    | 'rejectedClosingSpace'
