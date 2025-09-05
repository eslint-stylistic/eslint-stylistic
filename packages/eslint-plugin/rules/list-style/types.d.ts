/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 3lTXl2JHFX2gdyPJpBDCCyBJP9O0Vvg1z2iOPF6WtDA */

export interface ListStyleSchema0 {
  singleLine?: SingleLineConfig
  multiLine?: MultiLineConfig
  overrides?: {
    '[]'?: BaseConfig
    '{}'?: BaseConfig
    '<>'?: BaseConfig
    '()'?: BaseConfig
    'ArrayExpression'?: BaseConfig
    'ArrayPattern'?: BaseConfig
    'ArrowFunctionExpression'?: BaseConfig
    'CallExpression'?: BaseConfig
    'ExportNamedDeclaration'?: BaseConfig
    'FunctionDeclaration'?: BaseConfig
    'FunctionExpression'?: BaseConfig
    'ImportDeclaration'?: BaseConfig
    'ImportAttributes'?: BaseConfig
    'NewExpression'?: BaseConfig
    'ObjectExpression'?: BaseConfig
    'ObjectPattern'?: BaseConfig
    'TSFunctionType'?: BaseConfig
    'TSInterfaceBody'?: BaseConfig
    'TSTupleType'?: BaseConfig
    'TSTypeLiteral'?: BaseConfig
    'TSTypeParameterDeclaration'?: BaseConfig
    'TSTypeParameterInstantiation'?: BaseConfig
    'JSONArrayExpression'?: BaseConfig
    'JSONObjectExpression'?: BaseConfig
  }
}
export interface SingleLineConfig {
  spacing?: 'always' | 'never'
  maxItems?: number
}
export interface MultiLineConfig {}
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
