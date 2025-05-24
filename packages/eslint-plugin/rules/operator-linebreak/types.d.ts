/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: bvbRmH_q4r4TwHYQKuuH7KdPdHlTaAIJBPnPwrfvKsM */

export type OperatorLinebreakSchema0 =
  | ('after' | 'before' | 'none')
  | null

export interface OperatorLinebreakSchema1 {
  overrides?: {
    [k: string]: 'after' | 'before' | 'none' | 'ignore'
  }
}

export type OperatorLinebreakRuleOptions = [
  OperatorLinebreakSchema0?,
  OperatorLinebreakSchema1?,
]

export type RuleOptions = OperatorLinebreakRuleOptions
export type MessageIds =
  | 'operatorAtBeginning'
  | 'operatorAtEnd'
  | 'badLinebreak'
  | 'noLinebreak'
