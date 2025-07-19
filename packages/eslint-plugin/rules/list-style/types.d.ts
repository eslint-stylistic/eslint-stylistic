/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: XQlDLbaXo5Nnkb0hamsJTneGGnAGi9m0IiTQmmcWM6k */

export type ListStyleSchema0 = BaseConfig & {
  overrides?: {
    ArrayExpression?: BaseConfig
    ArrayPattern?: BaseConfig
    ArrowFunctionExpression?: BaseConfig
    CallExpression?: BaseConfig
    ExportNamedDeclaration?: BaseConfig
    FunctionDeclaration?: BaseConfig
    FunctionExpression?: BaseConfig
    ImportDeclaration?: BaseConfig
    JSONArrayExpression?: BaseConfig
    JSONObjectExpression?: BaseConfig
    JSXOpeningElement?: BaseConfig
    NewExpression?: BaseConfig
    ObjectExpression?: BaseConfig
    ObjectPattern?: BaseConfig
    TSFunctionType?: BaseConfig
    TSInterfaceDeclaration?: BaseConfig
    TSTupleType?: BaseConfig
    TSTypeLiteral?: BaseConfig
    TSTypeParameterDeclaration?: BaseConfig
    TSTypeParameterInstantiation?: BaseConfig
  }
}

export interface BaseConfig {
  singleLine?: {
    spacing?: 'always' | 'never'
  }
  multiline?: {
    maxItemsPerLine?: number
    newlineAroundItems?: 'always' | 'never' | 'ignore'
  }
}

export type ListStyleRuleOptions = [ListStyleSchema0?]

export type RuleOptions = ListStyleRuleOptions
export type MessageIds = 'shouldWrap' | 'shouldNotWrap'
