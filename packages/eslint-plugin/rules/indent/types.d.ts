/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: lny83asZxqFbw8T-amma8-CU1rU1O4zgOiN9Rywj0mk */

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
  assignmentOperator?: number | 'off'
  outerIIFEBody?: number | 'off'
  MemberExpression?: number | 'off'
  FunctionDeclaration?: {
    parameters?: number | ('first' | 'off')
    body?: number
    returnType?: number
  }
  FunctionExpression?: {
    parameters?: number | ('first' | 'off')
    body?: number
    returnType?: number
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
}

export type IndentRuleOptions = [
  IndentSchema0?,
  IndentSchema1?,
]

export type RuleOptions = IndentRuleOptions
export type MessageIds = 'wrongIndentation'
