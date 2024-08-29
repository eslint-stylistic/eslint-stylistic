/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ZpLXIjLfsJ */

export type JsxClosingBracketLocationSchema0 =
  | (
    | 'after-props'
    | 'props-aligned'
    | 'tag-aligned'
    | 'line-aligned'
    )
    | {
      location?:
        | 'after-props'
        | 'props-aligned'
        | 'tag-aligned'
        | 'line-aligned'
    }
    | {
      nonEmpty?:
        | (
          | 'after-props'
          | 'props-aligned'
          | 'tag-aligned'
          | 'line-aligned'
          )
          | false
      selfClosing?:
        | (
          | 'after-props'
          | 'props-aligned'
          | 'tag-aligned'
          | 'line-aligned'
          )
          | false
    }

export type JsxClosingBracketLocationRuleOptions = [
  JsxClosingBracketLocationSchema0?,
]

export type RuleOptions =
  JsxClosingBracketLocationRuleOptions
export type MessageIds = 'bracketLocation'
