/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: kx7iqirNdw */

export interface ObjectPropertyNewlineSchema0 {
  allowAllPropertiesOnSameLine?: boolean
  allowMultiplePropertiesPerLine?: boolean
  overrides?: {
    ObjectExpression?: {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
    ObjectPattern?: {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
    ImportDeclaration?: {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
    ExportNamedDeclaration?: {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
    TSTypeLiteral?: {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
    TSInterfaceBody?: {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
  }
}

export type ObjectPropertyNewlineRuleOptions = [
  ObjectPropertyNewlineSchema0?,
]

export type RuleOptions = ObjectPropertyNewlineRuleOptions
export type MessageIds =
  | 'propertiesOnNewlineAll'
  | 'propertiesOnNewline'
