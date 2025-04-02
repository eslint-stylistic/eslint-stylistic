/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: jyxtBrwEIt */

export type BlockSpacingSchema0 = 'always' | 'never'

export interface BlockSpacingSchema1 {
  ignoredNodes?: (
    | 'BlockStatement'
    | 'StaticBlock'
    | 'SwitchStatement'
    | 'TSTypeLiteral'
    | 'TSInterfaceBody'
    | 'TSEnumDeclaration'
  )[]
}

export type BlockSpacingRuleOptions = [
  BlockSpacingSchema0?,
  BlockSpacingSchema1?,
]

export type RuleOptions = BlockSpacingRuleOptions
export type MessageIds = 'missing' | 'extra'
