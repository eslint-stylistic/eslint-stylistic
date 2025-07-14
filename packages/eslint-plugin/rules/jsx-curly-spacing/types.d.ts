/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: rmsGs7ZFrVG4SO4GoAoakEXhdq9TICtKptLvUpZNPRI */

export type JsxCurlySpacingSchema0
  = | []
    | [
      | (BasicConfig & {
        attributes?: BasicConfigOrBoolean
        children?: BasicConfigOrBoolean
      })
      | ('always' | 'never'),
    ]
    | [
      (
        | (BasicConfig & {
          attributes?: BasicConfigOrBoolean
          children?: BasicConfigOrBoolean
        })
        | ('always' | 'never')
      ),
      {
        allowMultiline?: boolean
        spacing?: {
          objectLiterals?: 'always' | 'never'
        }
      },
    ]
export type BasicConfigOrBoolean = BasicConfig | boolean

export interface BasicConfig {
  when?: 'always' | 'never'
  allowMultiline?: boolean
  spacing?: {
    objectLiterals?: 'always' | 'never'
  }
}

export type JsxCurlySpacingRuleOptions
  = JsxCurlySpacingSchema0

export type RuleOptions = JsxCurlySpacingRuleOptions
export type MessageIds
  = | 'noNewlineAfter'
    | 'noNewlineBefore'
    | 'noSpaceAfter'
    | 'noSpaceBefore'
    | 'spaceNeededAfter'
    | 'spaceNeededBefore'
