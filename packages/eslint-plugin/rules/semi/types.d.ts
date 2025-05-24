/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Xqp7M5FZy9k-iDnbExvuvaMe9_lIwgK5sx-hNcf3Tdk */

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
