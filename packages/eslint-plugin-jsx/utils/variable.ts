/**
 * @fileoverview Utility functions for React components detection
 * @author Yannick Croissant
 */

import type { Rule, Scope } from 'eslint'

/**
 * Find and return a particular variable in a list
 * @param {Array} variables The variables list.
 * @param {string} name The name of the variable to search.
 * @returns {object} Variable if the variable was found, null if not.
 */
export function getVariable(variables: Scope.Variable[], name: string) {
  return variables.find(variable => variable.name === name)
}

/**
 * List all variable in a given scope
 *
 * Contain a patch for babel-eslint to avoid https://github.com/babel/babel-eslint/issues/21
 *
 * @param {object} context The current rule context.
 * @returns {Array} The variables list
 */
export function variablesInScope(context: Rule.RuleContext) {
  let scope = context.getScope()
  let variables = scope.variables

  while (scope.type !== 'global') {
    scope = scope.upper!
    variables = scope.variables.concat(variables)
  }
  if (scope.childScopes.length) {
    variables = scope.childScopes[0].variables.concat(variables)
    if (scope.childScopes[0].childScopes.length)
      variables = scope.childScopes[0].childScopes[0].variables.concat(variables)
  }
  variables.reverse()

  return variables
}

/**
 * Find a variable by name in the current scope.
 * @param {object} context The current rule context.
 * @param  {string} name Name of the variable to look for.
 * @returns {ASTNode|null} Return null if the variable could not be found, ASTNode otherwise.
 */
export function findVariableByName(context: Rule.RuleContext, name: string) {
  const variable = getVariable(variablesInScope(context), name)

  if (!variable || !variable.defs[0] || !variable.defs[0].node)
    return null

  if (variable.defs[0].node.type === 'TypeAlias')
    return variable.defs[0].node.right

  if (variable.defs[0].type === 'ImportBinding')
    return variable.defs[0].node

  return variable.defs[0].node.init
}

/**
 * Returns the latest definition of the variable.
 * @param {object} variable
 * @returns {object | undefined} The latest variable definition or undefined.
 */
export function getLatestVariableDefinition(variable: Scope.Variable) {
  return variable.defs[variable.defs.length - 1]
}
