/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: JBvxbYShy3 */

export type Schema0 =
  | []
  | [
    | 'always'
    | 'as-needed'
    | 'consistent'
    | 'consistent-as-needed',
  ]
  | []
  | [
    | 'always'
    | 'as-needed'
    | 'consistent'
    | 'consistent-as-needed',
  ]
  | [
    (
      | 'always'
      | 'as-needed'
      | 'consistent'
      | 'consistent-as-needed'
    ),
    {
      keywords?: boolean
      unnecessary?: boolean
      numbers?: boolean
    },
  ]

export type RuleOptions = Schema0
export type MessageIds =
  | 'requireQuotesDueToReservedWord'
  | 'inconsistentlyQuotedProperty'
  | 'unnecessarilyQuotedProperty'
  | 'unquotedReservedProperty'
  | 'unquotedNumericProperty'
  | 'unquotedPropertyFound'
  | 'redundantQuoting'
