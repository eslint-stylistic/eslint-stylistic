/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: a3Apxbvd1M */

export type ArrayElementNewlineSchema0
  = | []
    | [
      | BasicConfig
      | {
        ArrayExpression?: BasicConfig
        ArrayPattern?: BasicConfig
      },
    ]
export type BasicConfig
  = | ('always' | 'never' | 'consistent')
    | {
      consistent?: boolean
      multiline?: boolean
      minItems?: number | null
    }

export type ArrayElementNewlineRuleOptions
  = ArrayElementNewlineSchema0

export type RuleOptions = ArrayElementNewlineRuleOptions
export type MessageIds
  = | 'unexpectedLineBreak'
    | 'missingLineBreak'
