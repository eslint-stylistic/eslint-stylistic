/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: teuhd7zPnvsuNFIpLyqgrrk2XjblDEHSTa-PdeSNwvw */

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
    JSONArrayExpression?: BaseConfig
    JSONObjectExpression?: BaseConfig
  }
}

export interface BaseConfig {
  singleLine?: {
    spacing?: 'always' | 'never'
    maxItems?: number
  }
  multiline?: {
    maxItemsPerLine?: number
  }
}

export type ListStyleRuleOptions = [ListStyleSchema0?]

export type RuleOptions = ListStyleRuleOptions
export type MessageIds = 'shouldWrap' | 'shouldNotWrap'
