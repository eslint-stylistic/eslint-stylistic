/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: w-cQC8WLDQV7ZHyRFgDZlAcqALcP9MozGIpOT2a7L_s */

export interface NoMultiSpacesSchema0 {
  exceptions?: {
    [k: string]: boolean
  }
  ignoreEOLComments?: boolean
  includeTabs?: boolean | 'as-multiple-spaces'
}

export type NoMultiSpacesRuleOptions = [
  NoMultiSpacesSchema0?,
]

export type RuleOptions = NoMultiSpacesRuleOptions
export type MessageIds = 'multipleSpaces'
