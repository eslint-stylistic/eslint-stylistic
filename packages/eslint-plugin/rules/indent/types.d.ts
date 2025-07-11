/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: SzVKUtzwj9ZkI4a25lsk0sPu8lbabhqgFXI6uxkydc4 */

export type IndentSchema0 = 'tab' | number

export interface IndentSchema1 {
  SwitchCase?: number
  VariableDeclarator?:
    | (number | ('first' | 'off'))
    | {
      var?: number | ('first' | 'off')
      let?: number | ('first' | 'off')
      const?: number | ('first' | 'off')
      using?: number | ('first' | 'off')
    }
  outerIIFEBody?: number | 'off'
  MemberExpression?: number | 'off'
  FunctionDeclaration?: {
    parameters?: number | ('first' | 'off')
    body?: number
  }
  FunctionExpression?: {
    parameters?: number | ('first' | 'off')
    body?: number
  }
  StaticBlock?: {
    body?: number
  }
  CallExpression?: {
    arguments?: number | ('first' | 'off')
  }
  ArrayExpression?: number | ('first' | 'off')
  ObjectExpression?: number | ('first' | 'off')
  ImportDeclaration?: number | ('first' | 'off')
  flatTernaryExpressions?: boolean
  offsetTernaryExpressions?: boolean
  offsetTernaryExpressionsOffsetCallExpressions?: boolean
  ignoredNodes?: string[]
  ignoreComments?: boolean
  tabLength?: number
  offsetMultiLineInList?: string[]
}

export type IndentRuleOptions = [
  IndentSchema0?,
  IndentSchema1?,
]

export type RuleOptions = IndentRuleOptions
export type MessageIds = 'wrongIndentation'
