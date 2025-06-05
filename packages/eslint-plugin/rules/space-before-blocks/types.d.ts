/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 9-og7wevREqpE2djWnS3iTi1w8IXRsAqrojNvFfOVwA */

export type SpaceBeforeBlocksSchema0
  = | ('always' | 'never')
    | {
      keywords?: 'always' | 'never' | 'off'
      functions?: 'always' | 'never' | 'off'
      classes?: 'always' | 'never' | 'off'
    }

export type SpaceBeforeBlocksRuleOptions = [
  SpaceBeforeBlocksSchema0?,
]

export type RuleOptions = SpaceBeforeBlocksRuleOptions
export type MessageIds = 'unexpectedSpace' | 'missingSpace'
