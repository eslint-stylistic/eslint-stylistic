/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: pgv4yhnlgKghpHQCSxCVsAfXGeiptdo98NqHwAmDgMI */

export type SpacingConfigWithIgnore
  = | 'ignore'
    | SpacingConfig

export interface TypeAnnotationSpacingSchema0 {
  before?: boolean
  after?: boolean
  overrides?: {
    colon?: SpacingConfig
    variable?: SpacingConfigWithIgnore
    parameter?: SpacingConfigWithIgnore
    property?: SpacingConfigWithIgnore
    returnType?: SpacingConfigWithIgnore
    questionMark?: SpacingConfigWithIgnore
  }
}
export interface SpacingConfig {
  before?: boolean
  after?: boolean
}

export type TypeAnnotationSpacingRuleOptions = [
  TypeAnnotationSpacingSchema0?,
]

export type RuleOptions = TypeAnnotationSpacingRuleOptions
export type MessageIds
  = | 'expectedSpaceAfter'
    | 'expectedSpaceBefore'
    | 'unexpectedSpaceAfter'
    | 'unexpectedSpaceBefore'
    | 'expectedSpaceBetween'
    | 'unexpectedSpaceBetween'
