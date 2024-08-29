/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: eSfkLthEBZ */

export interface Schema0 {
  declaration?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
  assignment?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
  return?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
  arrow?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
  condition?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
  logical?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
  prop?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
  propertyValue?:
    | true
    | false
    | 'ignore'
    | 'parens'
    | 'parens-new-line'
}

export type RuleOptions = [Schema0?]
export type MessageIds =
  | 'missingParens'
  | 'parensOnNewLines'
