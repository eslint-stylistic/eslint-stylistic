/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: cWqWPSqo6p */

export type KeySpacingSchema0 =
  | {
    align?:
        | ('colon' | 'value')
        | {
          mode?: 'strict' | 'minimum'
          on?: 'colon' | 'value'
          beforeColon?: boolean
          afterColon?: boolean
        }
    mode?: 'strict' | 'minimum'
    beforeColon?: boolean
    afterColon?: boolean
    ignoredNodes?: (
      | 'Property'
      | 'ImportAttribute'
      | 'ObjectExpression'
      | 'ImportDeclaration'
      | 'ExportNamedDeclaration'
      | 'ExportAllDeclaration'
      | 'TSTypeLiteral'
      | 'TSInterfaceBody'
      | 'ClassBody'
    )[]
  }
  | {
    singleLine?: {
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
    multiLine?: {
      align?:
          | ('colon' | 'value')
          | {
            mode?: 'strict' | 'minimum'
            on?: 'colon' | 'value'
            beforeColon?: boolean
            afterColon?: boolean
          }
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
  }
  | {
    singleLine?: {
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
    multiLine?: {
      mode?: 'strict' | 'minimum'
      beforeColon?: boolean
      afterColon?: boolean
    }
    align?: {
      mode?: 'strict' | 'minimum'
      on?: 'colon' | 'value'
      beforeColon?: boolean
      afterColon?: boolean
    }
  }

export type KeySpacingRuleOptions = [KeySpacingSchema0?]

export type RuleOptions = KeySpacingRuleOptions
export type MessageIds =
  | 'extraKey'
  | 'extraValue'
  | 'missingKey'
  | 'missingValue'
