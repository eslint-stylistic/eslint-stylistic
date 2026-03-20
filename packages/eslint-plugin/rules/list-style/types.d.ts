/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: bO-QF1vmjhbG-SOI1py-wrNSdizWYw_vlRpd_N-bzaA */

export type OverrideConfig = BaseConfig | 'off'

export interface ListStyleSchema0 {
  singleLine?: SingleLineConfig
  multiLine?: MultiLineConfig
  overrides?: {
    '()'?: OverrideConfig
    '[]'?: OverrideConfig
    '{}'?: OverrideConfig
    '<>'?: OverrideConfig
    'ArrayExpression'?: OverrideConfig
    'ArrayPattern'?: OverrideConfig
    'ArrowFunctionExpression'?: OverrideConfig
    'CallExpression'?: OverrideConfig
    'ExportNamedDeclaration'?: OverrideConfig
    'FunctionDeclaration'?: OverrideConfig
    'FunctionExpression'?: OverrideConfig
    'IfStatement'?: OverrideConfig
    'ImportAttributes'?: OverrideConfig
    'ImportDeclaration'?: OverrideConfig
    'JSONArrayExpression'?: OverrideConfig
    'JSONObjectExpression'?: OverrideConfig
    'NewExpression'?: OverrideConfig
    'ObjectExpression'?: OverrideConfig
    'ObjectPattern'?: OverrideConfig
    'TSDeclareFunction'?: OverrideConfig
    'TSEnumBody'?: OverrideConfig
    'TSFunctionType'?: OverrideConfig
    'TSInterfaceBody'?: OverrideConfig
    'TSTupleType'?: OverrideConfig
    'TSTypeLiteral'?: OverrideConfig
    'TSTypeParameterDeclaration'?: OverrideConfig
    'TSTypeParameterInstantiation'?: OverrideConfig
  }
}
export interface SingleLineConfig {
  spacing?: 'always' | 'never'
  maxItems?: number
}
export interface MultiLineConfig {
  minItems?: number
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
