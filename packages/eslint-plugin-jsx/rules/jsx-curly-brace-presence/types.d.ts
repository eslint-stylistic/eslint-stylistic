/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Lj3oZBwSFg */

export type JsxCurlyBracePresenceSchema0 =
  | {
    props?: 'always' | 'never' | 'ignore'
    children?: 'always' | 'never' | 'ignore'
    propElementValues?: 'always' | 'never' | 'ignore'
  }
  | ('always' | 'never' | 'ignore')

export type JsxCurlyBracePresenceRuleOptions = [
  JsxCurlyBracePresenceSchema0?,
]

export type RuleOptions = JsxCurlyBracePresenceRuleOptions
export type MessageIds = 'unnecessaryCurly' | 'missingCurly'
