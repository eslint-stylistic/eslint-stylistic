/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: _pSba4lVI8bSVjFb0Xmp0h46hFdDbMk9iLr41NY4nwY */

export type JsxCurlySpacingSchema0
  = | []
    | [
      | {
        when?: 'always' | 'never'
        allowMultiline?: boolean
        spacing?: {
          objectLiterals?: 'always' | 'never'
        }
        attributes?:
          | {
            when?: 'always' | 'never'
            allowMultiline?: boolean
            spacing?: {
              objectLiterals?: 'always' | 'never'
            }
          }
          | boolean
        children?:
          | {
            when?: 'always' | 'never'
            allowMultiline?: boolean
            spacing?: {
              objectLiterals?: 'always' | 'never'
            }
          }
          | boolean
      }
      | ('always' | 'never'),
    ]
    | [
      (
        | {
          when?: 'always' | 'never'
          allowMultiline?: boolean
          spacing?: {
            objectLiterals?: 'always' | 'never'
          }
          attributes?:
            | {
              when?: 'always' | 'never'
              allowMultiline?: boolean
              spacing?: {
                objectLiterals?: 'always' | 'never'
              }
            }
            | boolean
          children?:
            | {
              when?: 'always' | 'never'
              allowMultiline?: boolean
              spacing?: {
                objectLiterals?: 'always' | 'never'
              }
            }
            | boolean
        }
        | ('always' | 'never')
      ),
      {
        allowMultiline?: boolean
        spacing?: {
          objectLiterals?: 'always' | 'never'
        }
      },
    ]

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
