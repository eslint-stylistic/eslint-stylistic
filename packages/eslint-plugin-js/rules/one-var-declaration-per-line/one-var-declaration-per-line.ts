/**
 * @fileoverview Rule to check multiple var declarations per line
 * @author Alberto Rodríguez
 */

import type { NodeTypes, Tree } from '@shared/types'
import { createRule } from '../../../utils'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  name: 'one-var-declaration-per-line',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Require or disallow newlines around variable declarations',
    },

    schema: [
      {
        type: 'string',
        enum: ['always', 'initializations'],
      },
    ],

    fixable: 'whitespace',

    messages: {
      expectVarOnNewline: 'Expected variable declaration to be on a new line.',
    },
  },

  create(context) {
    const always = context.options[0] === 'always'

    /**
     * Determine if provided keyword is a variant of for specifiers
     * @private
     * @param keyword keyword to test
     * @returns True if `keyword` is a variant of for specifier
     */
    function isForTypeSpecifier(keyword: NodeTypes) {
      return keyword === 'ForStatement' || keyword === 'ForInStatement' || keyword === 'ForOfStatement'
    }

    /**
     * Checks newlines around variable declarations.
     * @private
     * @param node `VariableDeclaration` node to test
     */
    function checkForNewLine(node: Tree.VariableDeclaration) {
      if (isForTypeSpecifier(node.parent.type))
        return

      const declarations = node.declarations
      let prev: Tree.LetOrConstOrVarDeclarator

      declarations.forEach((current) => {
        if (prev && prev.loc.end.line === current.loc.start.line) {
          if (always || prev.init || current.init) {
            context.report({
              node,
              messageId: 'expectVarOnNewline',
              loc: current.loc,
              fix: fixer => fixer.insertTextBefore(current, '\n'),
            })
          }
        }
        prev = current
      })
    }

    return {
      VariableDeclaration: checkForNewLine,
    }
  },
})
