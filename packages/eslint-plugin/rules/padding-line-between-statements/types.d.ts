/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: 11RYh4WPmthmwVCsA-LKcSWyOt_8NdY54_V1Cl28IzI */

export type PaddingType = 'any' | 'never' | 'always'
export type StatementOption
  = | StatementType
    | [StatementType, ...StatementType[]]
export type StatementType
  = | '*'
    | 'exports'
    | 'require'
    | 'directive'
    | 'iife'
    | 'block'
    | 'empty'
    | 'function'
    | 'ts-method'
    | 'break'
    | 'case'
    | 'class'
    | 'continue'
    | 'debugger'
    | 'default'
    | 'do'
    | 'for'
    | 'if'
    | 'import'
    | 'switch'
    | 'throw'
    | 'try'
    | 'while'
    | 'with'
    | 'cjs-export'
    | 'cjs-import'
    | 'jsx-prop'
    | 'enum'
    | 'interface'
    | 'function-overload'
    | 'block-like'
    | 'singleline-block-like'
    | 'multiline-block-like'
    | 'expression'
    | 'singleline-expression'
    | 'multiline-expression'
    | 'return'
    | 'singleline-return'
    | 'multiline-return'
    | 'export'
    | 'singleline-export'
    | 'multiline-export'
    | 'var'
    | 'singleline-var'
    | 'multiline-var'
    | 'let'
    | 'singleline-let'
    | 'multiline-let'
    | 'const'
    | 'singleline-const'
    | 'multiline-const'
    | 'using'
    | 'singleline-using'
    | 'multiline-using'
    | 'type'
    | 'singleline-type'
    | 'multiline-type'
export type PaddingLineBetweenStatementsSchema0 = {
  blankLine: PaddingType
  prev: StatementOption
  next: StatementOption
}[]

export type PaddingLineBetweenStatementsRuleOptions
  = PaddingLineBetweenStatementsSchema0

export type RuleOptions
  = PaddingLineBetweenStatementsRuleOptions
export type MessageIds
  = | 'unexpectedBlankLine'
    | 'expectedBlankLine'
