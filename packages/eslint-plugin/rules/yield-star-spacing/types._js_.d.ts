/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ScmkFfviIj */

export type Schema0 =
  | ('before' | 'after' | 'both' | 'neither')
  | {
    before?: boolean
    after?: boolean
  }

export type RuleOptions = [Schema0?]
export type MessageIds =
  | 'missingBefore'
  | 'missingAfter'
  | 'unexpectedBefore'
  | 'unexpectedAfter'
