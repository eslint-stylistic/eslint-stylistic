import type { ASTNode, ReportFixFunction, RuleListener, SourceCode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  AST_NODE_TYPES,
  getStaticPropertyName,
  isClosingBraceToken,
  isClosingBracketToken,
  isColonToken,
  isOpeningBraceToken,
  isTokenOnSameLine,
  LINEBREAK_MATCHER,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { getStringLength } from '#utils/string'

const listeningNodes = [
  'ObjectExpression',
  'ObjectPattern',
  'ImportDeclaration',
  'ExportNamedDeclaration',
  'ExportAllDeclaration',

  'TSTypeLiteral',
  'TSInterfaceBody',
  'ClassBody',
] satisfies (keyof typeof Tree.AST_NODE_TYPES)[]

type UnionToIntersection<U>
  = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type OptionsUnion = UnionToIntersection<Exclude<RuleOptions[0], undefined>>

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
  toOptions.ignoredNodes = fromOptions.ignoredNodes || []

  return toOptions
}

export default createRule<RuleOptions, MessageIds>({
  name: 'key-spacing',
  meta: {
    type: 'layout',
    docs: {
      description:
        'Enforce consistent spacing between property names and type annotations in types and interfaces',
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
            ignoredNodes: {
              type: 'array',
              items: {
                type: 'string',
                enum: listeningNodes,
              },
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
  defaultOptions: [{}],
  create(context, [_options]) {
    // TODO: need to unify the usage of options
    const options: OptionsUnion = _options || {}
    const ruleOptions = initOptions({}, options)
    const multiLineOptions = ruleOptions.multiLine
    const singleLineOptions = ruleOptions.singleLine
    const alignmentOptions = ruleOptions.align || null
    const ignoredNodes: Tree.AST_NODE_TYPES[] = ruleOptions.ignoredNodes

    const sourceCode = context.sourceCode

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
     * Checks whether a node is contained on a single line.
     * @param node AST Node being evaluated.
     * @returns True if the node is a single line.
     */
    function isSingleLine(node: ASTNode) {
      return (node.loc.end.line === node.loc.start.line)
    }

    /**
     * Checks whether a node is contained on a single line.
     * @param node AST Node being evaluated.
     * @returns True if the node is a single line.
     */
    function isSingleLineImportAttributes(
      node: Tree.ImportDeclaration | Tree.ExportNamedDeclaration | Tree.ExportAllDeclaration | Tree.TSImportType,
      sourceCode: SourceCode,
    ) {
      if (node.type === 'TSImportType') {
        if ('options' in node && node.options) {
          return isSingleLine(node.options)
        }
        return false
      }
      const openingBrace = sourceCode.getTokenBefore(node.attributes[0], isOpeningBraceToken)!
      const closingBrace = sourceCode.getTokenAfter(node.attributes[node.attributes.length - 1], isClosingBraceToken)!
      return (isTokenOnSameLine(closingBrace, openingBrace))
    }

    /**
     * Checks whether the properties on a single line.
     * @param properties List of Property AST nodes.
     * @returns True if all properties is on a single line.
     */
    function isSingleLineProperties(properties: ASTNode[]) {
      const [firstProp] = properties
      const lastProp = properties.at(-1)!

      return isTokenOnSameLine(lastProp, firstProp)
    }

    /**
     * Determines if the given property is key-value property.
     * @param property Property node to check.
     * @returns Whether the property is a key-value property.
     */
    function isKeyValueProperty<P extends Tree.ObjectLiteralElement | Tree.ImportAttribute>(
      property: P,
    ): property is (Tree.Property | Tree.ImportAttribute) & P {
      if (property.type === 'ImportAttribute')
        return true
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
    function continuesPropertyGroup(
      lastMember: Tree.ObjectLiteralElement | Tree.ImportAttribute,
      candidate: Tree.ObjectLiteralElement | Tree.ImportAttribute,
    ) {
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
        && candidateValueStartLine - leadingComments.at(-1)!.loc.end.line <= 1
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
    function getKey(property: Tree.Property | Tree.ImportAttribute) {
      const key = property.key

      if (property.type !== 'ImportAttribute' && property.computed)
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
    function report(
      property: Tree.Property | Tree.ImportAttribute,
      side: 'key' | 'value',
      whitespace: string,
      expected: number,
      mode: 'strict' | 'minimum',
    ) {
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
        const spaces = new Array(diffAbs + 1).join(' ')

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
            computed: property.type !== 'ImportAttribute' && property.computed ? 'computed ' : '',
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
    function getKeyWidth(property: Tree.Property | Tree.ImportAttribute) {
      const startToken = sourceCode.getFirstToken(property)!
      const endToken = getLastTokenBeforeColon(property.key)!

      return getStringLength(sourceCode.getText().slice(startToken.range[0], endToken.range[1]))
    }

    /**
     * Gets the whitespace around the colon in an object literal property.
     * @param property Property node from an object literal.
     * @returns Whitespace before and after the property's colon.
     */
    function getPropertyWhitespace(property: Tree.Property | Tree.ImportAttribute) {
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
     * @param properties List of Property AST nodes being evaluated.
     * @returns Groups of property AST node lists.
     */
    function createGroups(properties: (Tree.ObjectLiteralElement | Tree.ImportAttribute)[]) {
      if (properties.length === 1)
        return [properties]

      return properties.reduce<(Tree.ObjectLiteralElement | Tree.ImportAttribute)[][]>((groups, property) => {
        const currentGroup = groups.at(-1)!
        const prev = currentGroup.at(-1)

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
    function verifyGroupAlignment(properties: (Tree.Property | Tree.ImportAttribute)[]) {
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
    function verifySpacing(node: Tree.Property | Tree.ImportAttribute, lineOptions: { beforeColon: number, afterColon: number, mode: 'strict' | 'minimum' }) {
      if (ignoredNodes.includes(node.parent.type))
        return
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
    function verifyListSpacing(properties: (Tree.Property | Tree.ImportAttribute)[], lineOptions: { beforeColon: number, afterColon: number, mode: 'strict' | 'minimum' }) {
      const length = properties.length

      for (let i = 0; i < length; i++)
        verifySpacing(properties[i], lineOptions)
    }

    /**
     * Verifies vertical alignment, taking into account groups of properties.
     * @param properties List of Property AST nodes being evaluated.
     */
    function verifyAlignment(properties: (Tree.ObjectLiteralElement | Tree.ImportAttribute)[]) {
      createGroups(properties).forEach((group) => {
        const properties = group.filter(isKeyValueProperty)

        if (properties.length > 0 && isSingleLineProperties(properties))
          verifyListSpacing(properties, multiLineOptions)
        else
          verifyGroupAlignment(properties)
      })
    }

    function verifyImportAttributes(node: Tree.ImportDeclaration | Tree.ExportNamedDeclaration | Tree.ExportAllDeclaration) {
      if (ignoredNodes.includes(node.type))
        return
      if (!node.attributes)
      // The old parser's AST does not have attributes.
        return
      if (!node.attributes.length)
        return
      if (isSingleLineImportAttributes(node, sourceCode))
        verifyListSpacing(node.attributes, singleLineOptions)
      else
        verifyAlignment(node.attributes)
    }

    const baseRules: RuleListener = alignmentOptions ? {
      // Verify vertical alignment
      ObjectExpression(node) {
        if (ignoredNodes.includes(node.type))
          return
        if (isSingleLine(node))
          verifyListSpacing(node.properties.filter(isKeyValueProperty), singleLineOptions)
        else
          verifyAlignment(node.properties)
      },
      ImportDeclaration(node) {
        verifyImportAttributes(node)
      },
      ExportNamedDeclaration(node) {
        verifyImportAttributes(node)
      },
      ExportAllDeclaration(node) {
        verifyImportAttributes(node)
      },
    } : {
      // Obey beforeColon and afterColon in each property as configured
      Property(node) {
        verifySpacing(node, isSingleLine(node.parent) ? singleLineOptions : multiLineOptions)
      },
      ImportAttribute(node) {
        const parent = node.parent
        verifySpacing(node, isSingleLineImportAttributes(parent, sourceCode) ? singleLineOptions : multiLineOptions)
      },
    }

    /**
     * @returns the column of the position after converting all unicode characters in the line to 1 char length
     */
    function adjustedColumn(position: Tree.Position): number {
      const line = position.line - 1 // position.line is 1-indexed
      return getStringLength(
        sourceCode.lines.at(line)!.slice(0, position.column),
      )
    }

    type KeyTypeNode
      = | Tree.PropertyDefinition
        | Tree.TSIndexSignature
        | Tree.TSPropertySignature

    type KeyTypeNodeWithTypeAnnotation = KeyTypeNode & {
      typeAnnotation: Tree.TSTypeAnnotation
    }

    function isKeyTypeNode(
      node: ASTNode,
    ): node is KeyTypeNodeWithTypeAnnotation {
      return (
        (node.type === AST_NODE_TYPES.TSPropertySignature
          || node.type === AST_NODE_TYPES.TSIndexSignature
          || node.type === AST_NODE_TYPES.PropertyDefinition)
        && !!node.typeAnnotation
      )
    }

    function isApplicable(
      node: ASTNode,
    ): node is KeyTypeNodeWithTypeAnnotation {
      return (
        isKeyTypeNode(node)
        && isTokenOnSameLine(node, node.typeAnnotation)
      )
    }

    /**
     * To handle index signatures, to get the whole text for the parameters
     */
    function getKeyText(node: KeyTypeNodeWithTypeAnnotation): string {
      if (node.type !== AST_NODE_TYPES.TSIndexSignature)
        return sourceCode.getText(node.key)

      const code = sourceCode.getText(node)
      return code.slice(
        0,
        sourceCode.getTokenAfter(
          node.parameters.at(-1)!,
          isClosingBracketToken,
        )!.range[1] - node.range[0],
      )
    }

    /**
     * To handle index signatures, be able to get the end position of the parameters
     */
    function getKeyLocEnd(
      node: KeyTypeNodeWithTypeAnnotation,
    ): Tree.Position {
      return getLastTokenBeforeColon(
        node.type !== AST_NODE_TYPES.TSIndexSignature
          ? node.key
          : node.parameters.at(-1)!,
      )!.loc.end
    }

    function checkBeforeColon(
      node: KeyTypeNodeWithTypeAnnotation,
      expectedWhitespaceBeforeColon: number,
      mode: 'minimum' | 'strict',
    ): void {
      const { typeAnnotation } = node
      const colon = typeAnnotation.loc.start.column
      const keyEnd = getKeyLocEnd(node)
      const difference = colon - keyEnd.column - expectedWhitespaceBeforeColon
      if (mode === 'strict' ? difference : difference < 0) {
        context.report({
          node,
          messageId: difference > 0 ? 'extraKey' : 'missingKey',
          fix: (fixer) => {
            if (difference > 0) {
              return fixer.removeRange([
                typeAnnotation.range[0] - difference,
                typeAnnotation.range[0],
              ])
            }
            return fixer.insertTextBefore(
              typeAnnotation,
              ' '.repeat(-difference),
            )
          },
          data: {
            computed: '',
            key: getKeyText(node),
          },
        })
      }
    }

    function checkAfterColon(
      node: KeyTypeNodeWithTypeAnnotation,
      expectedWhitespaceAfterColon: number,
      mode: 'minimum' | 'strict',
    ): void {
      const { typeAnnotation } = node
      const colonToken = sourceCode.getFirstToken(typeAnnotation)!
      const typeStart = sourceCode.getTokenAfter(colonToken, {
        includeComments: true,
      })!.loc.start.column
      const difference
        = typeStart
          - colonToken.loc.start.column
          - 1
          - expectedWhitespaceAfterColon
      if (mode === 'strict' ? difference : difference < 0) {
        context.report({
          node,
          messageId: difference > 0 ? 'extraValue' : 'missingValue',
          fix: (fixer) => {
            if (difference > 0) {
              return fixer.removeRange([
                colonToken.range[1],
                colonToken.range[1] + difference,
              ])
            }
            return fixer.insertTextAfter(colonToken, ' '.repeat(-difference))
          },
          data: {
            computed: '',
            key: getKeyText(node),
          },
        })
      }
    }

    // adapted from  https://github.com/eslint/eslint/blob/ba74253e8bd63e9e163bbee0540031be77e39253/lib/rules/key-spacing.js#L356
    function continuesAlignGroup(
      lastMember: ASTNode,
      candidate: ASTNode,
    ): boolean {
      const groupEndLine = lastMember.loc.start.line
      const candidateValueStartLine = (
        isKeyTypeNode(candidate) ? candidate.typeAnnotation : candidate
      ).loc.start.line

      if (candidateValueStartLine === groupEndLine)
        return false

      if (candidateValueStartLine - groupEndLine === 1)
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
        && candidateValueStartLine - leadingComments.at(-1)!.loc.end.line <= 1
      ) {
        for (let i = 1; i < leadingComments.length; i++) {
          if (
            leadingComments[i].loc.start.line
            - leadingComments[i - 1].loc.end.line
            > 1
          ) {
            return false
          }
        }
        return true
      }

      return false
    }

    function checkAlignGroup(group: ASTNode[]): void {
      let alignColumn = 0
      const align: 'colon' | 'value'
        = (typeof options.align === 'object'
          ? options.align.on
          : typeof options.multiLine?.align === 'object'
            ? options.multiLine.align.on
            : options.multiLine?.align ?? options.align) ?? 'colon'
      const beforeColon
        = (typeof options.align === 'object'
          ? options.align.beforeColon
          : options.multiLine
            ? typeof options.multiLine.align === 'object'
              ? options.multiLine.align.beforeColon
              : options.multiLine.beforeColon
            : options.beforeColon) ?? false
      const expectedWhitespaceBeforeColon = beforeColon ? 1 : 0
      const afterColon
        = (typeof options.align === 'object'
          ? options.align.afterColon
          : options.multiLine
            ? typeof options.multiLine.align === 'object'
              ? options.multiLine.align.afterColon
              : options.multiLine.afterColon
            : options.afterColon) ?? true
      const expectedWhitespaceAfterColon = afterColon ? 1 : 0
      const mode
        = (typeof options.align === 'object'
          ? options.align.mode
          : options.multiLine
            ? typeof options.multiLine.align === 'object'
              // same behavior as in original rule
              ? options.multiLine.align.mode ?? options.multiLine.mode
              : options.multiLine.mode
            : options.mode) ?? 'strict'

      for (const node of group) {
        if (isKeyTypeNode(node)) {
          const keyEnd = adjustedColumn(getKeyLocEnd(node))
          alignColumn = Math.max(
            alignColumn,
            align === 'colon'
              ? keyEnd + expectedWhitespaceBeforeColon
              : keyEnd
                + ':'.length
                + expectedWhitespaceAfterColon
                + expectedWhitespaceBeforeColon,
          )
        }
      }

      for (const node of group) {
        if (!isApplicable(node))
          continue

        const { typeAnnotation } = node
        const toCheck
          = align === 'colon' ? typeAnnotation : typeAnnotation.typeAnnotation
        const difference = adjustedColumn(toCheck.loc.start) - alignColumn

        if (difference) {
          context.report({
            node,
            messageId:
              difference > 0
                ? align === 'colon'
                  ? 'extraKey'
                  : 'extraValue'
                : align === 'colon'
                  ? 'missingKey'
                  : 'missingValue',
            fix: (fixer) => {
              if (difference > 0) {
                return fixer.removeRange([
                  toCheck.range[0] - difference,
                  toCheck.range[0],
                ])
              }
              return fixer.insertTextBefore(toCheck, ' '.repeat(-difference))
            },
            data: {
              computed: '',
              key: getKeyText(node),
            },
          })
        }

        if (align === 'colon')
          checkAfterColon(node, expectedWhitespaceAfterColon, mode)
        else
          checkBeforeColon(node, expectedWhitespaceBeforeColon, mode)
      }
    }

    function checkIndividualNode(
      node: ASTNode,
      { singleLine }: { singleLine: boolean },
    ): void {
      const beforeColon = (
        singleLine
          ? options.singleLine
            ? options.singleLine.beforeColon
            : options.beforeColon
          : options.multiLine
            ? options.multiLine.beforeColon
            : options.beforeColon
      ) ?? false
      const expectedWhitespaceBeforeColon = beforeColon ? 1 : 0
      const afterColon
        = (singleLine
          ? options.singleLine
            ? options.singleLine.afterColon
            : options.afterColon
          : options.multiLine
            ? options.multiLine.afterColon
            : options.afterColon) ?? true
      const expectedWhitespaceAfterColon = afterColon ? 1 : 0
      const mode
        = (singleLine
          ? options.singleLine
            ? options.singleLine.mode
            : options.mode
          : options.multiLine
            ? options.multiLine.mode
            : options.mode) ?? 'strict'

      if (isApplicable(node)) {
        checkBeforeColon(node, expectedWhitespaceBeforeColon, mode)
        checkAfterColon(node, expectedWhitespaceAfterColon, mode)
      }
    }

    function validateBody(
      body:
        | Tree.ClassBody
        | Tree.TSInterfaceBody
        | Tree.TSTypeLiteral,
    ): void {
      if (ignoredNodes.includes(body.type))
        return

      const isSingleLine = body.loc.start.line === body.loc.end.line

      const members = body.type === AST_NODE_TYPES.TSTypeLiteral
        ? body.members
        : body.body

      let alignGroups: ASTNode[][] = []
      let unalignedElements: ASTNode[] = []

      if (options.align || options.multiLine?.align) {
        let currentAlignGroup: ASTNode[] = []
        alignGroups.push(currentAlignGroup)

        let prevNode: ASTNode | undefined

        for (const node of members) {
          let prevAlignedNode = currentAlignGroup.at(-1)
          if (prevAlignedNode !== prevNode)
            prevAlignedNode = undefined

          if (prevAlignedNode && continuesAlignGroup(prevAlignedNode, node)) {
            currentAlignGroup.push(node)
          }
          else if (prevNode?.loc.start.line === node.loc.start.line) {
            if (prevAlignedNode) {
              // Here, prevNode === prevAlignedNode === currentAlignGroup.at(-1)
              unalignedElements.push(prevAlignedNode)
              currentAlignGroup.pop()
            }
            unalignedElements.push(node)
          }
          else {
            currentAlignGroup = [node]
            alignGroups.push(currentAlignGroup)
          }

          prevNode = node
        }

        unalignedElements = unalignedElements.concat(
          ...alignGroups.filter(group => group.length === 1),
        )
        alignGroups = alignGroups.filter(group => group.length >= 2)
      }
      else {
        unalignedElements = members
      }

      for (const group of alignGroups)
        checkAlignGroup(group)

      for (const node of unalignedElements)
        checkIndividualNode(node, { singleLine: isSingleLine })
    }
    return {
      ...baseRules,
      TSTypeLiteral: validateBody,
      TSInterfaceBody: validateBody,
      ClassBody: validateBody,
    }
  },
})
