/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: _V2ZZxRh1Dm7A-uGUyCdksxnvgEp-rjODwSqHkfP6Ac */

export type NoExtraParensSchema0 =
  | []
  | ['functions']
  | []
  | ['all']
  | [
    'all',
    {
      conditionalAssign?: boolean
      ternaryOperandBinaryExpressions?: boolean
      nestedBinaryExpressions?: boolean
      returnAssign?: boolean
      ignoreJSX?:
        | 'none'
        | 'all'
        | 'single-line'
        | 'multi-line'
      enforceForArrowConditionals?: boolean
      enforceForSequenceExpressions?: boolean
      enforceForNewInMemberExpressions?: boolean
      enforceForFunctionPrototypeMethods?: boolean
      allowParensAfterCommentPattern?: string
      nestedConditionalExpressions?: boolean
    },
  ]

export type NoExtraParensRuleOptions = NoExtraParensSchema0

export type RuleOptions = NoExtraParensRuleOptions
export type MessageIds = 'unexpected'
