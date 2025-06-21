/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: dopZK4eiTZQ5hrwskp4T4Iz8Nlbxo4sqFW8I_8GyvTY */

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
  exceptAfterOverload?: boolean
}

export type LinesBetweenClassMembersRuleOptions = [
  LinesBetweenClassMembersSchema0?,
  LinesBetweenClassMembersSchema1?,
]

export type RuleOptions
  = LinesBetweenClassMembersRuleOptions
export type MessageIds = 'never' | 'always'
