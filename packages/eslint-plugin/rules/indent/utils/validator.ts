import type { Token } from '#types'
import type { TokenInfo } from './token-info'

/**
 * Checks if a token's indentation is correct
 * @param token Token to examine
 * @param desiredIndent Desired indentation of the string
 * @returns `true` if the token's indentation is correct
 */
export function validateTokenIndent(tokenInfo: TokenInfo, token: Token, desiredIndent: string): boolean {
  const indentation = tokenInfo.getTokenIndent(token)

  return indentation === desiredIndent
}

/**
 * Check whether there are any blank (whitespace-only) lines between
 * two tokens on separate lines.
 * @param firstToken The first token.
 * @param secondToken The second token.
 * @returns `true` if the tokens are on separate lines and
 *   there exists a blank line between them, `false` otherwise.
 */
export function hasBlankLinesBetween(tokenInfo: TokenInfo, firstToken: Token, secondToken: Token): boolean {
  const firstTokenLine = firstToken.loc.end.line
  const secondTokenLine = secondToken.loc.start.line

  if (firstTokenLine === secondTokenLine || firstTokenLine === secondTokenLine - 1)
    return false

  for (let line = firstTokenLine + 1; line < secondTokenLine; ++line) {
    if (!tokenInfo.firstTokensByLineNumber.has(line))
      return true
  }

  return false
}
