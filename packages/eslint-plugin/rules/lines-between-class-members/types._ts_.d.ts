/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: lKCH1IC7jI */

export type Schema0 =
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

export interface Schema1 {
  exceptAfterSingleLine?: boolean
  exceptAfterOverload?: boolean
}

export type RuleOptions = [Schema0?, Schema1?]
export type MessageIds = 'never' | 'always'
