/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: -Pvtm4lT4o_8FqC-DaMyciYf85wRGE2Wg24cbWANcFU */

export type SpacedCommentSchema0 = 'always' | 'never'

export interface SpacedCommentSchema1 {
  exceptions?: string[]
  markers?: string[]
  line?: {
    exceptions?: string[]
    markers?: string[]
  }
  block?: {
    exceptions?: string[]
    markers?: string[]
    balanced?: boolean
  }
}

export type SpacedCommentRuleOptions = [
  SpacedCommentSchema0?,
  SpacedCommentSchema1?,
]

export type RuleOptions = SpacedCommentRuleOptions
export type MessageIds
  = | 'unexpectedSpaceAfterMarker'
    | 'expectedExceptionAfter'
    | 'unexpectedSpaceBefore'
    | 'unexpectedSpaceAfter'
    | 'expectedSpaceBefore'
    | 'expectedSpaceAfter'
