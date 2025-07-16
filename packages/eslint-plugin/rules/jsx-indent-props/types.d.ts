/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 30G_ZrWyAGlBb_DWlLb43wDD7IXoSKVHzxArM3d3ta0 */

export type JsxIndentPropsSchema0
  = | ('tab' | 'first')
    | number
    | {
      indentMode?: ('tab' | 'first') | number
      ignoreTernaryOperator?: boolean
    }

export type JsxIndentPropsRuleOptions = [
  JsxIndentPropsSchema0?,
]

export type RuleOptions = JsxIndentPropsRuleOptions
export type MessageIds = 'wrongIndent'
