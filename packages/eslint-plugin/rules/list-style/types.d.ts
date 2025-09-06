/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: fqd32SNtefJeTKo42g-h1FYC_BhsHQbebzYF8KmCncM */

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
    'JSXOpeningElement'?: BaseConfig
    'TSDeclareFunction'?: BaseConfig
    'TSFunctionType'?: BaseConfig
    'TSInterfaceBody'?: BaseConfig
    'TSEnumBody'?: BaseConfig
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
