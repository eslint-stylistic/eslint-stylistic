/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: B9Xuzw8xZiK_fneqs8jInWdZlTCYrLuG3DJ0naQrxnY */

export type MultilineTernarySchema0
  = | 'always'
    | 'always-multiline'
    | 'never'

export interface MultilineTernarySchema1 {
  ignoreJSX?: boolean
}

export type MultilineTernaryRuleOptions = [
  MultilineTernarySchema0?,
  MultilineTernarySchema1?,
]

export type RuleOptions = MultilineTernaryRuleOptions
export type MessageIds
  = | 'expectedTestCons'
    | 'expectedConsAlt'
    | 'unexpectedTestCons'
    | 'unexpectedConsAlt'
