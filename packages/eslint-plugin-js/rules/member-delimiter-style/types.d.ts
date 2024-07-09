/* GENERATED, DO NOT EDIT DIRECTLY */

export type MultiLineOption = 'none' | 'semi' | 'comma'
export type SingleLineOption = 'semi' | 'comma'

export interface Schema0 {
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

export type RuleOptions = [Schema0?]
export type MessageIds = 'unexpectedComma' | 'unexpectedSemi' | 'expectedComma' | 'expectedSemi'
