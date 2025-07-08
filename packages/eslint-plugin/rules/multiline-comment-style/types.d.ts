/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: AMUDF0zDKV4UnPFxPyafyi1DqhUgG4ZWXfRUYYm5gO8 */

export type MultilineCommentStyleSchema0
  = | []
    | ['starred-block' | 'bare-block']
    | []
    | ['separate-lines']
    | [
      'separate-lines',
      {
        checkJSDoc?: boolean
        checkExclamation?: boolean
      },
    ]

export type MultilineCommentStyleRuleOptions
  = MultilineCommentStyleSchema0

export type RuleOptions = MultilineCommentStyleRuleOptions
export type MessageIds
  = | 'expectedBlock'
    | 'expectedBareBlock'
    | 'startNewline'
    | 'endNewline'
    | 'missingStar'
    | 'alignment'
    | 'expectedLines'
