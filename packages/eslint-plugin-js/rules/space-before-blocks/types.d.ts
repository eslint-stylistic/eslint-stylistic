/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: D8CgcAFpx8 */

export type SpaceBeforeBlocksSchema0 =
  | ('always' | 'never')
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
