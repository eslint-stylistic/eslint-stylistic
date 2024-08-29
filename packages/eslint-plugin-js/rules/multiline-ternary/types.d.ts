/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: WCD7piHMmw */

export type MultilineTernarySchema0 =
  | 'always'
  | 'always-multiline'
  | 'never'

export interface MultilineTernarySchema1 {
  ignoreJSX?: boolean
  [k: string]: unknown
}

export type MultilineTernaryRuleOptions = [
  MultilineTernarySchema0?,
  MultilineTernarySchema1?,
]

export type RuleOptions = MultilineTernaryRuleOptions
export type MessageIds =
  | 'expectedTestCons'
  | 'expectedConsAlt'
  | 'unexpectedTestCons'
  | 'unexpectedConsAlt'
