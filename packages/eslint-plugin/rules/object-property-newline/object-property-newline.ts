import type { ASTNode, JSONSchema, NodeTypes } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const SUPPORTED_NODES = [
  'ObjectExpression',
  'ObjectPattern',
  'ImportDeclaration',
  'ExportNamedDeclaration',
  'TSTypeLiteral',
  'TSInterfaceBody',
  'TSEnumBody',
] satisfies NodeTypes[]

type SupportedNode = Extract<ASTNode, { type: typeof SUPPORTED_NODES[number] }>

type NormalizedOptions = Extract<RuleOptions[0], { ObjectExpression?: any }>

const OPTION_VALUE: JSONSchema.JSONSchema4ObjectSchema = {
  type: 'object',
  properties: {
    allowAllPropertiesOnSameLine: {
      type: 'boolean',
    },
  },
  additionalProperties: false,
}

const defaultOptionValue = { allowAllPropertiesOnSameLine: false }

export default createRule<RuleOptions, MessageIds>({
  name: 'object-property-newline',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce placing object properties on separate lines',
    },
    schema: [
      {
        oneOf: [
          OPTION_VALUE,
          {
            type: 'object',
            properties: SUPPORTED_NODES.reduce((retv, node) => {
              retv[node] = OPTION_VALUE
              return retv
            }, {} as Record<NodeTypes, JSONSchema.JSONSchema4>),
            additionalProperties: false,
            minProperties: 1,
          },
        ],
      },
    ],
    fixable: 'whitespace',
    messages: {
      propertiesOnNewlineAll: `Properties must go on a new line if they aren't all on the same line.`,
      propertiesOnNewline: 'Properties must go on a new line.',
    },
  },
  defaultOptions: [
    {
      ObjectExpression: defaultOptionValue,
      ObjectPattern: defaultOptionValue,
      ImportDeclaration: defaultOptionValue,
      ExportNamedDeclaration: defaultOptionValue,
      TSTypeLiteral: defaultOptionValue,
      TSInterfaceBody: defaultOptionValue,
      TSEnumBody: defaultOptionValue,
    },
  ],

  create(context, [options = {}]) {
    const normalizeOptions: NormalizedOptions = (function () {
      if ('allowAllPropertiesOnSameLine' in options) {
        return SUPPORTED_NODES.reduce((retv, node) => ({
          ...retv,
          [node]: options,
        }), {})
      }
      else {
        return options
      }
    }())

    const sourceCode = context.sourceCode

    function check(node: SupportedNode, children: ASTNode[]) {
      if (children.length <= 1)
        return

      const allowSameLine = normalizeOptions[node.type]?.allowAllPropertiesOnSameLine

      if (allowSameLine) {
        const firstTokenOfFirstProperty = sourceCode.getFirstToken(children[0])!
        const lastTokenOfLastProperty = sourceCode.getLastToken(children.at(-1)!)!

        if (isTokenOnSameLine(firstTokenOfFirstProperty, lastTokenOfLastProperty)) {
          // All keys and values are on the same line
          return
        }
      }

      const messageId = allowSameLine
        ? 'propertiesOnNewlineAll'
        : 'propertiesOnNewline'

      for (let i = 1; i < children.length; i++) {
        const lastTokenOfPreviousProperty = sourceCode.getLastToken(children[i - 1])!
        const firstTokenOfCurrentProperty = sourceCode.getFirstToken(children[i])!

        if (isTokenOnSameLine(lastTokenOfPreviousProperty, firstTokenOfCurrentProperty)) {
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
        check(node, node.properties)
      },
      ObjectPattern(node) {
        check(node, node.properties)
      },
      ImportDeclaration(node) {
        const specifiers = node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier')
        check(node, specifiers)
      },
      ExportNamedDeclaration(node) {
        check(node, node.specifiers)
      },
      TSTypeLiteral(node) {
        check(node, node.members)
      },
      TSInterfaceBody(node) {
        check(node, node.body)
      },
      TSEnumBody(node) {
        check(node, node.members)
      },
    }
  },
})
