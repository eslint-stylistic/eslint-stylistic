/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: KK43Wa3Yym */

export type Schema0 = 'always' | 'never'

export interface Schema1 {
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

export type RuleOptions = [Schema0?, Schema1?]
export type MessageIds =
  | 'unexpectedSpaceAfterMarker'
  | 'expectedExceptionAfter'
  | 'unexpectedSpaceBefore'
  | 'unexpectedSpaceAfter'
  | 'expectedSpaceBefore'
  | 'expectedSpaceAfter'
