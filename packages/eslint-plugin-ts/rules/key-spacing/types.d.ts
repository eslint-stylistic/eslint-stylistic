/* GENERATED, DO NOT EDIT DIRECTLY */

export type Schema0 =
  | {
    align?:
        | ('colon' | 'value')
        | {
          mode?: 'strict' | 'minimum'
          on?: 'colon' | 'value'
          beforeColon?: boolean
          afterColon?: boolean
        }
    mode?: 'strict' | 'minimum'
    beforeColon?: boolean
    afterColon?: boolean
  }
  | {
    singleLine?: {
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
    multiLine?: {
      align?:
          | ('colon' | 'value')
          | {
            mode?: 'strict' | 'minimum'
            on?: 'colon' | 'value'
            beforeColon?: boolean
            afterColon?: boolean
          }
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
  }
  | {
    singleLine?: {
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
    multiLine?: {
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
    align?: {
      mode?: 'strict' | 'minimum'
      on?: 'colon' | 'value'
      beforeColon?: boolean
      afterColon?: boolean
    }
  }

export type RuleOptions = [Schema0?]
export type MessageIds = 'extraKey' | 'extraValue' | 'missingKey' | 'missingValue'
