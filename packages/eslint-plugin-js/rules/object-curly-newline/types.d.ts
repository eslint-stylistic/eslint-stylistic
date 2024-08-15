/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: Juf3vAwoBb */

export type Schema0 =
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

export type RuleOptions = [Schema0?]
export type MessageIds =
  | 'unexpectedLinebreakBeforeClosingBrace'
  | 'unexpectedLinebreakAfterOpeningBrace'
  | 'expectedLinebreakBeforeClosingBrace'
  | 'expectedLinebreakAfterOpeningBrace'
