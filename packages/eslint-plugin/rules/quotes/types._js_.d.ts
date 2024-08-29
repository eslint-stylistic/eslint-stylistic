/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: WcyMLwhBBP */

export type Schema0 = 'single' | 'double' | 'backtick'

export type Schema1 =
  | 'avoid-escape'
  | {
    avoidEscape?: boolean
    allowTemplateLiterals?: boolean
    ignoreStringLiterals?: boolean
  }

export type RuleOptions = [Schema0?, Schema1?]
export type MessageIds = 'wrongQuotes'
