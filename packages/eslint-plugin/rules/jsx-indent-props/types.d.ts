/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: yoq47ZFhtyO96ComOIYTmw3_4sqKrrg0Nv2kSf7dBYo */

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
