/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: NRwu6f45q0mvETFVxCp0jlO4Eyna2iAHWR94yGw8I6A */

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
