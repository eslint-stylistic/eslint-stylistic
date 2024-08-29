/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ODqLgSnyFr */

export type MultilineCommentStyleSchema0 =
  | []
  | ['starred-block' | 'bare-block']
  | []
  | ['separate-lines']
  | [
    'separate-lines',
    {
      checkJSDoc?: boolean
    },
  ]

export type MultilineCommentStyleRuleOptions =
  MultilineCommentStyleSchema0

export type RuleOptions = MultilineCommentStyleRuleOptions
export type MessageIds =
  | 'expectedBlock'
  | 'expectedBareBlock'
  | 'startNewline'
  | 'endNewline'
  | 'missingStar'
  | 'alignment'
  | 'expectedLines'
