/**
 * @fileoverview Rule to ensure newline per method call when chaining calls
 * @author Rajendra Patil
 * @author Burak Yigit Kaya
 */

import { LINEBREAK_MATCHER, isNotClosingParenToken, isTokenOnSameLine, skipChainExpression } from '../../utils/ast-utils'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'layout',

    docs: {
      description: 'Require a newline after each call in a method chain',
      url: 'https://eslint.style/rules/js/newline-per-chained-call',
    },

    fixable: 'whitespace',

    schema: [{
      type: 'object',
      properties: {
        ignoreChainWithDepth: {
          type: 'integer',
          minimum: 1,
          maximum: 10,
          default: 2,
        },
      },
      additionalProperties: false,
    }],
    messages: {
      expected: 'Expected line break before `{{callee}}`.',
    },
  },

  create(context) {
    const options = context.options[0] || {}
    const ignoreChainWithDepth = options.ignoreChainWithDepth || 2

    const sourceCode = context.sourceCode

    /**
     * Get the prefix of a given MemberExpression node.
     * If the MemberExpression node is a computed value it returns a
     * left bracket. If not it returns a period.
     * @param {ASTNode} node A MemberExpression node to get
     * @returns {string} The prefix of the node.
     */
    function getPrefix(node) {
      if (node.computed) {
        if (node.optional)
          return '?.['

        return '['
      }
      if (node.optional)
        return '?.'

      return '.'
    }

    /**
     * Gets the property text of a given MemberExpression node.
     * If the text is multiline, this returns only the first line.
     * @param {ASTNode} node A MemberExpression node to get.
     * @returns {string} The property text of the node.
     */
    function getPropertyText(node) {
      const prefix = getPrefix(node)
      const lines = sourceCode.getText(node.property).split(LINEBREAK_MATCHER)
      const suffix = node.computed && lines.length === 1 ? ']' : ''

      return prefix + lines[0] + suffix
    }

    return {
      'CallExpression:exit': function (node) {
        const callee = skipChainExpression(node.callee)

        if (callee.type !== 'MemberExpression')
          return

        let parent = skipChainExpression(callee.object)
        let depth = 1

        while (parent && parent.callee) {
          depth += 1
          parent = skipChainExpression(skipChainExpression(parent.callee).object)
        }

        if (depth > ignoreChainWithDepth && isTokenOnSameLine(callee.object, callee.property)) {
          const firstTokenAfterObject = sourceCode.getTokenAfter(callee.object, isNotClosingParenToken)

          context.report({
            node: callee.property,
            loc: {
              start: firstTokenAfterObject.loc.start,
              end: callee.loc.end,
            },
            messageId: 'expected',
            data: {
              callee: getPropertyText(callee),
            },
            fix(fixer) {
              return fixer.insertTextBefore(firstTokenAfterObject, '\n')
            },
          })
        }
      },
    }
  },
}
