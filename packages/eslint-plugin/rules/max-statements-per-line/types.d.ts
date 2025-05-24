/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: xT24H9Fyeq-J8bNrcQKfSycutt6yiEtagTVpNUP1tw8 */

export interface MaxStatementsPerLineSchema0 {
  max?: number
  ignoredNodes?: (
    | 'BreakStatement'
    | 'ClassDeclaration'
    | 'ContinueStatement'
    | 'DebuggerStatement'
    | 'DoWhileStatement'
    | 'ExpressionStatement'
    | 'ForInStatement'
    | 'ForOfStatement'
    | 'ForStatement'
    | 'FunctionDeclaration'
    | 'IfStatement'
    | 'ImportDeclaration'
    | 'LabeledStatement'
    | 'ReturnStatement'
    | 'SwitchStatement'
    | 'ThrowStatement'
    | 'TryStatement'
    | 'VariableDeclaration'
    | 'WhileStatement'
    | 'WithStatement'
    | 'ExportNamedDeclaration'
    | 'ExportDefaultDeclaration'
    | 'ExportAllDeclaration'
  )[]
}

export type MaxStatementsPerLineRuleOptions = [
  MaxStatementsPerLineSchema0?,
]

export type RuleOptions = MaxStatementsPerLineRuleOptions
export type MessageIds = 'exceed'
