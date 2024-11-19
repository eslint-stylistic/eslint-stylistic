/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: FtXazQV3Wp */

export type FunctionCallSpacingSchema0 =
  | []
  | ['never']
  | []
  | ['always']
  | [
    'always',
    {
      allowNewlines?: boolean
      optionalChain?: {
        before?: boolean
        after?: boolean
      }
    },
  ]

export type FunctionCallSpacingRuleOptions =
  FunctionCallSpacingSchema0

export type RuleOptions = FunctionCallSpacingRuleOptions
export type MessageIds =
  | 'unexpectedWhitespace'
  | 'unexpectedNewline'
  | 'missing'
