/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: KKrAixzzGAN09ZclL9LL0qFoWiaYwe4nTFUmIo46Nn8 */

export type NoExtraParensSchema0
  = | []
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
        allowNodesInSpreadElement?: {
          ConditionalExpression?: boolean
          LogicalExpression?: boolean
          AwaitExpression?: boolean
        }
      },
    ]

export type NoExtraParensRuleOptions = NoExtraParensSchema0

export type RuleOptions = NoExtraParensRuleOptions
export type MessageIds = 'unexpected'
