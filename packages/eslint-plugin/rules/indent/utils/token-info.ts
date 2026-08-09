import type { ASTNode, SourceCode, Token } from '#types'

/**
 * A helper class to get token-based info related to indentation
 */
export class TokenInfo {
  sourceCode: SourceCode
  firstTokensByLineNumber: Map<number, Token>

  /**
   * @param sourceCode A SourceCode object
   */
  constructor(sourceCode: SourceCode) {
    this.sourceCode = sourceCode
    this.firstTokensByLineNumber = new Map()
    const tokens = sourceCode.tokensAndComments

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (!this.firstTokensByLineNumber.has(token.loc.start.line))
        this.firstTokensByLineNumber.set(token.loc.start.line, token)

      if (!this.firstTokensByLineNumber.has(token.loc.end.line) && sourceCode.text.slice(token.range[1] - token.loc.end.column, token.range[1]).trim())
        this.firstTokensByLineNumber.set(token.loc.end.line, token)
    }
  }

  /**
   * Gets the first token on a given token's line
   * @param token a node or token
   * @returns The first token on the given line
   */
  getFirstTokenOfLine(token: Token | ASTNode) {
    return this.firstTokensByLineNumber.get(token.loc.start.line)
  }

  /**
   * Determines whether a token is the first token in its line
   * @param token The token
   * @returns `true` if the token is the first on its line
   */
  isFirstTokenOfLine(token: Token | ASTNode) {
    return this.getFirstTokenOfLine(token) === token
  }

  /**
   * Get the actual indent of a token
   * @param token Token to examine. This should be the first token on its line.
   * @returns The indentation characters that precede the token
   */
  getTokenIndent(token: Token) {
    return this.sourceCode.text.slice(token.range[0] - token.loc.start.column, token.range[0])
  }
}
