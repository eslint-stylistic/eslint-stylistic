/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Ec8oGhWpV0YOm4BlrLIQjLs9XUur2gJeX8j4Xt86TgA */

export type WrapIifeSchema0 = 'outside' | 'inside' | 'any'

export interface WrapIifeSchema1 {
  functionPrototypeMethods?: boolean
}

export type WrapIifeRuleOptions = [
  WrapIifeSchema0?,
  WrapIifeSchema1?,
]

export type RuleOptions = WrapIifeRuleOptions
export type MessageIds
  = | 'wrapInvocation'
    | 'wrapExpression'
    | 'moveInvocation'
