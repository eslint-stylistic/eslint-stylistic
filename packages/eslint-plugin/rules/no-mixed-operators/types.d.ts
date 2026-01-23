/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: W39KI9RIPSY5-3mqksM5qAfIaLhk0A1OvB-NFVTyTT0 */

export interface NoMixedOperatorsSchema0 {
  groups?: [
    (
      | '+'
      | '-'
      | '*'
      | '/'
      | '%'
      | '**'
      | '&'
      | '|'
      | '^'
      | '~'
      | '<<'
      | '>>'
      | '>>>'
      | '=='
      | '!='
      | '==='
      | '!=='
      | '>'
      | '>='
      | '<'
      | '<='
      | '&&'
      | '||'
      | 'in'
      | 'instanceof'
      | '?:'
      | '??'
    ),
    (
      | '+'
      | '-'
      | '*'
      | '/'
      | '%'
      | '**'
      | '&'
      | '|'
      | '^'
      | '~'
      | '<<'
      | '>>'
      | '>>>'
      | '=='
      | '!='
      | '==='
      | '!=='
      | '>'
      | '>='
      | '<'
      | '<='
      | '&&'
      | '||'
      | 'in'
      | 'instanceof'
      | '?:'
      | '??'
    ),
    ...(
      | '+'
      | '-'
      | '*'
      | '/'
      | '%'
      | '**'
      | '&'
      | '|'
      | '^'
      | '~'
      | '<<'
      | '>>'
      | '>>>'
      | '=='
      | '!='
      | '==='
      | '!=='
      | '>'
      | '>='
      | '<'
      | '<='
      | '&&'
      | '||'
      | 'in'
      | 'instanceof'
      | '?:'
      | '??'
    )[],
  ][]
  allowSamePrecedence?: boolean
}

export type NoMixedOperatorsRuleOptions = [
  NoMixedOperatorsSchema0?,
]

export type RuleOptions = NoMixedOperatorsRuleOptions
export type MessageIds = 'unexpectedMixedOperator'
