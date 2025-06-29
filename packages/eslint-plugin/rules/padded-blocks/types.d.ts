/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: n1q7YQfXXe12t0rJq9bnV-lkC_FFdzUsX57Au1Vqf8s */

export type PaddedBlocksSchema0
  = | ('always' | 'never' | 'start' | 'end')
    | {
      blocks?: 'always' | 'never' | 'start' | 'end'
      switches?: 'always' | 'never' | 'start' | 'end'
      classes?: 'always' | 'never' | 'start' | 'end'
      types?: 'always' | 'never' | 'start' | 'end'
      enums?: 'always' | 'never' | 'start' | 'end'
      interfaces?: 'always' | 'never' | 'start' | 'end'
      modules?: 'always' | 'never' | 'start' | 'end'
    }

export interface PaddedBlocksSchema1 {
  allowSingleLineBlocks?: boolean
}

export type PaddedBlocksRuleOptions = [
  PaddedBlocksSchema0?,
  PaddedBlocksSchema1?,
]

export type RuleOptions = PaddedBlocksRuleOptions
export type MessageIds = 'missingPadBlock' | 'extraPadBlock'
