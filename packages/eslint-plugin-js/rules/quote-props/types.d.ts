export type Schema0 =
  | []
  | ['always' | 'as-needed' | 'consistent' | 'consistent-as-needed']
  | []
  | ['always' | 'as-needed' | 'consistent' | 'consistent-as-needed']
  | [
    'always' | 'as-needed' | 'consistent' | 'consistent-as-needed',
    {
      keywords?: boolean
      unnecessary?: boolean
      numbers?: boolean
    },
  ]

export type RuleOptions = [Schema0?]
