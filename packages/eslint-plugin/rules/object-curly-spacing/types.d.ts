/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Y440omRAoT_hTc998a8ksqbYtCJJ2HZHtYPp6S_u-ns */

export type ObjectCurlySpacingSchema0 = 'always' | 'never'

export interface ObjectCurlySpacingSchema1 {
  arraysInObjects?: boolean
  objectsInObjects?: boolean
  overrides?: {
    ObjectPattern?: 'always' | 'never'
    ObjectExpression?: 'always' | 'never'
    ImportDeclaration?: 'always' | 'never'
    ImportAttributes?: 'always' | 'never'
    ExportNamedDeclaration?: 'always' | 'never'
    ExportAllDeclaration?: 'always' | 'never'
    TSMappedType?: 'always' | 'never'
    TSTypeLiteral?: 'always' | 'never'
    TSInterfaceBody?: 'always' | 'never'
    TSEnumBody?: 'always' | 'never'
  }
  emptyObject?: 'ignore' | 'always' | 'never'
}

export type ObjectCurlySpacingRuleOptions = [
  ObjectCurlySpacingSchema0?,
  ObjectCurlySpacingSchema1?,
]

export type RuleOptions = ObjectCurlySpacingRuleOptions
export type MessageIds
  = | 'requireSpaceBefore'
    | 'requireSpaceAfter'
    | 'unexpectedSpaceBefore'
    | 'unexpectedSpaceAfter'
    | 'requiredSpaceInEmpty'
    | 'unexpectedSpaceInEmpty'
