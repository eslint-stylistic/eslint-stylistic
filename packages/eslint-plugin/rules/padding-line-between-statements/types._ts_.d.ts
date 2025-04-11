/* GENERATED, DO NOT EDIT DIRECTLY */

/* @checksum: dpKjh9VDsc */

export type PaddingType = 'any' | 'never' | 'always'
export type StatementType
  = | (
    | '*'
    | 'block-like'
    | 'exports'
    | 'require'
    | 'directive'
    | 'expression'
    | 'iife'
    | 'multiline-block-like'
    | 'multiline-expression'
    | 'multiline-const'
    | 'multiline-export'
    | 'multiline-let'
    | 'multiline-var'
    | 'singleline-const'
    | 'singleline-export'
    | 'singleline-let'
    | 'singleline-var'
    | 'block'
    | 'empty'
    | 'function'
    | 'ts-method'
    | 'break'
    | 'case'
    | 'class'
    | 'const'
    | 'continue'
    | 'debugger'
    | 'default'
    | 'do'
    | 'export'
    | 'for'
    | 'if'
    | 'import'
    | 'let'
    | 'return'
    | 'switch'
    | 'throw'
    | 'try'
    | 'var'
    | 'while'
    | 'with'
    | 'cjs-export'
    | 'cjs-import'
    | 'enum'
    | 'interface'
    | 'type'
    | 'function-overload'
    )
    | [
      (
        | '*'
        | 'block-like'
        | 'exports'
        | 'require'
        | 'directive'
        | 'expression'
        | 'iife'
        | 'multiline-block-like'
        | 'multiline-expression'
        | 'multiline-const'
        | 'multiline-export'
        | 'multiline-let'
        | 'multiline-var'
        | 'singleline-const'
        | 'singleline-export'
        | 'singleline-let'
        | 'singleline-var'
        | 'block'
        | 'empty'
        | 'function'
        | 'ts-method'
        | 'break'
        | 'case'
        | 'class'
        | 'const'
        | 'continue'
        | 'debugger'
        | 'default'
        | 'do'
        | 'export'
        | 'for'
        | 'if'
        | 'import'
        | 'let'
        | 'return'
        | 'switch'
        | 'throw'
        | 'try'
        | 'var'
        | 'while'
        | 'with'
        | 'cjs-export'
        | 'cjs-import'
        | 'enum'
        | 'interface'
        | 'type'
        | 'function-overload'
      ),
      ...(
        | '*'
        | 'block-like'
        | 'exports'
        | 'require'
        | 'directive'
        | 'expression'
        | 'iife'
        | 'multiline-block-like'
        | 'multiline-expression'
        | 'multiline-const'
        | 'multiline-export'
        | 'multiline-let'
        | 'multiline-var'
        | 'singleline-const'
        | 'singleline-export'
        | 'singleline-let'
        | 'singleline-var'
        | 'block'
        | 'empty'
        | 'function'
        | 'ts-method'
        | 'break'
        | 'case'
        | 'class'
        | 'const'
        | 'continue'
        | 'debugger'
        | 'default'
        | 'do'
        | 'export'
        | 'for'
        | 'if'
        | 'import'
        | 'let'
        | 'return'
        | 'switch'
        | 'throw'
        | 'try'
        | 'var'
        | 'while'
        | 'with'
        | 'cjs-export'
        | 'cjs-import'
        | 'enum'
        | 'interface'
        | 'type'
        | 'function-overload'
      )[],
    ]
export type PaddingLineBetweenStatementsSchema0 = {
  blankLine: PaddingType
  prev: StatementType
  next: StatementType
}[]

export type PaddingLineBetweenStatementsRuleOptions
  = PaddingLineBetweenStatementsSchema0

export type RuleOptions
  = PaddingLineBetweenStatementsRuleOptions
export type MessageIds
  = | 'unexpectedBlankLine'
    | 'expectedBlankLine'
