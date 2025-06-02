/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: pOD-S6HnSaLSg2uSVR4z8UFaMHuX_NGZwuBVoKsXBBY */

export interface JsxTagSpacingSchema0 {
  closingSlash?: 'always' | 'never' | 'allow'
  beforeSelfClosing?:
    | 'always'
    | 'proportional-always'
    | 'never'
    | 'allow'
  afterOpening?:
    | 'always'
    | 'allow-multiline'
    | 'never'
    | 'allow'
  beforeClosing?:
    | 'always'
    | 'proportional-always'
    | 'never'
    | 'allow'
}

export type JsxTagSpacingRuleOptions = [
  JsxTagSpacingSchema0?,
]

export type RuleOptions = JsxTagSpacingRuleOptions
export type MessageIds =
  | 'selfCloseSlashNoSpace'
  | 'selfCloseSlashNeedSpace'
  | 'closeSlashNoSpace'
  | 'closeSlashNeedSpace'
  | 'beforeSelfCloseNoSpace'
  | 'beforeSelfCloseNeedSpace'
  | 'beforeSelfCloseNeedNewline'
  | 'afterOpenNoSpace'
  | 'afterOpenNeedSpace'
  | 'beforeCloseNoSpace'
  | 'beforeCloseNeedSpace'
  | 'beforeCloseNeedNewline'
