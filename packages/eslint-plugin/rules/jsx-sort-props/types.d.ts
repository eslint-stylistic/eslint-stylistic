/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ZW3ItToD0ZJv3v-zWRdiNe_O4mcY5C4tKJc7EdSbDy8 */

export interface JsxSortPropsSchema0 {
  callbacksLast?: boolean
  shorthandFirst?: boolean
  shorthandLast?: boolean
  multiline?: 'ignore' | 'first' | 'last'
  ignoreCase?: boolean
  noSortAlphabetically?: boolean
  reservedFirst?: unknown[] | boolean
  reservedLast?: unknown[]
  locale?: string
}

export type JsxSortPropsRuleOptions = [JsxSortPropsSchema0?]

export type RuleOptions = JsxSortPropsRuleOptions
export type MessageIds =
  | 'listIsEmpty'
  | 'listReservedPropsFirst'
  | 'listReservedPropsLast'
  | 'listCallbacksLast'
  | 'listShorthandFirst'
  | 'listShorthandLast'
  | 'listMultilineFirst'
  | 'listMultilineLast'
  | 'sortPropsByAlpha'
