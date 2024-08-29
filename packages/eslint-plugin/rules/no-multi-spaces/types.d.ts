/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: C9N1SVxsYd */

export interface NoMultiSpacesSchema0 {
  exceptions?: {
    [k: string]: boolean
  }
  ignoreEOLComments?: boolean
  includeTabs?: boolean
}

export type NoMultiSpacesRuleOptions = [
  NoMultiSpacesSchema0?,
]

export type RuleOptions = NoMultiSpacesRuleOptions
export type MessageIds = 'multipleSpaces'
