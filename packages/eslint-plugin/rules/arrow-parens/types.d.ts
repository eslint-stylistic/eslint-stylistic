/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: PAv-IdLBmv_6OyUndzkaZnAKD3l_SSH4R8zgF9KLk2E */

export type ArrowParensSchema0 = 'always' | 'as-needed'

export interface ArrowParensSchema1 {
  requireForBlockBody?: boolean
}

export type ArrowParensRuleOptions = [
  ArrowParensSchema0?,
  ArrowParensSchema1?,
]

export type RuleOptions = ArrowParensRuleOptions
export type MessageIds
  = | 'unexpectedParens'
    | 'expectedParens'
    | 'unexpectedParensInline'
    | 'expectedParensBlock'
