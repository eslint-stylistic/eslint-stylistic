/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 7oGE0AXRrEseAUOiN9MveDr6vQZJ2NqAt9vSP5zNDXc */

export type BraceStyleSchema0
  = | '1tbs'
    | 'stroustrup'
    | 'allman'

export interface BraceStyleSchema1 {
  allowSingleLine?: boolean
}

export type BraceStyleRuleOptions = [
  BraceStyleSchema0?,
  BraceStyleSchema1?,
]

export type RuleOptions = BraceStyleRuleOptions
export type MessageIds
  = | 'nextLineOpen'
    | 'sameLineOpen'
    | 'blockSameLine'
    | 'nextLineClose'
    | 'singleLineClose'
    | 'sameLineClose'
