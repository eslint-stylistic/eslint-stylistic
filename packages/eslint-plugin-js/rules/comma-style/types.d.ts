/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 2ogaavov5p */

export type Schema0 = 'first' | 'last'

export interface Schema1 {
  exceptions?: {
    [k: string]: boolean
  }
}

export type RuleOptions = [Schema0?, Schema1?]
export type MessageIds =
  | 'unexpectedLineBeforeAndAfterComma'
  | 'expectedCommaFirst'
  | 'expectedCommaLast'
