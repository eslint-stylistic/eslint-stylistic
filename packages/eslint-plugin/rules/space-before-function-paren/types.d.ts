/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: nZ3S6j3EOJ */

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
export type MessageIds = 'unexpected' | 'missing'
