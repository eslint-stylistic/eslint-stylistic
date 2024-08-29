/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 56oi0WUycI */

export type JsxIndentPropsSchema0 =
  | ('tab' | 'first')
  | number
  | {
    indentMode?: ('tab' | 'first') | number
    ignoreTernaryOperator?: boolean
    [k: string]: unknown
  }

export type JsxIndentPropsRuleOptions = [
  JsxIndentPropsSchema0?,
]

export type RuleOptions = JsxIndentPropsRuleOptions
export type MessageIds = 'wrongIndent'
