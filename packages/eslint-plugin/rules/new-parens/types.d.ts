/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: dEaj2u84WS84sVjxCNK3dc-5HwjPCcpg34jm8RxoFgI */

export type NewParensSchema0 = 'always' | 'never'

export interface NewParensSchema1 {
  overrides?: {
    anonymousClasses?: 'always' | 'never' | 'ignore'
    [k: string]: unknown
  }
  [k: string]: unknown
}

export type NewParensRuleOptions = [
  NewParensSchema0?,
  NewParensSchema1?,
]

export type RuleOptions = NewParensRuleOptions
export type MessageIds = 'missing' | 'unnecessary'
