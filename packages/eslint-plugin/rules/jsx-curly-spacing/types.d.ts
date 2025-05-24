/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 6np7FJPRpiFgbrMsnDL-PC4zMTYMNJoW_bCYp5XgxUg */

export type JsxCurlySpacingSchema0 =
  | []
  | [
      | (BasicConfig & {
        attributes?: BasicConfigOrBoolean
        children?: BasicConfigOrBoolean
        [k: string]: unknown
      })
      | ('always' | 'never'),
  ]
  | [
    (
        | (BasicConfig & {
          attributes?: BasicConfigOrBoolean
          children?: BasicConfigOrBoolean
          [k: string]: unknown
        })
        | ('always' | 'never')
    ),
    {
      allowMultiline?: boolean
      spacing?: {
        objectLiterals?: 'always' | 'never'
        [k: string]: unknown
      }
    },
  ]
export type BasicConfigOrBoolean = BasicConfig | boolean

export interface BasicConfig {
  when?: 'always' | 'never'
  allowMultiline?: boolean
  spacing?: {
    objectLiterals?: 'always' | 'never'
    [k: string]: unknown
  }
  [k: string]: unknown
}

export type JsxCurlySpacingRuleOptions =
  JsxCurlySpacingSchema0

export type RuleOptions = JsxCurlySpacingRuleOptions
export type MessageIds =
  | 'noNewlineAfter'
  | 'noNewlineBefore'
  | 'noSpaceAfter'
  | 'noSpaceBefore'
  | 'spaceNeededAfter'
  | 'spaceNeededBefore'
