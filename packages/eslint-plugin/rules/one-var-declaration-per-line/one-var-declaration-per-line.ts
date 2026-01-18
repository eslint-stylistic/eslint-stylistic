/**
 * @fileoverview Rule to check multiple var declarations per line
 * @author Alberto Rodríguez
 */

import type { NodeTypes, RuleFixer, Tree } from '#types'
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
    defaultOptions: [],
    messages: {
      expectVarOnNewline: 'Expected variable declaration to be on a new line.',
    },
  },
  create(context) {
    const { sourceCode } = context
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
        if (prev && isTokenOnSameLine(prev, current)) {
          if (always || prev.init || current.init) {
            let fix = (fixer: RuleFixer) => fixer.insertTextBefore(current, '\n')
            const tokenBeforeDeclarator = sourceCode.getTokenBefore(current, { includeComments: false })
            if (tokenBeforeDeclarator) {
              const betweenText = sourceCode.text.slice(
                tokenBeforeDeclarator.range[1],
                current.range[0],
              )
              fix = fixer => fixer.replaceTextRange([tokenBeforeDeclarator!.range[1], current.range[0]], `${betweenText}\n`)
            }
            context.report({
              node,
              messageId: 'expectVarOnNewline',
              loc: current.loc,
              fix,
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
