/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: H52HrYMKnkZa-H0_Ga5TXF8p0l7A3PP0Ajlrml0MnGU */

export interface JsxSortPropsSchema0 {
  callbacksLast?: boolean
  shorthandFirst?: boolean
  shorthandLast?: boolean
  multiline?: 'ignore' | 'first' | 'last'
  ignoreCase?: boolean
  noSortAlphabetically?: boolean
  reservedFirst?: string[] | boolean
  reservedLast?: string[]
  locale?: string
}

export type JsxSortPropsRuleOptions = [JsxSortPropsSchema0?]

export type RuleOptions = JsxSortPropsRuleOptions
export type MessageIds
  = | 'listIsEmpty'
    | 'listReservedPropsFirst'
    | 'listReservedPropsLast'
    | 'listCallbacksLast'
    | 'listShorthandFirst'
    | 'listShorthandLast'
    | 'listMultilineFirst'
    | 'listMultilineLast'
    | 'sortPropsByAlpha'
