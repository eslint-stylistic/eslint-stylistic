/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 4GFgaFKvmu */

export type QuotesSchema0 = 'single' | 'double' | 'backtick'

export type QuotesSchema1
  = | 'avoid-escape'
    | {
      avoidEscape?: boolean
      allowTemplateLiterals?:
        | boolean
        | ('never' | 'avoidEscape' | 'always')
      ignoreStringLiterals?: boolean
    }

export type QuotesRuleOptions = [
  QuotesSchema0?,
  QuotesSchema1?,
]

export type RuleOptions = QuotesRuleOptions
export type MessageIds = 'wrongQuotes'
