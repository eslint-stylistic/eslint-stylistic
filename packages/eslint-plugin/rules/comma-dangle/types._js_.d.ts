/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: p0irYE8sXQ */

export type CommaDangleSchema0
  = | []
    | [
      | Value
      | {
        arrays?: ValueWithIgnore
        objects?: ValueWithIgnore
        imports?: ValueWithIgnore
        exports?: ValueWithIgnore
        functions?: ValueWithIgnore
        importAttributes?: ValueWithIgnore
        dynamicImports?: ValueWithIgnore
      },
    ]
export type Value
  = | 'always-multiline'
    | 'always'
    | 'never'
    | 'only-multiline'
export type ValueWithIgnore
  = | 'always-multiline'
    | 'always'
    | 'ignore'
    | 'never'
    | 'only-multiline'

export type CommaDangleRuleOptions = CommaDangleSchema0

export type RuleOptions = CommaDangleRuleOptions
export type MessageIds = 'unexpected' | 'missing'
