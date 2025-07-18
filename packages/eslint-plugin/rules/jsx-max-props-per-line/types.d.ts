/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Cw90UTKsHhPLRv0dTeRqkUFq1z8xJdtpn3CUONfizj4 */

export type JsxMaxPropsPerLineSchema0
  = | {
    maximum?: {
      single?: number
      multi?: number
    }
  }
  | {
    maximum?: number
    when?: 'always' | 'multiline'
  }

export type JsxMaxPropsPerLineRuleOptions = [
  JsxMaxPropsPerLineSchema0?,
]

export type RuleOptions = JsxMaxPropsPerLineRuleOptions
export type MessageIds = 'newLine'
