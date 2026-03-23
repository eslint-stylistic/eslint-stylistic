import type { Tree } from '#types'

/**
 * @see https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
 */
const TRIPLE_SLASH_REFERENCE_PATTERN = /^\/\s*<(?:reference|amd-)/u

/**
 * Checks if a comment is a triple-slash reference directive (e.g., `/// <reference types="..." />`)
 */
export function isTripleSlashReference(comment: Tree.Comment): comment is Tree.LineComment {
  return comment.type === 'Line' && TRIPLE_SLASH_REFERENCE_PATTERN.test(comment.value)
}
