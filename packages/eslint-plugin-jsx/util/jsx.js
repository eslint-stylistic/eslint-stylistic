/**
 * @fileoverview Utility functions for JSX
 */
import { traverseReturns } from './ast'
import { isCreateElement } from './isCreateElement'
import { findVariableByName } from './variable'

// See https://github.com/babel/babel/blob/ce420ba51c68591e057696ef43e028f41c6e04cd/packages/babel-types/src/validators/react/isCompatTag.js
// for why we only test for the first character
const COMPAT_TAG_REGEX = /^[a-z]/

/**
 * Checks if a node represents a DOM element according to React.
 * @param {object} node - JSXOpeningElement to check.
 * @returns {boolean} Whether or not the node corresponds to a DOM element.
 */
function isDOMComponent(node) {
  const name = getElementType(node)
  return COMPAT_TAG_REGEX.test(name)
}

/**
 * Checks if a node represents a JSX element or fragment.
 * @param {object} node - node to check.
 * @returns {boolean} Whether or not the node if a JSX element or fragment.
 */
function isJSX(node) {
  return node && ['JSXElement', 'JSXFragment'].includes(node.type)
}

/**
 * Check if value has only whitespaces
 * @param {string} value
 * @returns {boolean}
 */
function isWhiteSpaces(value) {
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
function isReturningJSX(ASTnode, context, strict, ignoreNull) {
  const isJSXValue = (node) => {
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
function getPropName(prop = {}) {
  if (!prop.type || prop.type !== 'JSXAttribute')
    throw new Error('The prop must be a JSXAttribute collected by the AST parser.')
  if (prop.name.type === 'JSXNamespacedName')
    return `${prop.name.namespace.name}:${prop.name.name.name}`
  return prop.name.name
}

function resolveMemberExpressions(object = {}, property = {}) {
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
function getElementType(node = {}) {
  const { name } = node

  if (node.type === 'JSXOpeningFragment')
    return '<>'

  if (!name)
    throw new Error('The argument provided is not a JSXElement node.')

  if (name.type === 'JSXMemberExpression') {
    const { object = {}, property = {} } = name
    return resolveMemberExpressions(object, property)
  }

  if (name.type === 'JSXNamespacedName')
    return `${name.namespace.name}:${name.name.name}`

  return node.name.name
}

export {
  isDOMComponent,
  isJSX,
  isWhiteSpaces,
  isReturningJSX,
  getPropName,
}
