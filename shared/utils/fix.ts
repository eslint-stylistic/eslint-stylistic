import type { ASTNode, ReportFixFunction, SourceCode, Token } from '#types'

export function safeReplaceTextBetween(sourceCode: SourceCode, left: ASTNode | Token, right: ASTNode | Token, replacement: string | (() => string)): ReportFixFunction | null {
  if (sourceCode.commentsExistBetween(left, right))
    return null

  const range = [left.range[1], right.range[0]] as const

  return fixer => fixer.replaceTextRange(range, typeof replacement === 'function' ? replacement() : replacement)
}
