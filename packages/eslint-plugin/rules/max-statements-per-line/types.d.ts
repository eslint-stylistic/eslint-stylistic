/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: -QGVDh6hjVCh_7EO2FpVgtE2twJ-YPyQ_hPu51h342k */

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
