/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: B9qHL1NzSVJct-9B-cD09lId05xVPKRdaGuR3vGihsc */

export type SpaceBeforeFunctionParenSchema0
  = | ('always' | 'never')
    | {
      anonymous?: 'always' | 'never' | 'ignore'
      named?: 'always' | 'never' | 'ignore'
      asyncArrow?: 'always' | 'never' | 'ignore'
      catch?: 'always' | 'never' | 'ignore'
    }

export type SpaceBeforeFunctionParenRuleOptions = [
  SpaceBeforeFunctionParenSchema0?,
]

export type RuleOptions
  = SpaceBeforeFunctionParenRuleOptions
export type MessageIds = 'unexpectedSpace' | 'missingSpace'
