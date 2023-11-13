/**
 * @fileoverview Utility functions for JSX
 */
import type { Rule } from 'eslint'
import { traverseReturns } from './ast'
import { isCreateElement } from './isCreateElement'
import { findVariableByName } from './variable'
import type { ASTNode, Tree } from './types'

// See https://github.com/babel/babel/blob/ce420ba51c68591e057696ef43e028f41c6e04cd/packages/babel-types/src/validators/react/isCompatTag.js
// for why we only test for the first character
const COMPAT_TAG_REGEX = /^[a-z]/

/**
 * Checks if a node represents a DOM element according to React.
 * @param {object} node - JSXOpeningElement to check.
 * @returns {boolean} Whether or not the node corresponds to a DOM element.
 */
export function isDOMComponent(node: Tree.JSXOpeningElement | Tree.JSXOpeningFragment) {
  const name = getElementType(node)
  return COMPAT_TAG_REGEX.test(name)
}

/**
 * Checks if a node represents a JSX element or fragment.
 * @param {object} node - node to check.
 * @returns {boolean} Whether or not the node if a JSX element or fragment.
 */
export function isJSX(node: ASTNode): node is (Tree.JSXElement | Tree.JSXFragment) {
  return node && ['JSXElement', 'JSXFragment'].includes(node.type)
}

/**
 * Check if value has only whitespaces
 * @param {string} value
 * @returns {boolean}
 */
export function isWhiteSpaces(value: string): boolean {
  return typeof value === 'string' ? /^\s*$/.test(value) : false
}

/**
 * Check if the node is returning JSX or null
 *
 * @param {ASTNode} ASTnode The AST node being checked
 * @param {Context} context The context of `ASTNode`.
 * @param {boolean} [strict] If true, in a ternary condition the node must return JSX in both cases
 * @param {boolean} [ignoreNull] If true, null return values will be ignored
 * @returns {boolean} True if the node is returning JSX or null, false if not
 */
export function isReturningJSX(ASTnode: ASTNode, context: Rule.RuleContext, strict = false, ignoreNull = false) {
  const isJSXValue = (node: ASTNode): boolean => {
    if (!node)
      return false

    switch (node.type) {
      case 'ConditionalExpression':
        if (strict)
          return isJSXValue(node.consequent) && isJSXValue(node.alternate)

        return isJSXValue(node.consequent) || isJSXValue(node.alternate)
      case 'LogicalExpression':
        if (strict)
          return isJSXValue(node.left) && isJSXValue(node.right)

        return isJSXValue(node.left) || isJSXValue(node.right)
      case 'SequenceExpression':
        return isJSXValue(node.expressions[node.expressions.length - 1])
      case 'JSXElement':
      case 'JSXFragment':
        return true
      case 'CallExpression':
        return isCreateElement(node, context)
      case 'Literal':
        if (!ignoreNull && node.value === null)
          return true
        return false
      case 'Identifier': {
        const variable = findVariableByName(context, node.name)
        return isJSX(variable)
      }
      default:
        return false
    }
  }

  let found = false
  traverseReturns(ASTnode, context, (node, breakTraverse) => {
    if (isJSXValue(node)) {
      found = true
      breakTraverse()
    }
  })

  return found
}

/**
 * Returns the name of the prop given the JSXAttribute object.
 *
 * Ported from `jsx-ast-utils/propName` to reduce bundle size
 * @see https://github.com/jsx-eslint/jsx-ast-utils/blob/main/src/propName.js
 */
export function getPropName(prop: Tree.JSXAttribute | Tree.JSXSpreadAttribute) {
  if (!prop.type || prop.type !== 'JSXAttribute')
    throw new Error('The prop must be a JSXAttribute collected by the AST parser.')
  if (prop.name.type === 'JSXNamespacedName')
    return `${prop.name.namespace.name}:${prop.name.name.name}`
  return prop.name.name
}

function resolveMemberExpressions(object: Tree.JSXMemberExpression | Tree.JSXTagNameExpression, property: Tree.JSXIdentifier): string {
  if (object.type === 'JSXMemberExpression')
    return `${resolveMemberExpressions(object.object, object.property)}.${property.name}`

  return `${object.name}.${property.name}`
}

/**
 * Returns the tagName associated with a JSXElement.
 *
 * Ported from `jsx-ast-utils/elementType` to reduce bundle size
 * @see https://github.com/jsx-eslint/jsx-ast-utils/blob/main/src/elementType.js
 */
export function getElementType(node: Tree.JSXOpeningElement | Tree.JSXOpeningFragment) {
  if (node.type === 'JSXOpeningFragment')
    return '<>'

  const { name } = node
  if (!name)
    throw new Error('The argument provided is not a JSXElement node.')

  if (name.type === 'JSXMemberExpression') {
    const { object, property } = name
    return resolveMemberExpressions(object, property)
  }

  if (name.type === 'JSXNamespacedName')
    return `${name.namespace.name}:${name.name.name}`

  return (node.name as Tree.JSXIdentifier).name
}
