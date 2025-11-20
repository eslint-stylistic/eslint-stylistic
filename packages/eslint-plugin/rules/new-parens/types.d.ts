/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: kbvS3s9Ld_9JoK31sRYrk7PrC9OYhlpsMoPb77PL_7E */

export type NewParensSchema0 = 'always' | 'never'

export interface NewParensSchema1 {
  anonymousClasses?: 'always' | 'never' | 'ignore'
  [k: string]: unknown
}

export type NewParensRuleOptions = [
  NewParensSchema0?,
  NewParensSchema1?,
]

export type RuleOptions = NewParensRuleOptions
export type MessageIds = 'missing' | 'unnecessary'
