/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: QbwTyt45fP */

export type WrapIifeSchema0 = 'outside' | 'inside' | 'any'

export interface WrapIifeSchema1 {
  functionPrototypeMethods?: boolean
}

export type WrapIifeRuleOptions = [
  WrapIifeSchema0?,
  WrapIifeSchema1?,
]

export type RuleOptions = WrapIifeRuleOptions
export type MessageIds =
  | 'wrapInvocation'
  | 'wrapExpression'
  | 'moveInvocation'
