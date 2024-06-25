/* GENERATED, DO NOT EDIT DIRECTLY */

export type Schema0 =
  | []
  | [
    | BasicConfig
    | {
      ArrayExpression?: BasicConfig
      ArrayPattern?: BasicConfig
    },
  ]
export type BasicConfig =
  | ('always' | 'never' | 'consistent')
  | {
    consistent?: boolean
    multiline?: boolean
    minItems?: number | null
  }

export type RuleOptions = Schema0
export type MessageIds = 'unexpectedLineBreak' | 'missingLineBreak'
