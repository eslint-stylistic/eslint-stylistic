/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 1-XEkjROJh3yuSLHoiawsq4EY5HjvZu8FoY5B-u8OCE */

export interface TypeAnnotationSpacingSchema0 {
  before?: boolean
  after?: boolean
  overrides?: {
    colon?: SpacingConfig
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
export type MessageIds
  = | 'expectedSpaceAfter'
    | 'expectedSpaceBefore'
    | 'unexpectedSpaceAfter'
    | 'unexpectedSpaceBefore'
    | 'unexpectedSpaceBetween'
