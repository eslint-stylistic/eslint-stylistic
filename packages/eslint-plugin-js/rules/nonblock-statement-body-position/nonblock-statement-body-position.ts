/**
 * @fileoverview enforce the location of single-line statements
 * @author Teddy Katz
 */

import type { JSONSchema, Tree } from '@shared/types'
import { createRule } from '../../utils/createRule'
import type { MessageIds, RuleOptions } from './types'

type KeywordName = keyof NonNullable<NonNullable<RuleOptions['1']>['overrides']>

const POSITION_SCHEMA: JSONSchema.JSONSchema4 = {
  type: 'string',
  enum: ['beside', 'below', 'any'],
}

export default createRule<RuleOptions, MessageIds>({
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce the location of single-line statements',
      url: 'https://eslint.style/rules/js/nonblock-statement-body-position',
    },

    fixable: 'whitespace',

    schema: [
      POSITION_SCHEMA,
      {
        type: 'object',
        properties: {
          overrides: {
            type: 'object',
            properties: {
              if: POSITION_SCHEMA,
              else: POSITION_SCHEMA,
              while: POSITION_SCHEMA,
              do: POSITION_SCHEMA,
              for: POSITION_SCHEMA,
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      expectNoLinebreak: 'Expected no linebreak before this statement.',
      expectLinebreak: 'Expected a linebreak before this statement.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode

    /**
     * Gets the applicable preference for a particular keyword
     * @param keywordName The name of a keyword, e.g. 'if'
     * @returns The applicable option for the keyword, e.g. 'beside'
     */
    function getOption(keywordName: KeywordName) {
      return context.options[1] && context.options[1].overrides && context.options[1].overrides[keywordName]
        || context.options[0]
        || 'beside'
    }

    /**
     * Validates the location of a single-line statement
     * @param node The single-line statement
     * @param keywordName The applicable keyword name for the single-line statement
     */
    function validateStatement(node: Tree.Statement, keywordName: KeywordName) {
      const option = getOption(keywordName)

      if (node.type === 'BlockStatement' || option === 'any')
        return

      const tokenBefore = sourceCode.getTokenBefore(node)!

      if (tokenBefore.loc.end.line === node.loc.start.line && option === 'below') {
        context.report({
          node,
          messageId: 'expectLinebreak',
          fix: fixer => fixer.insertTextBefore(node, '\n'),
        })
      }
      else if (tokenBefore.loc.end.line !== node.loc.start.line && option === 'beside') {
        context.report({
          node,
          messageId: 'expectNoLinebreak',
          fix(fixer) {
            if (sourceCode.getText().slice(tokenBefore.range[1], node.range[0]).trim())
              return null

            return fixer.replaceTextRange([tokenBefore.range[1], node.range[0]], ' ')
          },
        })
      }
    }

    return {
      IfStatement(node) {
        validateStatement(node.consequent, 'if')

        // Check the `else` node, but don't check 'else if' statements.
        if (node.alternate && node.alternate.type !== 'IfStatement')
          validateStatement(node.alternate, 'else')
      },
      WhileStatement: node => validateStatement(node.body, 'while'),
      DoWhileStatement: node => validateStatement(node.body, 'do'),
      ForStatement: node => validateStatement(node.body, 'for'),
      ForInStatement: node => validateStatement(node.body, 'for'),
      ForOfStatement: node => validateStatement(node.body, 'for'),
    }
  },
})
