/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: jPsrtHVJ4RiAF93cyuqRvj4gKXayanSaW7LVYdf3a_c */

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
    | 'requiredSpaceInEmptyObject'
    | 'unexpectedSpaceInEmptyObject'
