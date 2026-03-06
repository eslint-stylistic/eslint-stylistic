/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: q18gd76IOtFhHKusjntrCcW9JmXUpnTf6iG_8H_ytJ4 */

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
