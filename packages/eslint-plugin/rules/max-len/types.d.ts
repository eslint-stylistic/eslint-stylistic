/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: uMJkONlM226jhA3G9S3Ome05yXe2M1PH12DfV1X9Wvg */

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
