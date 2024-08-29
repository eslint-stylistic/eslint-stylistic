/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 8G2lkeIQnJ */

export type CommaDangleSchema0 =
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

export type CommaDangleRuleOptions = CommaDangleSchema0

export type RuleOptions = CommaDangleRuleOptions
export type MessageIds = 'unexpected' | 'missing'
