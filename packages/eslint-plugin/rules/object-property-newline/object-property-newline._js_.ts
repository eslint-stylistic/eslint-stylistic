/**
 * @fileoverview Rule to enforce placing object properties on separate lines.
 * @author Vitor Balocco
 */

// MERGED: The JS version of this rule is merged to the TS version, this file will be removed
// in the next major when we remove the `@stylistic/eslint-plugin-js` package.

import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'object-property-newline',
  package: 'js',
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
          ObjectExpression: {
            oneOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  allowAllPropertiesOnSameLine: {
                    type: 'boolean',
                  },
                  allowMultiplePropertiesPerLine: { // Deprecated
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            ],
          },
          ObjectPattern: {
            oneOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  allowAllPropertiesOnSameLine: {
                    type: 'boolean',
                  },
                  allowMultiplePropertiesPerLine: { // Deprecated
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            ],
          },
          ImportDeclaration: {
            oneOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  allowAllPropertiesOnSameLine: {
                    type: 'boolean',
                  },
                  allowMultiplePropertiesPerLine: { // Deprecated
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            ],
          },
          ExportDeclaration: {
            oneOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  allowAllPropertiesOnSameLine: {
                    type: 'boolean',
                  },
                  allowMultiplePropertiesPerLine: { // Deprecated
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            ],
          },
          TSTypeLiteral: {
            oneOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  allowAllPropertiesOnSameLine: {
                    type: 'boolean',
                  },
                  allowMultiplePropertiesPerLine: { // Deprecated
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            ],
          },
          TSInterfaceBody: {
            oneOf: [
              {
                type: 'boolean',
              },
              {
                type: 'object',
                properties: {
                  allowAllPropertiesOnSameLine: {
                    type: 'boolean',
                  },
                  allowMultiplePropertiesPerLine: { // Deprecated
                    type: 'boolean',
                  },
                },
                additionalProperties: false,
              },
            ],
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

  create(context) {
    const options = context.options[0] || {}
    const sourceCode = context.sourceCode

    /**
     * Gets configuration for a specific node type
     * @param nodeType The type of node to get configuration for
     * @returns Configuration for the specified node type
     */
    function getOptionsForNodeType(nodeType: string): { allowSameLine: boolean } {
      // First check for specific node type configuration
      const nodeTypeOptions = typeof nodeType === 'string'
        && nodeType in options ? (options as Record<string, any>)[nodeType] : undefined

      if (nodeTypeOptions !== undefined) {
        if (typeof nodeTypeOptions === 'boolean') {
          // If it's a boolean, true means allow properties on same line, false means enforce newlines
          return { allowSameLine: nodeTypeOptions }
        }

        // It's an object with configuration
        return {
          allowSameLine: !!(
            nodeTypeOptions.allowAllPropertiesOnSameLine
            || nodeTypeOptions.allowMultiplePropertiesPerLine
          ),
        }
      }

      // Fall back to global options
      return {
        allowSameLine: !!(
          options.allowAllPropertiesOnSameLine
          || options.allowMultiplePropertiesPerLine
        ),
      }
    }

    /**
     * Checks properties of an object to enforce the rule
     * @param properties Array of properties to check
     * @param node Node representing the object
     * @param nodeType Type of node being checked
     */
    function checkProperties(properties: any[], node: any, nodeType?: string) {
      const { allowSameLine } = getOptionsForNodeType(nodeType || 'ObjectExpression')
      const messageId = allowSameLine
        ? 'propertiesOnNewlineAll'
        : 'propertiesOnNewline'

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
      ObjectExpression(node) {
        checkProperties(node.properties, node, 'ObjectExpression')
      },
      ObjectPattern(node) {
        checkProperties(node.properties, node, 'ObjectPattern')
      },
      // Add support for import declarations
      ImportDeclaration(node) {
        // Only check import declarations with named imports
        if (node.specifiers.some(specifier => specifier.type === 'ImportSpecifier')) {
          const importSpecifiers = node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier')
          checkProperties(importSpecifiers, node, 'ImportDeclaration')
        }
      },
      // Add support for export declarations
      ExportNamedDeclaration(node) {
        if (node.specifiers.some(specifier => specifier.type === 'ExportSpecifier')) {
          const exportSpecifiers = node.specifiers.filter(specifier => specifier.type === 'ExportSpecifier')
          checkProperties(exportSpecifiers, node, 'ExportDeclaration')
        }
      },
    }
  },
})
