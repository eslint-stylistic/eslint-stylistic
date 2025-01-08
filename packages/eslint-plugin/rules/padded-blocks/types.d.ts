/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ek9SNYoFAT */

export type PaddedBlocksSchema0 =
  | ('always' | 'never' | 'start' | 'end')
  | {
    blocks?: 'always' | 'never' | 'start' | 'end'
    switches?: 'always' | 'never' | 'start' | 'end'
    classes?: 'always' | 'never' | 'start' | 'end'
  }

export interface PaddedBlocksSchema1 {
  allowSingleLineBlocks?: boolean
}

export type PaddedBlocksRuleOptions = [
  PaddedBlocksSchema0?,
  PaddedBlocksSchema1?,
]

export type RuleOptions = PaddedBlocksRuleOptions
export type MessageIds = 'alwaysPadBlock' | 'neverPadBlock'
