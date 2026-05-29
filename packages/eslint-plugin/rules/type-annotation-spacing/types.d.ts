/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: D-fY9SckJ9kkYgPeSHnbqrFRQdB9tFNbq_tqb_HYeR8 */

export type SpacingConfigOrIgnore = 'ignore' | SpacingConfig

export interface TypeAnnotationSpacingSchema0 {
  before?: boolean
  after?: boolean
  overrides?: {
    colon?: SpacingConfig
    variable?: SpacingConfigOrIgnore
    parameter?: SpacingConfigOrIgnore
    property?: SpacingConfigOrIgnore
    returnType?: SpacingConfigOrIgnore
    questionMark?: SpacingConfigOrIgnore
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
