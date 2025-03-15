/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: QH4lBuq46z */

export type LinesBetweenClassMembersSchema0
  = | {
    /**
     * @minItems 1
     */
    enforce: [
      {
        blankLine: 'always' | 'never'
        prev: 'method' | 'field' | '*'
        next: 'method' | 'field' | '*'
      },
      ...{
        blankLine: 'always' | 'never'
        prev: 'method' | 'field' | '*'
        next: 'method' | 'field' | '*'
      }[],
    ]
  }
  | ('always' | 'never')

export interface LinesBetweenClassMembersSchema1 {
  exceptAfterSingleLine?: boolean
}

export type LinesBetweenClassMembersRuleOptions = [
  LinesBetweenClassMembersSchema0?,
  LinesBetweenClassMembersSchema1?,
]

export type RuleOptions
  = LinesBetweenClassMembersRuleOptions
export type MessageIds = 'never' | 'always'
