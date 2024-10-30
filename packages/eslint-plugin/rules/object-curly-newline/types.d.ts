/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: arNfL2pa8v */

export type ObjectCurlyNewlineSchema0 =
  | (
      | ('always' | 'never')
      | {
        multiline?: boolean
        minProperties?: number
        consistent?: boolean
      }
    )
  | {
    ObjectExpression?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minProperties?: number
          consistent?: boolean
        }
    ObjectPattern?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minProperties?: number
          consistent?: boolean
        }
    ImportDeclaration?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minProperties?: number
          consistent?: boolean
        }
    ExportDeclaration?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minProperties?: number
          consistent?: boolean
        }
    TSTypeLiteral?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minProperties?: number
          consistent?: boolean
        }
    TSInterfaceBody?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minProperties?: number
          consistent?: boolean
        }
  }

export type ObjectCurlyNewlineRuleOptions = [
  ObjectCurlyNewlineSchema0?,
]

export type RuleOptions = ObjectCurlyNewlineRuleOptions
export type MessageIds =
  | 'unexpectedLinebreakBeforeClosingBrace'
  | 'unexpectedLinebreakAfterOpeningBrace'
  | 'expectedLinebreakBeforeClosingBrace'
  | 'expectedLinebreakAfterOpeningBrace'
