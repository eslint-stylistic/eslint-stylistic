/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: NydfzVm1GbTYEniPm4xodwC7QinDGKC_Yyc3J6S8OR0 */

export interface JsxSortPropsSchema0 {
  callbacksLast?: boolean
  shorthandFirst?: boolean
  shorthandLast?: boolean
  multiline?: 'ignore' | 'first' | 'last'
  ignoreCase?: boolean
  noSortAlphabetically?: boolean
  reservedFirst?: string[] | boolean
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
