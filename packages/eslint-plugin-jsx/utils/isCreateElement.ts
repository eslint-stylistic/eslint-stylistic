import { getFromContext } from './pragma'
import { isDestructuredFromPragmaImport } from './isDestructuredFromPragmaImport'
import type { RuleContext, Tree } from './types'

/**
 * Checks if the node is a createElement call
 * @param {ASTNode} node - The AST node being checked.
 * @param {Context} context - The AST node being checked.
 * @returns {boolean} - True if node is a createElement call object literal, False if not.
 */
export function isCreateElement(node: Tree.CallExpression, context: RuleContext<any, any>): boolean {
  const callee = node.callee
  if (
    callee
    && callee.type === 'MemberExpression'
    && callee.property.type === 'Identifier'
    && callee.property.name === 'createElement'
    && callee.object
    && 'name' in callee.object
    && callee.object.name === getFromContext(context)
  )
    return true

  if (
    'name' in callee
    && callee.name === 'createElement'
    && isDestructuredFromPragmaImport('createElement', context)
  )
    return true

  return false
}
