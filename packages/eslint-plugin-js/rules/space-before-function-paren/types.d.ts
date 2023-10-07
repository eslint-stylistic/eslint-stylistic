export type Schema0 =
  | ('always' | 'never')
  | {
    anonymous?: 'always' | 'never' | 'ignore'
    named?: 'always' | 'never' | 'ignore'
    asyncArrow?: 'always' | 'never' | 'ignore'
  }

export type RuleOptions = [Schema0?]
