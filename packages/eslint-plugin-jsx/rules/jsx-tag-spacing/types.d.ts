export interface Schema0 {
  closingSlash?: 'always' | 'never' | 'allow'
  beforeSelfClosing?: 'always' | 'proportional-always' | 'never' | 'allow'
  afterOpening?: 'always' | 'allow-multiline' | 'never' | 'allow'
  beforeClosing?: 'always' | 'proportional-always' | 'never' | 'allow'
}

export type RuleOptions = [Schema0?]
