/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: lIcu3uwAmu */

export interface ObjectPropertyNewlineSchema0 {
  allowAllPropertiesOnSameLine?: boolean
  allowMultiplePropertiesPerLine?: boolean
  ObjectExpression?:
    | boolean
    | {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
  ObjectPattern?:
    | boolean
    | {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
  ImportDeclaration?:
    | boolean
    | {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
  ExportDeclaration?:
    | boolean
    | {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
  TSTypeLiteral?:
    | boolean
    | {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
  TSInterfaceBody?:
    | boolean
    | {
      allowAllPropertiesOnSameLine?: boolean
      allowMultiplePropertiesPerLine?: boolean
    }
}

export type ObjectPropertyNewlineRuleOptions = [
  ObjectPropertyNewlineSchema0?,
]

export type RuleOptions = ObjectPropertyNewlineRuleOptions
export type MessageIds =
  | 'propertiesOnNewlineAll'
  | 'propertiesOnNewline'
