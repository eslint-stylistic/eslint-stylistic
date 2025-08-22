/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ZGFqQzg84hi9Hxqzf99MMK_yV8JG0ORwl-tVxacIUqI */

export interface SpaceUnaryOpsSchema0 {
  words?: boolean
  nonwords?: boolean
  overrides?: {
    [k: string]: boolean
  }
}

export type SpaceUnaryOpsRuleOptions = [
  SpaceUnaryOpsSchema0?,
]

export type RuleOptions = SpaceUnaryOpsRuleOptions
export type MessageIds
  = | 'unexpectedBefore'
    | 'unexpectedAfter'
    | 'unexpectedAfterWord'
    | 'requireAfterWord'
    | 'requireAfter'
    | 'requireBefore'
