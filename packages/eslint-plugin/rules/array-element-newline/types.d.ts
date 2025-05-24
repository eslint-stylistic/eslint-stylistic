/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 1kqicJNR6UJ01t-i0W7IpZH0Y6o2mmVBx21O6mt87R4 */

export type ArrayElementNewlineSchema0 =
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

export type ArrayElementNewlineRuleOptions =
  ArrayElementNewlineSchema0

export type RuleOptions = ArrayElementNewlineRuleOptions
export type MessageIds =
  | 'unexpectedLineBreak'
  | 'missingLineBreak'
