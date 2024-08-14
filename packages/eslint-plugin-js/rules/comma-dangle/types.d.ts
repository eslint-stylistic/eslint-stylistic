/* GENERATED, DO NOT EDIT DIRECTLY */

export type Schema0 =
  | []
  | [
    | Value
    | {
      arrays?: ValueWithIgnore
      objects?: ValueWithIgnore
      imports?: ValueWithIgnore
      exports?: ValueWithIgnore
      functions?: ValueWithIgnore
    },
  ]
export type Value = 'always-multiline' | 'always' | 'never' | 'only-multiline'
export type ValueWithIgnore = 'always-multiline' | 'always' | 'ignore' | 'never' | 'only-multiline'

export type RuleOptions = Schema0
export type MessageIds = 'unexpected' | 'missing'
