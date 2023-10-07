export type Schema0 =
  | ('before' | 'after' | 'both' | 'neither')
  | {
    before?: boolean
    after?: boolean
    named?:
    | ('before' | 'after' | 'both' | 'neither')
    | {
      before?: boolean
      after?: boolean
    }
    anonymous?:
    | ('before' | 'after' | 'both' | 'neither')
    | {
      before?: boolean
      after?: boolean
    }
    method?:
    | ('before' | 'after' | 'both' | 'neither')
    | {
      before?: boolean
      after?: boolean
    }
  }

export type RuleOptions = [Schema0?]
