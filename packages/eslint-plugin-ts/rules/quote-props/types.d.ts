/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: SwflhyNmDv */

export type QuotePropsSchema0 =
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

export type QuotePropsRuleOptions = QuotePropsSchema0

export type RuleOptions = QuotePropsRuleOptions
export type MessageIds =
  | 'requireQuotesDueToReservedWord'
  | 'inconsistentlyQuotedProperty'
  | 'unnecessarilyQuotedProperty'
  | 'unquotedReservedProperty'
  | 'unquotedNumericProperty'
  | 'unquotedPropertyFound'
  | 'redundantQuoting'
