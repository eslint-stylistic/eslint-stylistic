/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 2aF2IyYlLeaM-gia8_TepQOa7HIRDgf4HqfMNjtkK00 */

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
  spaceInEmptyObject?: 'ignore' | 'always' | 'never'
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
    | 'unexpectedSpaceInEmpty'
