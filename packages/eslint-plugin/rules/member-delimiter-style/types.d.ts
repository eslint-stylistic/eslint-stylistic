/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 5paylpW46ErYHxINMGLIUmLyuu702qsArRo4yIDM0Rs */

export type MultiLineOption = 'none' | 'semi' | 'comma'
export type SingleLineOption = 'semi' | 'comma'

export interface MemberDelimiterStyleSchema0 {
  multiline?: {
    delimiter?: MultiLineOption
    requireLast?: boolean
  }
  singleline?: {
    delimiter?: SingleLineOption
    requireLast?: boolean
  }
  overrides?: {
    interface?: DelimiterConfig
    typeLiteral?: DelimiterConfig
  }
  multilineDetection?: 'brackets' | 'last-member'
}
export interface DelimiterConfig {
  multiline?: {
    delimiter?: MultiLineOption
    requireLast?: boolean
  }
  singleline?: {
    delimiter?: SingleLineOption
    requireLast?: boolean
  }
}

export type MemberDelimiterStyleRuleOptions = [
  MemberDelimiterStyleSchema0?,
]

export type RuleOptions = MemberDelimiterStyleRuleOptions
export type MessageIds
  = | 'unexpectedComma'
    | 'unexpectedSemi'
    | 'expectedComma'
    | 'expectedSemi'
