export type Schema0 = 'first' | 'last'

export interface Schema1 {
  exceptions?: {
    [k: string]: boolean
  }
}

export type RuleOptions = [Schema0?, Schema1?]
