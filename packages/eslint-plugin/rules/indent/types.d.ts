/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 7yB4iLIauyRovVVmEm9xAgfPy4OzIDXyD9S-jpXQaco */

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
