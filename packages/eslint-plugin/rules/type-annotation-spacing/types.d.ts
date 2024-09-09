/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: LcEkMg91dp */

export interface TypeAnnotationSpacingSchema0 {
  before?: boolean
  after?: boolean
  overrides?: {
    colon?: SpacingConfig
    arrow?: SpacingConfig
    variable?: SpacingConfig
    parameter?: SpacingConfig
    property?: SpacingConfig
    returnType?: SpacingConfig
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
export type MessageIds =
  | 'expectedSpaceAfter'
  | 'expectedSpaceBefore'
  | 'unexpectedSpaceAfter'
  | 'unexpectedSpaceBefore'
  | 'unexpectedSpaceBetween'
