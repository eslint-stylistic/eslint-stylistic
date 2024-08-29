/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: KMZZ6W4dxI */

export type ObjectCurlySpacingSchema0 = 'always' | 'never'

export interface ObjectCurlySpacingSchema1 {
  arraysInObjects?: boolean
  objectsInObjects?: boolean
}

export type ObjectCurlySpacingRuleOptions = [
  ObjectCurlySpacingSchema0?,
  ObjectCurlySpacingSchema1?,
]

export type RuleOptions = ObjectCurlySpacingRuleOptions
export type MessageIds =
  | 'requireSpaceBefore'
  | 'requireSpaceAfter'
  | 'unexpectedSpaceBefore'
  | 'unexpectedSpaceAfter'
