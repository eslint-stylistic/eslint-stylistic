/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: ZE8W2CZIwS0ursd3PES6PVlbzvNnUbQ3tcyO4IrGhZg */

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
  offsetMultilineExpressions?: boolean
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
