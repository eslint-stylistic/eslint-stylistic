/**
 * @fileoverview Utility functions for AST
 */
import type ESTraverse from 'estraverse'
import { traverse as _traverse } from 'estraverse'
import type { FunctionDeclaration } from 'estree'
import type { ASTNode, ESNode, RuleContext, SourceCode, Token } from '@shared/types'

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

  traverse((ASTNode as FunctionDeclaration).body, {
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

/**
 * Gets the first node in a line from the initial node, excluding whitespace.
 * @param context The node to check
 * @param node The node to check
 * @return {ASTNode} the first node in the line
 */
export function getFirstNodeInLine(context: { sourceCode: SourceCode }, node: ASTNode | Token) {
  const sourceCode = context.sourceCode
  let token: ASTNode | Token = node
  let lines: string[] | null = null
  do {
    token = sourceCode.getTokenBefore(token)!
    lines = token.type === 'JSXText'
      ? token.value.split('\n')
      : null
  } while (
    token.type === 'JSXText' && lines && /^\s*$/.test(lines[lines.length - 1])
  )
  return token
}

/**
 * Checks if the node is the first in its line, excluding whitespace.
 * @param context The node to check
 * @param node The node to check
 * @return {boolean} true if it's the first node in its line
 */
export function isNodeFirstInLine(context: { sourceCode: SourceCode }, node: ASTNode) {
  const token = getFirstNodeInLine(context, node)
  const startLine = node.loc!.start.line
  const endLine = token ? token.loc.end.line : -1
  return startLine !== endLine
}

/**
 * Checks if a node is surrounded by parenthesis.
 *
 * @param context - Context from the rule
 * @param node - Node to be checked
 */
export function isParenthesized(context: RuleContext<any, any>, node: ASTNode): boolean {
  const sourceCode = context.sourceCode
  const previousToken = sourceCode.getTokenBefore(node)
  const nextToken = sourceCode.getTokenAfter(node)

  return !!previousToken && !!nextToken
  && previousToken.value === '(' && previousToken.range[1] <= node.range![0]
  && nextToken.value === ')' && nextToken.range[0] >= node.range![1]
}
