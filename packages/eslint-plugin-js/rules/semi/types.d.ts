/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: yQXNaIALeG */

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
