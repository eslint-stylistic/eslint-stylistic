/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ojiYA3LzNb */

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
