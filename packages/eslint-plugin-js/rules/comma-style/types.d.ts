/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 2ogaavov5p */

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
