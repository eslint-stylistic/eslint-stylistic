/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 8d4o7nbOzv */

export type NonblockStatementBodyPositionSchema0 =
  | 'beside'
  | 'below'
  | 'any'

export interface NonblockStatementBodyPositionSchema1 {
  overrides?: {
    if?: 'beside' | 'below' | 'any'
    else?: 'beside' | 'below' | 'any'
    while?: 'beside' | 'below' | 'any'
    do?: 'beside' | 'below' | 'any'
    for?: 'beside' | 'below' | 'any'
  }
}

export type NonblockStatementBodyPositionRuleOptions = [
  NonblockStatementBodyPositionSchema0?,
  NonblockStatementBodyPositionSchema1?,
]

export type RuleOptions =
  NonblockStatementBodyPositionRuleOptions
export type MessageIds =
  | 'expectNoLinebreak'
  | 'expectLinebreak'
