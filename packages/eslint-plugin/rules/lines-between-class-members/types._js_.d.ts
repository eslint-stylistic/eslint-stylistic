/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: y8e_6shUGU3joei8-zuLmOZbpJV8TQIP9XRJoZyeajw */

export type LinesBetweenClassMembersSchema0 =
  | {
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

export type RuleOptions =
  LinesBetweenClassMembersRuleOptions
export type MessageIds = 'never' | 'always'
