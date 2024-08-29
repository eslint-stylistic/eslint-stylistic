/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 0b2FWeaDSR */

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
