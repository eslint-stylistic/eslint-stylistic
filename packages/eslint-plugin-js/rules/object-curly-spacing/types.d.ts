export type Schema0 = 'always' | 'never'

export interface Schema1 {
  arraysInObjects?: boolean
  objectsInObjects?: boolean
}

export type RuleOptions = [Schema0?, Schema1?]
