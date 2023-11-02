export type Schema0 = 'always' | 'never'

export interface Schema1 {
  exceptions?: ('{}' | '[]' | '()' | 'empty')[]
}

export type RuleOptions = [Schema0?, Schema1?]
