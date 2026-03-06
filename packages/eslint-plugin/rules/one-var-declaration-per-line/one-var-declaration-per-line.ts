import type { NodeTypes, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'one-var-declaration-per-line',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow newlines around variable declarations',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'string',
        enum: ['always', 'initializations'],
      },
    ],
    defaultOptions: ['initializations'],
    messages: {
      expectVarOnNewline: 'Expected variable declaration to be on a new line.',
    },
  },
  create(context, [style]) {
    const { sourceCode } = context
    const always = style === 'always'

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

      for (let i = 1; i < declarations.length; i++) {
        const prev = declarations[i - 1]
        const current = declarations[i]

        if (isTokenOnSameLine(prev, current)) {
          if (always || prev.init || current.init) {
            context.report({
              node,
              messageId: 'expectVarOnNewline',
              loc: current.loc,
              fix: (fixer) => {
                const tokenBefore = sourceCode.getTokenBefore(current)!
                return fixer.insertTextAfterRange([tokenBefore.range[1], current.range[0]], '\n')
              },
            })
          }
        }
      }
    }

    return {
      VariableDeclaration: checkForNewLine,
    }
  },
})
