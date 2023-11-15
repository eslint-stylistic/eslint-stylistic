/**
 * @fileoverview Rule to check multiple var declarations per line
 * @author Alberto Rodríguez
 */

import { createRule } from '../../utils/createRule'
import type { NodeTypes, Tree } from '../../utils/types'
import type { MessageIds, RuleOptions } from './types'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

export default createRule<MessageIds, RuleOptions>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Require or disallow newlines around variable declarations',
      url: 'https://eslint.style/rules/js/one-var-declaration-per-line',
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

    // --------------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------------

    /**
     * Determine if provided keyword is a variant of for specifiers
     * @private
     * @param {string} keyword keyword to test
     * @returns {boolean} True if `keyword` is a variant of for specifier
     */
    function isForTypeSpecifier(keyword: NodeTypes) {
      return keyword === 'ForStatement' || keyword === 'ForInStatement' || keyword === 'ForOfStatement'
    }

    /**
     * Checks newlines around variable declarations.
     * @private
     * @param {ASTNode} node `VariableDeclaration` node to test
     * @returns {void}
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

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      VariableDeclaration: checkForNewLine,
    }
  },
})
