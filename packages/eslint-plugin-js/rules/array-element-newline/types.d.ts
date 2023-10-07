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
    multiline?: boolean
    minItems?: number | null
  }

export type RuleOptions = [Schema0?]
