/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: _ZLcvo6X5vkWvnpwUR5rmsnxkBY3balwUPXKNdCPaqs */

export type QuotePropsSchema0
  = | []
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
export type MessageIds
  = | 'requireQuotesDueToReservedWord'
    | 'inconsistentlyQuotedProperty'
    | 'unnecessarilyQuotedProperty'
    | 'unquotedReservedProperty'
    | 'unquotedNumericProperty'
    | 'unquotedPropertyFound'
    | 'redundantQuoting'
