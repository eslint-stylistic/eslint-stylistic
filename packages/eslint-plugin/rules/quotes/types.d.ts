/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: vdXu8QR9sAUvHgs0GonbXOFXr5UkkhW7B3UejWFbL7E */

export type QuotesSchema0 = 'single' | 'double' | 'backtick'

export interface QuotesSchema1 {
  avoidEscape?: boolean
  allowTemplateLiterals?: 'never' | 'avoidEscape' | 'always'
  ignoreStringLiterals?: boolean
}

export type QuotesRuleOptions = [
  QuotesSchema0?,
  QuotesSchema1?,
]

export type RuleOptions = QuotesRuleOptions
export type MessageIds = 'wrongQuotes'
