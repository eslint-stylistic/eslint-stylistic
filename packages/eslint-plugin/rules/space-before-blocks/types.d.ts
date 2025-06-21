/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: vgKegXG7Tz8uy9X7d2nMDpr7BE2nvbDtnblr57VbLHM */

export type SpaceBeforeBlocksSchema0
  = | ('always' | 'never')
    | {
      keywords?: 'always' | 'never' | 'off'
      functions?: 'always' | 'never' | 'off'
      classes?: 'always' | 'never' | 'off'
      modules?: 'always' | 'never' | 'off'
    }

export type SpaceBeforeBlocksRuleOptions = [
  SpaceBeforeBlocksSchema0?,
]

export type RuleOptions = SpaceBeforeBlocksRuleOptions
export type MessageIds = 'unexpectedSpace' | 'missingSpace'
