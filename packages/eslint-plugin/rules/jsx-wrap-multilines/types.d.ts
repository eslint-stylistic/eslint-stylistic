/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: W_rVrl_djl4ntkWNl0FUsijz9ZU02OqFr9gome1H2hg */

export interface JsxWrapMultilinesSchema0 {
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

export type JsxWrapMultilinesRuleOptions = [
  JsxWrapMultilinesSchema0?,
]

export type RuleOptions = JsxWrapMultilinesRuleOptions
export type MessageIds =
  | 'missingParens'
  | 'parensOnNewLines'
