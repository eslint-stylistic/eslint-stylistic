import type * as ESTree from 'estree'
import type ESTraverse from 'estraverse'
import { traverse as _traverse } from 'estraverse'
import type { ASTNode, ESNode } from '#types'

/**
 * Wrapper for estraverse.traverse
 *
 * @param ASTnode The AST node being checked
 * @param visitor Visitor Object for estraverse
 */
export function traverse(ASTnode: ESNode, visitor: ESTraverse.Visitor) {
  const opts = Object.assign({}, {
    fallback(node: ASTNode) {
      return Object.keys(node).filter(key => key === 'children' || key === 'argument')
    },
  }, visitor)

  opts.keys = Object.assign({}, visitor.keys, {
    JSXElement: ['children'],
    JSXFragment: ['children'],
  })

  _traverse(ASTnode, opts)
}

/**
 * Helper function for traversing "returns" (return statements or the
 * returned expression in the case of an arrow function) of a function
 *
 * @param ASTNode The AST node being checked
 * @param context The context of `ASTNode`.
 * @param onReturn
 *   Function to execute for each returnStatement found
 */
export function traverseReturns(
  ASTNode: ESNode,
  onReturn: (returnValue: ESNode | null | undefined, breakTraverse: () => void) => void,
) {
  const nodeType = ASTNode.type

  if (nodeType === 'ReturnStatement') {
    onReturn(ASTNode.argument, () => {})
    return
  }

  if (nodeType === 'ArrowFunctionExpression' && ASTNode.expression) {
    onReturn(ASTNode.body, () => {})
    return
  }

  /* TODO: properly warn on React.forwardRefs having typo properties
  if (nodeType === 'CallExpression') {
    const callee = ASTNode.callee;
    const pragma = pragmaUtil.getFromContext(context);
    if (
      callee.type === 'MemberExpression'
      && callee.object.type === 'Identifier'
      && callee.object.name === pragma
      && callee.property.type === 'Identifier'
      && callee.property.name === 'forwardRef'
      && ASTNode.arguments.length > 0
    ) {
      return enterFunc(ASTNode.arguments[0]);
    }
    return;
  }
  */

  if (
    nodeType !== 'FunctionExpression'
    && nodeType !== 'FunctionDeclaration'
    && nodeType !== 'ArrowFunctionExpression'
    && nodeType !== 'MethodDefinition'
  ) {
    return
  }

  traverse((ASTNode as ESTree.FunctionDeclaration).body, {
    enter(node) {
      const breakTraverse = () => {
        this.break()
      }
      switch (node.type) {
        case 'ReturnStatement':
          this.skip()
          onReturn(node.argument, breakTraverse)
          return
        case 'BlockStatement':
        case 'IfStatement':
        case 'ForStatement':
        case 'WhileStatement':
        case 'SwitchStatement':
        case 'SwitchCase':
          return
        default:
          this.skip()
      }
    },
  })
}
