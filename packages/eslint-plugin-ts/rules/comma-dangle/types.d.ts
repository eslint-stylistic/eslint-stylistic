/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Jb7vZ0lVPm */

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
      enums?: ValueWithIgnore
      generics?: ValueWithIgnore
      tuples?: ValueWithIgnore
    },
  ]
export type Value =
  | 'always-multiline'
  | 'always'
  | 'never'
  | 'only-multiline'
export type ValueWithIgnore =
  | 'always-multiline'
  | 'always'
  | 'never'
  | 'only-multiline'
  | 'ignore'

export type RuleOptions = Schema0
export type MessageIds = 'unexpected' | 'missing'
