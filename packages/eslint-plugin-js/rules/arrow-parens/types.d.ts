/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: C3lAcMtqyx */

export type ArrowParensSchema0 = 'always' | 'as-needed'

export interface ArrowParensSchema1 {
  requireForBlockBody?: boolean
}

export type ArrowParensRuleOptions = [
  ArrowParensSchema0?,
  ArrowParensSchema1?,
]

export type RuleOptions = ArrowParensRuleOptions
export type MessageIds =
  | 'unexpectedParens'
  | 'expectedParens'
  | 'unexpectedParensInline'
  | 'expectedParensBlock'
