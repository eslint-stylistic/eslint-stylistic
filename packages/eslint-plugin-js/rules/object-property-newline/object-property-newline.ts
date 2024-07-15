/**
 * @fileoverview Rule to enforce placing object properties on separate lines.
 * @author Vitor Balocco
 */

import type { Tree } from '@shared/types'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { createTSRule } from '../../utils/'
import type { MessageIds, RuleOptions } from './types'

export default createTSRule<RuleOptions, MessageIds>({
  name: 'object-property-newline',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce placing object properties on separate lines',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowAllPropertiesOnSameLine: {
            type: 'boolean',
            default: false,
          },
          allowMultiplePropertiesPerLine: { // Deprecated
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    fixable: 'whitespace',
    messages: {
      propertiesOnNewlineAll: 'Object properties must go on a new line if they aren\'t all on the same line.',
      propertiesOnNewline: 'Object properties must go on a new line.',
    },
  },
  defaultOptions: [
    {
      allowAllPropertiesOnSameLine: false,
      allowMultiplePropertiesPerLine: false,
    },
  ],

  create(context) {
    const allowSameLine = context.options[0] && (
      (context.options[0].allowAllPropertiesOnSameLine || context.options[0].allowMultiplePropertiesPerLine /* Deprecated */)
    )
    const messageId = allowSameLine
      ? 'propertiesOnNewlineAll'
      : 'propertiesOnNewline'

    const sourceCode = context.sourceCode

    function checkPropertyLines(node: Tree.ObjectExpression | Tree.TSTypeLiteral | Tree.TSInterfaceBody) {
      const properties = node.type === AST_NODE_TYPES.ObjectExpression
        ? node.properties
        : node.type === AST_NODE_TYPES.TSTypeLiteral
          ? node.members : node.body

      if (allowSameLine) {
        if (properties.length > 1) {
          const firstTokenOfFirstProperty = sourceCode.getFirstToken(properties[0])!
          const lastTokenOfLastProperty = sourceCode.getLastToken(properties[properties.length - 1])!

          if (firstTokenOfFirstProperty.loc.end.line === lastTokenOfLastProperty.loc.start.line) {
            // All keys and values are on the same line
            return
          }
        }
      }

      for (let i = 1; i < properties.length; i++) {
        const lastTokenOfPreviousProperty = sourceCode.getLastToken(properties[i - 1])!
        const firstTokenOfCurrentProperty = sourceCode.getFirstToken(properties[i])!

        if (lastTokenOfPreviousProperty.loc.end.line === firstTokenOfCurrentProperty.loc.start.line) {
          context.report({
            node,
            loc: firstTokenOfCurrentProperty.loc,
            messageId,
            fix(fixer) {
              const comma = sourceCode.getTokenBefore(firstTokenOfCurrentProperty)!
              const rangeAfterComma = [comma.range[1], firstTokenOfCurrentProperty.range[0]] as const

              // Don't perform a fix if there are any comments between the comma and the next property.
              if (sourceCode.text.slice(rangeAfterComma[0], rangeAfterComma[1]).trim())
                return null

              return fixer.replaceTextRange(rangeAfterComma, '\n')
            },
          })
        }
      }
    }

    return {
      ObjectExpression: checkPropertyLines,
      TSTypeLiteral: checkPropertyLines,
      TSInterfaceBody: checkPropertyLines,
    }
  },
})
