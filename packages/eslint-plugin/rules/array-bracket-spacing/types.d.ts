/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: rBInn72Rodz8Vglilb-cVBqmpHRFM8I2l8X2Uq-hbEA */

export type ArrayBracketSpacingSchema0 = 'always' | 'never'

export interface ArrayBracketSpacingSchema1 {
  singleValue?: boolean
  objectsInArrays?: boolean
  arraysInArrays?: boolean
}

export type ArrayBracketSpacingRuleOptions = [
  ArrayBracketSpacingSchema0?,
  ArrayBracketSpacingSchema1?,
]

export type RuleOptions = ArrayBracketSpacingRuleOptions
export type MessageIds
  = | 'unexpectedSpaceAfter'
    | 'unexpectedSpaceBefore'
    | 'missingSpaceAfter'
    | 'missingSpaceBefore'
