/**
 * @fileoverview Utility functions for React components detection
 * @author Yannick Croissant
 */

import type { Scope as ESLintScope } from 'eslint'
import type { RuleContext, Scope } from './types'

/**
 * Find and return a particular variable in a list
 * @param variables The variables list.
 * @param name The name of the variable to search.
 * @returns Variable if the variable was found, null if not.
 */
export function getVariable(variables: Scope.Variable[], name: string) {
  return variables.find(variable => variable.name === name)
}

/**
 * List all variable in a given scope
 *
 * Contain a patch for babel-eslint to avoid https://github.com/babel/babel-eslint/issues/21
 *
 * @param context The current rule context.
 * @returns The variables list
 */
export function variablesInScope(context: RuleContext<any, any>) {
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
 * @param context The current rule context.
 * @param  {string} name Name of the variable to look for.
 * @returns Return null if the variable could not be found, ASTNode otherwise.
 */
export function findVariableByName(context: RuleContext<any, any>, name: string) {
  const variable = getVariable(variablesInScope(context), name) as ESLintScope.Variable | undefined

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
 * @param variable
 * @returns The latest variable definition or undefined.
 */
export function getLatestVariableDefinition(variable: Scope.Variable) {
  return variable.defs[variable.defs.length - 1]
}
