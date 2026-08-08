import type { Tree } from '#types'

const COMMENT_DIRECTIVE_PATTERNS = [
  /^\s*eslint/u,
  /^\s*@ts-(?:expect-error|ignore|nocheck|check)(?![\w-])/u,
  /^\s*prettier-ignore(?![\w-])/u,
  /^\s*[vc]8\s+ignore(?![\w-])/u,
  /^\s*node:coverage\s+(?:disable|enable|ignore\s+next)(?![\w-])/u,
  /^\s*webpack(?:ChunkName|FetchPriority|Mode|Exports|Include|Exclude|Prefetch|Preload|Ignore)\s*:/u,
  /^\s*jshint\s+/u,
  /^\s*jslint\s+/u,
  /^\s*istanbul\s+/u,
  /^\s*globals?\s+/u,
  /^\s*exported\s+/u,
  /^\s*jscs/u,
  /^\s*\/\s*<(?:reference|amd-)/u,
] as const

/**
 * @see https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
 */
const TRIPLE_SLASH_REFERENCE_PATTERN = /^\/\s*<(?:reference|amd-)/u

/**
 * Checks if a comment contains a directive that must retain its position and form.
 */
export function isDirectiveComment(comment: Tree.Comment): boolean {
  return COMMENT_DIRECTIVE_PATTERNS.some(pattern => pattern.test(comment.value))
}

/**
 * Checks if a comment is a triple-slash reference directive (e.g., `/// <reference types="..." />`)
 */
export function isTripleSlashReference(comment: Tree.Comment): comment is Tree.LineComment {
  return comment.type === 'Line' && TRIPLE_SLASH_REFERENCE_PATTERN.test(comment.value)
}
