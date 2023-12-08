import type { Tree } from '@shared/types'

/**
 * Find the token before the closing bracket.
 * @param node - The JSX element node.
 * @returns The token before the closing bracket.
 */
export function getTokenBeforeClosingBracket(node: Tree.JSXOpeningElement | Tree.JSXClosingElement) {
  const attributes = 'attributes' in node && node.attributes
  if (!attributes || attributes.length === 0)
    return node.name

  return attributes[attributes.length - 1]
}
