/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: C3lAcMtqyx */

export type Schema0 = 'always' | 'as-needed'

export interface Schema1 {
  requireForBlockBody?: boolean
}

export type RuleOptions = [Schema0?, Schema1?]
export type MessageIds =
  | 'unexpectedParens'
  | 'expectedParens'
  | 'unexpectedParensInline'
  | 'expectedParensBlock'
