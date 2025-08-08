/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Ljct-hulrsvuX4UytO9f1kiJqDjxvHOl8NT-QrrDLVk */

export type ObjectPropertyNewlineSchema0
  = | {
    allowAllPropertiesOnSameLine?: boolean
  }
  | {
    ObjectExpression?: {
      allowAllPropertiesOnSameLine?: boolean
    }
    ObjectPattern?: {
      allowAllPropertiesOnSameLine?: boolean
    }
    ImportDeclaration?: {
      allowAllPropertiesOnSameLine?: boolean
    }
    ExportNamedDeclaration?: {
      allowAllPropertiesOnSameLine?: boolean
    }
    TSTypeLiteral?: {
      allowAllPropertiesOnSameLine?: boolean
    }
    TSInterfaceBody?: {
      allowAllPropertiesOnSameLine?: boolean
    }
    TSEnumBody?: {
      allowAllPropertiesOnSameLine?: boolean
    }
  }

export type ObjectPropertyNewlineRuleOptions = [
  ObjectPropertyNewlineSchema0?,
]

export type RuleOptions = ObjectPropertyNewlineRuleOptions
export type MessageIds
  = | 'propertiesOnNewlineAll'
    | 'propertiesOnNewline'
