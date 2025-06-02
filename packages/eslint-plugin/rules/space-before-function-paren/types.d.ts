/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Kz_Mu_8GLtgwE6ZVqrwQZnwlqOZRD4NAWufYw9AJBDk */

export type SpaceBeforeFunctionParenSchema0 =
  | ('always' | 'never')
  | {
    anonymous?: 'always' | 'never' | 'ignore'
    named?: 'always' | 'never' | 'ignore'
    asyncArrow?: 'always' | 'never' | 'ignore'
  }

export type SpaceBeforeFunctionParenRuleOptions = [
  SpaceBeforeFunctionParenSchema0?,
]

export type RuleOptions =
  SpaceBeforeFunctionParenRuleOptions
export type MessageIds = 'unexpectedSpace' | 'missingSpace'
