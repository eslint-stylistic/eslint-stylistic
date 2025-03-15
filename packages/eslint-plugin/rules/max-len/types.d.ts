/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: HsGpTK1r5l */

export type MaxLenSchema0
  = | {
    code?: number
    comments?: number
    tabWidth?: number
    ignorePattern?: string
    ignoreComments?: boolean
    ignoreStrings?: boolean
    ignoreUrls?: boolean
    ignoreTemplateLiterals?: boolean
    ignoreRegExpLiterals?: boolean
    ignoreTrailingComments?: boolean
  }
  | number

export type MaxLenSchema1
  = | {
    code?: number
    comments?: number
    tabWidth?: number
    ignorePattern?: string
    ignoreComments?: boolean
    ignoreStrings?: boolean
    ignoreUrls?: boolean
    ignoreTemplateLiterals?: boolean
    ignoreRegExpLiterals?: boolean
    ignoreTrailingComments?: boolean
  }
  | number

export interface MaxLenSchema2 {
  code?: number
  comments?: number
  tabWidth?: number
  ignorePattern?: string
  ignoreComments?: boolean
  ignoreStrings?: boolean
  ignoreUrls?: boolean
  ignoreTemplateLiterals?: boolean
  ignoreRegExpLiterals?: boolean
  ignoreTrailingComments?: boolean
}

export type MaxLenRuleOptions = [
  MaxLenSchema0?,
  MaxLenSchema1?,
  MaxLenSchema2?,
]

export type RuleOptions = MaxLenRuleOptions
export type MessageIds = 'max' | 'maxComment'
