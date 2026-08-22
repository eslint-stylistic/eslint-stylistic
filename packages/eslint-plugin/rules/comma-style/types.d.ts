/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 4CFLF0dsXq9vfuMeaQuh3qs5GouBJzx0P8lcAFNtnDM */

export type CommaStyleSchema0 = 'first' | 'last'

export interface CommaStyleSchema1 {
  exceptions?: {
    [k: string]: boolean
  }
}

export type CommaStyleRuleOptions = [
  CommaStyleSchema0?,
  CommaStyleSchema1?,
]

export type RuleOptions = CommaStyleRuleOptions
export type MessageIds =
  | 'unexpectedLineBeforeAndAfterComma'
  | 'expectedCommaFirst'
  | 'expectedCommaLast'
