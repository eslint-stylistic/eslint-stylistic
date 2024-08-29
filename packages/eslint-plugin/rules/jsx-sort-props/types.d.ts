/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: PK3sqWq6MM */

export interface JsxSortPropsSchema0 {
  callbacksLast?: boolean
  shorthandFirst?: boolean
  shorthandLast?: boolean
  multiline?: 'ignore' | 'first' | 'last'
  ignoreCase?: boolean
  noSortAlphabetically?: boolean
  reservedFirst?: unknown[] | boolean
  locale?: string
}

export type JsxSortPropsRuleOptions = [JsxSortPropsSchema0?]

export type RuleOptions = JsxSortPropsRuleOptions
export type MessageIds =
  | 'noUnreservedProps'
  | 'listIsEmpty'
  | 'listReservedPropsFirst'
  | 'listCallbacksLast'
  | 'listShorthandFirst'
  | 'listShorthandLast'
  | 'listMultilineFirst'
  | 'listMultilineLast'
  | 'sortPropsByAlpha'
