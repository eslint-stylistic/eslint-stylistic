/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: oxE8d3vcKIQcZqytpovp6BQx1R71-HhvNJSlCtS8vTs */

export interface ListStyleSchema0 {
  singleLine?: SingleLineConfig
  multiLine?: MultiLineConfig
  overrides?: {
    ArrayExpression?: BaseConfig
    ArrayPattern?: BaseConfig
    ArrowFunctionExpression?: BaseConfig
    CallExpression?: BaseConfig
    ExportNamedDeclaration?: BaseConfig
    FunctionDeclaration?: BaseConfig
    FunctionExpression?: BaseConfig
    ImportDeclaration?: BaseConfig
    NewExpression?: BaseConfig
    ObjectExpression?: BaseConfig
    ObjectPattern?: BaseConfig
    TSFunctionType?: BaseConfig
    TSInterfaceBody?: BaseConfig
    TSTupleType?: BaseConfig
    TSTypeLiteral?: BaseConfig
    TSTypeParameterDeclaration?: BaseConfig
    TSTypeParameterInstantiation?: BaseConfig
    JSONArrayExpression?: BaseConfig
    JSONObjectExpression?: BaseConfig
  }
}
export interface SingleLineConfig {
  spacing?: 'always' | 'never'
  maxItems?: number
}
export interface MultiLineConfig {
  maxItemsPerLine?: number
}
export interface BaseConfig {
  singleLine?: SingleLineConfig
  multiline?: MultiLineConfig
}

export type ListStyleRuleOptions = [ListStyleSchema0?]

export type RuleOptions = ListStyleRuleOptions
export type MessageIds
  = | 'shouldSpacing'
    | 'shouldNotSpacing'
    | 'shouldWrap'
    | 'shouldNotWrap'
