/**
 * @fileoverview Utility functions for React pragma configuration
 * @author Yannick Croissant
 */

import type { RuleContext } from './types'

const JSX_ANNOTATION_REGEX = /@jsx\s+([^\s]+)/
// Does not check for reserved keywords or unicode characters
const JS_IDENTIFIER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/

/**
 * @param context
 */
export function getFromContext(context: RuleContext<any, any>): string {
  let pragma = 'React'

  const sourceCode = context.getSourceCode()
  const pragmaNode = sourceCode.getAllComments().find(node => JSX_ANNOTATION_REGEX.test(node.value))

  if (pragmaNode) {
    const matches = JSX_ANNOTATION_REGEX.exec(pragmaNode.value)!
    pragma = matches[1].split('.')[0]
    // .eslintrc shared settings (https://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  }
  // @ts-expect-error missing types
  else if (context.settings.react && context.settings.react.pragma) {
    // @ts-expect-error missing types
    pragma = context.settings.react.pragma
  }

  if (!JS_IDENTIFIER_REGEX.test(pragma))
    throw new Error(`React pragma ${pragma} is not a valid identifier`)

  return pragma
}
