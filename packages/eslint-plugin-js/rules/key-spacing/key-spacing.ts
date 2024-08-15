/**
 * @fileoverview Rule to specify spacing of object literal keys and values
 * @author Brandon Mills
 */

import type { MessageIds, RuleOptions } from './types'
import type { ASTNode, ReportFixFunction, Tree } from '#types'
import { LINEBREAK_MATCHER, getStaticPropertyName, isColonToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { getStringLength } from '#utils/string'

/**
 * Checks whether a string contains a line terminator as defined in
 * http://www.ecma-international.org/ecma-262/5.1/#sec-7.3
 * @param str String to test.
 * @returns True if str contains a line terminator.
 */
function containsLineTerminator(str: string) {
  return LINEBREAK_MATCHER.test(str)
}

/**
 * Gets the last element of an array.
 * @param arr An array.
 * @returns Last element of arr.
 */
function last<T>(arr: T[]): T {
  return arr[arr.length - 1]
}

/**
 * Checks whether a node is contained on a single line.
 * @param node AST Node being evaluated.
 * @returns True if the node is a single line.
 */
function isSingleLine(node: ASTNode) {
  return (node.loc.end.line === node.loc.start.line)
}

/**
 * Checks whether the properties on a single line.
 * @param properties List of Property AST nodes.
 * @returns True if all properties is on a single line.
 */
function isSingleLineProperties(properties: ASTNode[]) {
  const [firstProp] = properties
  const lastProp = last(properties)

  return firstProp.loc.start.line === lastProp.loc.end.line
}

/**
 * Initializes a single option property from the configuration with defaults for undefined values
 * @param toOptions Object to be initialized
 * @param fromOptions Object to be initialized from
 * @returns The object with correctly initialized options and values
 */
function initOptionProperty(toOptions: any, fromOptions: any) {
  toOptions.mode = fromOptions.mode || 'strict'

  // Set value of beforeColon
  if (typeof fromOptions.beforeColon !== 'undefined')
    toOptions.beforeColon = +fromOptions.beforeColon
  else
    toOptions.beforeColon = 0

  // Set value of afterColon
  if (typeof fromOptions.afterColon !== 'undefined')
    toOptions.afterColon = +fromOptions.afterColon
  else
    toOptions.afterColon = 1

  // Set align if exists
  if (typeof fromOptions.align !== 'undefined') {
    if (typeof fromOptions.align === 'object') {
      toOptions.align = fromOptions.align
    }
    else { // "string"
      toOptions.align = {
        on: fromOptions.align,
        mode: toOptions.mode,
        beforeColon: toOptions.beforeColon,
        afterColon: toOptions.afterColon,
      }
    }
  }

  return toOptions
}

/**
 * Initializes all the option values (singleLine, multiLine and align) from the configuration with defaults for undefined values
 * @param toOptions Object to be initialized
 * @param fromOptions Object to be initialized from
 * @returns The object with correctly initialized options and values
 */
function initOptions(toOptions: any, fromOptions: any) {
  if (typeof fromOptions.align === 'object') {
    // Initialize the alignment configuration
    toOptions.align = initOptionProperty({}, fromOptions.align)
    toOptions.align.on = fromOptions.align.on || 'colon'
    toOptions.align.mode = fromOptions.align.mode || 'strict'

    toOptions.multiLine = initOptionProperty({}, (fromOptions.multiLine || fromOptions))
    toOptions.singleLine = initOptionProperty({}, (fromOptions.singleLine || fromOptions))
  }
  else { // string or undefined
    toOptions.multiLine = initOptionProperty({}, (fromOptions.multiLine || fromOptions))
    toOptions.singleLine = initOptionProperty({}, (fromOptions.singleLine || fromOptions))

    // If alignment options are defined in multiLine, pull them out into the general align configuration
    if (toOptions.multiLine.align) {
      toOptions.align = {
        on: toOptions.multiLine.align.on,
        mode: toOptions.multiLine.align.mode || toOptions.multiLine.mode,
        beforeColon: toOptions.multiLine.align.beforeColon,
        afterColon: toOptions.multiLine.align.afterColon,
      }
    }
  }

  return toOptions
}

export default createRule<RuleOptions, MessageIds>({
  name: 'key-spacing',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce consistent spacing between keys and values in object literal properties',
    },

    fixable: 'whitespace',

    schema: [{
      anyOf: [
        {
          type: 'object',
          properties: {
            align: {
              anyOf: [
                {
                  type: 'string',
                  enum: ['colon', 'value'],
                },
                {
                  type: 'object',
                  properties: {
                    mode: {
                      type: 'string',
                      enum: ['strict', 'minimum'],
                    },
                    on: {
                      type: 'string',
                      enum: ['colon', 'value'],
                    },
                    beforeColon: {
                      type: 'boolean',
                    },
                    afterColon: {
                      type: 'boolean',
                    },
                  },
                  additionalProperties: false,
                },
              ],
            },
            mode: {
              type: 'string',
              enum: ['strict', 'minimum'],
            },
            beforeColon: {
              type: 'boolean',
            },
            afterColon: {
              type: 'boolean',
            },
          },
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            singleLine: {
              type: 'object',
              properties: {
                mode: {
                  type: 'string',
                  enum: ['strict', 'minimum'],
                },
                beforeColon: {
                  type: 'boolean',
                },
                afterColon: {
                  type: 'boolean',
                },
              },
              additionalProperties: false,
            },
            multiLine: {
              type: 'object',
              properties: {
                align: {
                  anyOf: [
                    {
                      type: 'string',
                      enum: ['colon', 'value'],
                    },
                    {
                      type: 'object',
                      properties: {
                        mode: {
                          type: 'string',
                          enum: ['strict', 'minimum'],
                        },
                        on: {
                          type: 'string',
                          enum: ['colon', 'value'],
                        },
                        beforeColon: {
                          type: 'boolean',
                        },
                        afterColon: {
                          type: 'boolean',
                        },
                      },
                      additionalProperties: false,
                    },
                  ],
                },
                mode: {
                  type: 'string',
                  enum: ['strict', 'minimum'],
                },
                beforeColon: {
                  type: 'boolean',
                },
                afterColon: {
                  type: 'boolean',
                },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
        {
          type: 'object',
          properties: {
            singleLine: {
              type: 'object',
              properties: {
                mode: {
                  type: 'string',
                  enum: ['strict', 'minimum'],
                },
                beforeColon: {
                  type: 'boolean',
                },
                afterColon: {
                  type: 'boolean',
                },
              },
              additionalProperties: false,
            },
            multiLine: {
              type: 'object',
              properties: {
                mode: {
                  type: 'string',
                  enum: ['strict', 'minimum'],
                },
                beforeColon: {
                  type: 'boolean',
                },
                afterColon: {
                  type: 'boolean',
                },
              },
              additionalProperties: false,
            },
            align: {
              type: 'object',
              properties: {
                mode: {
                  type: 'string',
                  enum: ['strict', 'minimum'],
                },
                on: {
                  type: 'string',
                  enum: ['colon', 'value'],
                },
                beforeColon: {
                  type: 'boolean',
                },
                afterColon: {
                  type: 'boolean',
                },
              },
              additionalProperties: false,
            },
          },
          additionalProperties: false,
        },
      ],
    }],
    messages: {
      extraKey: 'Extra space after {{computed}}key \'{{key}}\'.',
      extraValue: 'Extra space before value for {{computed}}key \'{{key}}\'.',
      missingKey: 'Missing space after {{computed}}key \'{{key}}\'.',
      missingValue: 'Missing space before value for {{computed}}key \'{{key}}\'.',
    },
  },

  create(context) {
    /**
     * OPTIONS
     * "key-spacing": [2, {
     *     beforeColon: false,
     *     afterColon: true,
     *     align: "colon" // Optional, or "value"
     * }
     */
    const options = context.options[0] || {}
    const ruleOptions = initOptions({}, options)
    const multiLineOptions = ruleOptions.multiLine
    const singleLineOptions = ruleOptions.singleLine
    const alignmentOptions = ruleOptions.align || null

    const sourceCode = context.sourceCode

    /**
     * Determines if the given property is key-value property.
     * @param property Property node to check.
     * @returns Whether the property is a key-value property.
     */
    function isKeyValueProperty(property: Tree.ObjectLiteralElement): property is Tree.Property {
      return !(
        (('method' in property && property.method)
        || ('shorthand' in property && property.shorthand)
        || ('kind' in property && property.kind !== 'init') || property.type !== 'Property') // Could be "ExperimentalSpreadProperty" or "SpreadElement"
      )
    }

    /**
     * Starting from the given node (a property.key node here) looks forward
     * until it finds the colon punctuator and returns it.
     * @param node The node to start looking from.
     * @returns The colon punctuator.
     */
    function getNextColon(node: ASTNode) {
      return sourceCode.getTokenAfter(node, isColonToken)
    }

    /**
     * Starting from the given node (a property.key node here) looks forward
     * until it finds the last token before a colon punctuator and returns it.
     * @param node The node to start looking from.
     * @returns The last token before a colon punctuator.
     */
    function getLastTokenBeforeColon(node: ASTNode) {
      const colonToken = getNextColon(node)!

      return sourceCode.getTokenBefore(colonToken)
    }

    /**
     * Starting from the given node (a property.key node here) looks forward
     * until it finds the first token after a colon punctuator and returns it.
     * @param node The node to start looking from.
     * @returns The first token after a colon punctuator.
     */
    function getFirstTokenAfterColon(node: ASTNode) {
      const colonToken = getNextColon(node)!

      return sourceCode.getTokenAfter(colonToken)
    }

    /**
     * Checks whether a property is a member of the property group it follows.
     * @param lastMember The last Property known to be in the group.
     * @param candidate The next Property that might be in the group.
     * @returns True if the candidate property is part of the group.
     */
    function continuesPropertyGroup(lastMember: Tree.ObjectLiteralElement, candidate: Tree.ObjectLiteralElement) {
      const groupEndLine = lastMember.loc.start.line
      const candidateValueStartLine = (isKeyValueProperty(candidate) ? getFirstTokenAfterColon(candidate.key)! : candidate).loc.start.line

      if (candidateValueStartLine - groupEndLine <= 1)
        return true

      /**
       * Check that the first comment is adjacent to the end of the group, the
       * last comment is adjacent to the candidate property, and that successive
       * comments are adjacent to each other.
       */
      const leadingComments = sourceCode.getCommentsBefore(candidate)

      if (
        leadingComments.length
        && leadingComments[0].loc.start.line - groupEndLine <= 1
        && candidateValueStartLine - last(leadingComments).loc.end.line <= 1
      ) {
        for (let i = 1; i < leadingComments.length; i++) {
          if (leadingComments[i].loc.start.line - leadingComments[i - 1].loc.end.line > 1)
            return false
        }
        return true
      }

      return false
    }

    /**
     * Gets an object literal property's key as the identifier name or string value.
     * @param property Property node whose key to retrieve.
     * @returns The property's key.
     */
    function getKey(property: Tree.Property) {
      const key = property.key

      if (property.computed)
        return sourceCode.getText().slice(key.range[0], key.range[1])

      return getStaticPropertyName(property)
    }

    /**
     * Reports an appropriately-formatted error if spacing is incorrect on one
     * side of the colon.
     * @param property Key-value pair in an object literal.
     * @param side Side being verified - either "key" or "value".
     * @param whitespace Actual whitespace string.
     * @param expected Expected whitespace length.
     * @param mode Value of the mode as "strict" or "minimum"
     */
    function report(property: Tree.Property, side: 'key' | 'value', whitespace: string, expected: number, mode: 'strict' | 'minimum') {
      const diff = whitespace.length - expected

      if ((
        diff && mode === 'strict'
        || diff < 0 && mode === 'minimum'
        || diff > 0 && !expected && mode === 'minimum')
        && !(expected && containsLineTerminator(whitespace))
      ) {
        const nextColon = getNextColon(property.key)!
        const tokenBeforeColon = sourceCode.getTokenBefore(nextColon, { includeComments: true })!
        const tokenAfterColon = sourceCode.getTokenAfter(nextColon, { includeComments: true })!
        const isKeySide = side === 'key'
        const isExtra = diff > 0
        const diffAbs = Math.abs(diff)
        const spaces = Array(diffAbs + 1).join(' ')

        const locStart = isKeySide ? tokenBeforeColon.loc.end : nextColon.loc.start
        const locEnd = isKeySide ? nextColon.loc.start : tokenAfterColon.loc.start
        const missingLoc = isKeySide ? tokenBeforeColon.loc : tokenAfterColon.loc
        const loc = isExtra ? { start: locStart, end: locEnd } : missingLoc

        let fix: ReportFixFunction

        if (isExtra) {
          let range: [number, number]

          // Remove whitespace
          if (isKeySide)
            range = [tokenBeforeColon.range[1], tokenBeforeColon.range[1] + diffAbs]
          else
            range = [tokenAfterColon.range[0] - diffAbs, tokenAfterColon.range[0]]

          fix = function (fixer) {
            return fixer.removeRange(range)
          }
        }
        else {
          // Add whitespace
          if (isKeySide) {
            fix = function (fixer) {
              return fixer.insertTextAfter(tokenBeforeColon, spaces)
            }
          }
          else {
            fix = function (fixer) {
              return fixer.insertTextBefore(tokenAfterColon, spaces)
            }
          }
        }

        let messageId: 'extraKey' | 'extraValue' | 'missingKey' | 'missingValue'

        if (isExtra)
          messageId = side === 'key' ? 'extraKey' : 'extraValue'
        else
          messageId = side === 'key' ? 'missingKey' : 'missingValue'

        context.report({
          node: property[side],
          loc,
          messageId,
          data: {
            computed: property.computed ? 'computed ' : '',
            key: getKey(property),
          },
          fix,
        })
      }
    }

    /**
     * Gets the number of characters in a key, including quotes around string
     * keys and braces around computed property keys.
     * @param property Property of on object literal.
     * @returns Width of the key.
     */
    function getKeyWidth(property: Tree.Property) {
      const startToken = sourceCode.getFirstToken(property)!
      const endToken = getLastTokenBeforeColon(property.key)!

      return getStringLength(sourceCode.getText().slice(startToken.range[0], endToken.range[1]))
    }

    /**
     * Gets the whitespace around the colon in an object literal property.
     * @param property Property node from an object literal.
     * @returns Whitespace before and after the property's colon.
     */
    function getPropertyWhitespace(property: Tree.Property) {
      const whitespace = /(\s*):(\s*)/u.exec(sourceCode.getText().slice(
        property.key.range[1],
        property.value.range[0],
      ))

      if (whitespace) {
        return {
          beforeColon: whitespace[1],
          afterColon: whitespace[2],
        }
      }
      return null
    }

    /**
     * Creates groups of properties.
     * @param node ObjectExpression node being evaluated.
     * @returns Groups of property AST node lists.
     */
    function createGroups(node: Tree.ObjectExpression) {
      if (node.properties.length === 1)
        return [node.properties]

      return node.properties.reduce<Tree.ObjectLiteralElement[][]>((groups, property) => {
        const currentGroup = last(groups)
        const prev = last(currentGroup)

        if (!prev || continuesPropertyGroup(prev, property))
          currentGroup.push(property)
        else
          groups.push([property])

        return groups
      }, [
        [],
      ])
    }

    /**
     * Verifies correct vertical alignment of a group of properties.
     * @param properties List of Property AST nodes.
     */
    function verifyGroupAlignment(properties: Tree.Property[]) {
      const length = properties.length
      const widths = properties.map(getKeyWidth) // Width of keys, including quotes
      const align = alignmentOptions.on // "value" or "colon"
      let targetWidth = Math.max(...widths)
      let beforeColon; let afterColon; let mode

      if (alignmentOptions && length > 1) { // When aligning values within a group, use the alignment configuration.
        beforeColon = alignmentOptions.beforeColon
        afterColon = alignmentOptions.afterColon
        mode = alignmentOptions.mode
      }
      else {
        beforeColon = multiLineOptions.beforeColon
        afterColon = multiLineOptions.afterColon
        mode = alignmentOptions.mode
      }

      // Conditionally include one space before or after colon
      targetWidth += (align === 'colon' ? beforeColon : afterColon)

      for (let i = 0; i < length; i++) {
        const property = properties[i]
        const whitespace = getPropertyWhitespace(property)

        if (whitespace) { // Object literal getters/setters lack a colon
          const width = widths[i]

          if (align === 'value') {
            report(property, 'key', whitespace.beforeColon, beforeColon, mode)
            report(property, 'value', whitespace.afterColon, targetWidth - width, mode)
          }
          else { // align = "colon"
            report(property, 'key', whitespace.beforeColon, targetWidth - width, mode)
            report(property, 'value', whitespace.afterColon, afterColon, mode)
          }
        }
      }
    }

    /**
     * Verifies spacing of property conforms to specified options.
     * @param node Property node being evaluated.
     * @param lineOptions Configured singleLine or multiLine options
     */
    function verifySpacing(node: Tree.Property, lineOptions: { beforeColon: number, afterColon: number, mode: 'strict' | 'minimum' }) {
      const actual = getPropertyWhitespace(node)

      if (actual) { // Object literal getters/setters lack colons
        report(node, 'key', actual.beforeColon, lineOptions.beforeColon, lineOptions.mode)
        report(node, 'value', actual.afterColon, lineOptions.afterColon, lineOptions.mode)
      }
    }

    /**
     * Verifies spacing of each property in a list.
     * @param properties List of Property AST nodes.
     * @param lineOptions Configured singleLine or multiLine options
     */
    function verifyListSpacing(properties: Tree.Property[], lineOptions: { beforeColon: number, afterColon: number, mode: 'strict' | 'minimum' }) {
      const length = properties.length

      for (let i = 0; i < length; i++)
        verifySpacing(properties[i], lineOptions)
    }

    /**
     * Verifies vertical alignment, taking into account groups of properties.
     * @param node ObjectExpression node being evaluated.
     */
    function verifyAlignment(node: Tree.ObjectExpression) {
      createGroups(node).forEach((group) => {
        const properties = group.filter(isKeyValueProperty)

        if (properties.length > 0 && isSingleLineProperties(properties))
          verifyListSpacing(properties, multiLineOptions)
        else
          verifyGroupAlignment(properties)
      })
    }

    if (alignmentOptions) { // Verify vertical alignment
      return {
        ObjectExpression(node) {
          if (isSingleLine(node))
            verifyListSpacing(node.properties.filter(isKeyValueProperty), singleLineOptions)
          else
            verifyAlignment(node)
        },
      }
    }

    // Obey beforeColon and afterColon in each property as configured
    return {
      Property(node) {
        verifySpacing(node, isSingleLine(node.parent) ? singleLineOptions : multiLineOptions)
      },
    }
  },
})
