export type Schema0 =
  | {
    props?: 'always' | 'never' | 'ignore'
    children?: 'always' | 'never' | 'ignore'
    propElementValues?: 'always' | 'never' | 'ignore'
  }
  | ('always' | 'never' | 'ignore')

export type RuleOptions = [Schema0?]
