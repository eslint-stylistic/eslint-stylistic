export type Schema0 =
  | ('always' | 'never')
  | {
    keywords?: 'always' | 'never' | 'off'
    functions?: 'always' | 'never' | 'off'
    classes?: 'always' | 'never' | 'off'
  }

export type RuleOptions = [Schema0?]
