/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: AmzkYVmsrCtfPahAL0G5FJy30kHvyL_KrX9cxXJspWk */

export type JsxCurlyNewlineSchema0
  = | ('consistent' | 'never')
    | {
      singleline?: 'consistent' | 'require' | 'forbid'
      multiline?: 'consistent' | 'require' | 'forbid'
    }

export type JsxCurlyNewlineRuleOptions = [
  JsxCurlyNewlineSchema0?,
]

export type RuleOptions = JsxCurlyNewlineRuleOptions
export type MessageIds
  = | 'expectedBefore'
    | 'expectedAfter'
    | 'unexpectedBefore'
    | 'unexpectedAfter'
