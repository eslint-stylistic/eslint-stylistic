/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Pk_ZP4o71U4BDmPTAvIssruXck2TqB_0QpMpDf-tA8s */

export type FunctionCallSpacingSchema0
  = | []
    | ['never']
    | []
    | ['always']
    | [
      'always',
      {
        allowNewlines?: boolean
      },
    ]

export type FunctionCallSpacingRuleOptions
  = FunctionCallSpacingSchema0

export type RuleOptions = FunctionCallSpacingRuleOptions
export type MessageIds
  = | 'unexpectedWhitespace'
    | 'unexpectedNewline'
    | 'missing'
