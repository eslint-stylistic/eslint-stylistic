/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 0U4YHoVvViWGEYWvmTEI_L6qJG3q-anjWiqbEm540Us */

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
