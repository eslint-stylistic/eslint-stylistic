/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: KOe_wU0r0lsPla5JCuUUOQFmBSnDNOIm5DXIMsRs3g4 */

export type JsxMaxPropsPerLineSchema0 =
  | {
    maximum?: {
      single?: number
      multi?: number
      [k: string]: unknown
    }
  }
  | {
    maximum?: number
    when?: 'always' | 'multiline'
  }

export type JsxMaxPropsPerLineRuleOptions = [
  JsxMaxPropsPerLineSchema0?,
]

export type RuleOptions = JsxMaxPropsPerLineRuleOptions
export type MessageIds = 'newLine'
