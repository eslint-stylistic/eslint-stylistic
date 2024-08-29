/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 8lVbkQAtj6 */

export type Schema0 =
  | {
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

export type Schema1 =
  | {
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

export interface Schema2 {
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

export type RuleOptions = [Schema0?, Schema1?, Schema2?]
export type MessageIds = 'max' | 'maxComment'
