export type Schema0 =
  | []
  | ['never']
  | [
    'never',
    {
      beforeStatementContinuationChars?: 'always' | 'any' | 'never'
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
