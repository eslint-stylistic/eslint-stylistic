/* GENERATED, DO NOT EDIT DIRECTLY */

export type Schema0 =
  | ('after-props' | 'props-aligned' | 'tag-aligned' | 'line-aligned')
  | {
    location?: 'after-props' | 'props-aligned' | 'tag-aligned' | 'line-aligned'
  }
  | {
    nonEmpty?: ('after-props' | 'props-aligned' | 'tag-aligned' | 'line-aligned') | false
    selfClosing?: ('after-props' | 'props-aligned' | 'tag-aligned' | 'line-aligned') | false
  }

export type RuleOptions = [Schema0?]
export type MessageIds = 'bracketLocation'
