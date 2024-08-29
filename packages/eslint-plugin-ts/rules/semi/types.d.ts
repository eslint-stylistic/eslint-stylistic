/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 1iSi2ed3kn */

export type SemiSchema0 =
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

export type SemiRuleOptions = SemiSchema0

export type RuleOptions = SemiRuleOptions
export type MessageIds = 'missingSemi' | 'extraSemi'
