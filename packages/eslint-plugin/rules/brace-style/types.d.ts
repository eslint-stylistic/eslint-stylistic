/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: x-zK6lKOyxz2s9YQ6AWlku2z-BN7szEb1dTLyY20Z1Y */

export type BraceStyleSchema0 =
  | '1tbs'
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
export type MessageIds =
  | 'nextLineOpen'
  | 'sameLineOpen'
  | 'blockSameLine'
  | 'nextLineClose'
  | 'singleLineClose'
  | 'sameLineClose'
