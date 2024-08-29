/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: MYex0HnCTR */

export type PaddedBlocksSchema0 =
  | ('always' | 'never')
  | {
    blocks?: 'always' | 'never'
    switches?: 'always' | 'never'
    classes?: 'always' | 'never'
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
