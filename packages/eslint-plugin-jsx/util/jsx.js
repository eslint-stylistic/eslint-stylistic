/**
 * @fileoverview Utility functions for JSX
 */

'use strict'

const astUtil = require('./ast')
const isCreateElement = require('./isCreateElement')
const variableUtil = require('./variable')

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
 * Test whether a JSXElement is a fragment
 * @param {JSXElement} node
 * @param {string} reactPragma
 * @param {string} fragmentPragma
 * @returns {boolean}
 */
function isFragment(node, reactPragma, fragmentPragma) {
  const name = node.openingElement.name

  // <Fragment>
  if (name.type === 'JSXIdentifier' && name.name === fragmentPragma)
    return true

  // <React.Fragment>
  if (
    name.type === 'JSXMemberExpression'
    && name.object.type === 'JSXIdentifier'
    && name.object.name === reactPragma
    && name.property.type === 'JSXIdentifier'
    && name.property.name === fragmentPragma
  )
    return true

  return false
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
 * Check if node is like `key={...}` as in `<Foo key={...} />`
 * @param {ASTNode} node
 * @returns {boolean}
 */
function isJSXAttributeKey(node) {
  return node.type === 'JSXAttribute'
    && node.name
    && node.name.type === 'JSXIdentifier'
    && node.name.name === 'key'
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
        const variable = variableUtil.findVariableByName(context, node.name)
        return isJSX(variable)
      }
      default:
        return false
    }
  }

  let found = false
  astUtil.traverseReturns(ASTnode, context, (node, breakTraverse) => {
    if (isJSXValue(node)) {
      found = true
      breakTraverse()
    }
  })

  return found
}

/**
 * Check if the node is returning only null values
 *
 * @param {ASTNode} ASTnode The AST node being checked
 * @param {Context} context The context of `ASTNode`.
 * @returns {boolean} True if the node is returning only null values
 */
function isReturningOnlyNull(ASTnode, context) {
  let found = false
  let foundSomethingElse = false
  astUtil.traverseReturns(ASTnode, context, (node) => {
    // Traverse return statement
    astUtil.traverse(node, {
      enter(childNode) {
        const setFound = () => {
          found = true
          this.skip()
        }
        const setFoundSomethingElse = () => {
          foundSomethingElse = true
          this.skip()
        }
        switch (childNode.type) {
          case 'ReturnStatement':
            break
          case 'ConditionalExpression':
            if (childNode.consequent.value === null && childNode.alternate.value === null)
              setFound()

            break
          case 'Literal':
            if (childNode.value === null)
              setFound()

            break
          default:
            setFoundSomethingElse()
        }
      },
    })
  })

  return found && !foundSomethingElse
}

/**
 * Ported from `jsx-ast-utils/propName` to reduce bundle size
 */
function getPropName(...args) {
  const prop = args.length > 0 && args[0] !== undefined ? args[0] : {}
  if (!prop.type || prop.type !== 'JSXAttribute')
    throw new Error('The prop must be a JSXAttribute collected by the AST parser.')
  if (prop.name.type === 'JSXNamespacedName')
    return `${prop.name.namespace.name}:${prop.name.name.name}`
  return prop.name.name
}

function resolveMemberExpressions(...args) {
  const object = args.length > 0 && args[0] !== undefined ? args[0] : {}
  const property = args.length > 1 && args[1] !== undefined ? args[1] : {}

  if (object.type === 'JSXMemberExpression')
    return `${resolveMemberExpressions(object.object, object.property)}.${property.name}`

  return `${object.name}.${property.name}`
}

/**
 * Returns the tagName associated with a JSXElement.
 * Ported from `jsx-ast-utils/elementType` to reduce bundle size
 */
function getElementType(...args) {
  const node = args.length > 0 && args[0] !== undefined ? args[0] : {}
  const name = node.name

  if (node.type === 'JSXOpeningFragment')
    return '<>'

  if (!name)
    throw new Error('The argument provided is not a JSXElement node.')

  if (name.type === 'JSXMemberExpression') {
    const _name$object = name.object
    const object = _name$object === undefined ? {} : _name$object
    const _name$property = name.property
    const property = _name$property === undefined ? {} : _name$property

    return resolveMemberExpressions(object, property)
  }

  if (name.type === 'JSXNamespacedName')
    return `${name.namespace.name}:${name.name.name}`

  return node.name.name
}

module.exports = {
  isDOMComponent,
  isFragment,
  isJSX,
  isJSXAttributeKey,
  isWhiteSpaces,
  isReturningJSX,
  isReturningOnlyNull,
  getPropName,
}
