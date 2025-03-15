/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: lTm9TwfObZ */

export type CurlyNewlineSchema0
  = | ('always' | 'never')
    | {
      IfStatementConsequent?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      IfStatementAlternative?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      DoWhileStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      ForInStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      ForOfStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      ForStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      WhileStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      SwitchStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      SwitchCase?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      TryStatementBlock?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      TryStatementHandler?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      TryStatementFinalizer?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      BlockStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      ArrowFunctionExpression?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      FunctionDeclaration?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      FunctionExpression?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      Property?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      ClassBody?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      StaticBlock?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      WithStatement?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      TSEnumBody?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      TSInterfaceBody?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      TSModuleBlock?:
        | ('always' | 'never')
        | {
          multiline?: boolean
          minElements?: number
          consistent?: boolean
        }
      multiline?: boolean
      minElements?: number
      consistent?: boolean
    }

export type CurlyNewlineRuleOptions = [CurlyNewlineSchema0?]

export type RuleOptions = CurlyNewlineRuleOptions
export type MessageIds
  = | 'unexpectedLinebreakBeforeClosingBrace'
    | 'unexpectedLinebreakAfterOpeningBrace'
    | 'expectedLinebreakBeforeClosingBrace'
    | 'expectedLinebreakAfterOpeningBrace'
