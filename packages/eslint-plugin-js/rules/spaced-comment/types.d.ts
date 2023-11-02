export type Schema0 = 'always' | 'never'

export interface Schema1 {
  exceptions?: string[]
  markers?: string[]
  line?: {
    exceptions?: string[]
    markers?: string[]
  }
  block?: {
    exceptions?: string[]
    markers?: string[]
    balanced?: boolean
  }
}

export type RuleOptions = [Schema0?, Schema1?]
