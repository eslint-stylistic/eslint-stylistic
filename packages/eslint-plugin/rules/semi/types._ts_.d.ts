/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 1iSi2ed3kn */

export type Schema0 =
  | []
  | ['never']
  | [
    'never',
    {
      beforeStatementContinuationChars?:
        | 'always'
        | 'any'
        | 'never'
    },
  ]
  | []
  | ['always']
  | [
    'always',
    {
      omitLastInOneLineBlock?: boolean
      omitLastInOneLineClassBody?: boolean
    },
  ]

export type RuleOptions = Schema0
export type MessageIds = 'missingSemi' | 'extraSemi'
