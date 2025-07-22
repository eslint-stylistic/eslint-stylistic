import type { ASTNode, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'list-style',
  meta: {
    type: 'layout',
    docs: {
      description: 'Having line breaks styles to object, array and named imports',
      experimental: true,
    },
    fixable: 'whitespace',
    schema: [
      {
        $defs: {
          baseConfig: {
            type: 'object',
            additionalProperties: false,
            properties: {
              singleLine: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  spacing: {
                    type: 'string',
                    enum: ['always', 'never'],
                    default: 'always',
                  },
                  maxItems: {
                    type: 'integer',
                    minimum: 1,
                    default: Number.POSITIVE_INFINITY,
                  },
                },
              },
              multiline: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  maxItemsPerLine: {
                    type: 'integer',
                    default: 1,
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        allOf: [
          { $ref: '#/$defs/baseConfig' },
          {
            type: 'object',
            properties: {
              overrides: {
                type: 'object',
                properties: {
                  ArrayExpression: { $ref: '#/$defs/baseConfig' },
                  ArrayPattern: { $ref: '#/$defs/baseConfig' },
                  ArrowFunctionExpression: { $ref: '#/$defs/baseConfig' },
                  CallExpression: { $ref: '#/$defs/baseConfig' },
                  ExportNamedDeclaration: { $ref: '#/$defs/baseConfig' },
                  FunctionDeclaration: { $ref: '#/$defs/baseConfig' },
                  FunctionExpression: { $ref: '#/$defs/baseConfig' },
                  ImportDeclaration: { $ref: '#/$defs/baseConfig' },
                  JSXOpeningElement: { $ref: '#/$defs/baseConfig' },
                  NewExpression: { $ref: '#/$defs/baseConfig' },
                  ObjectExpression: { $ref: '#/$defs/baseConfig' },
                  ObjectPattern: { $ref: '#/$defs/baseConfig' },
                  TSFunctionType: { $ref: '#/$defs/baseConfig' },
                  TSInterfaceDeclaration: { $ref: '#/$defs/baseConfig' },
                  TSTupleType: { $ref: '#/$defs/baseConfig' },
                  TSTypeLiteral: { $ref: '#/$defs/baseConfig' },
                  TSTypeParameterDeclaration: { $ref: '#/$defs/baseConfig' },
                  TSTypeParameterInstantiation: { $ref: '#/$defs/baseConfig' },
                  JSONArrayExpression: { $ref: '#/$defs/baseConfig' },
                  JSONObjectExpression: { $ref: '#/$defs/baseConfig' },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
        ],
      },
    ],
    messages: {
      shouldWrap: 'Should have line breaks between items, in node {{name}}',
      shouldNotWrap: 'Should not have line breaks between items, in node {{name}}',
    },
  },
  defaultOptions: [{
    singleLine: {
      spacing: 'always',
      maxItems: Number.POSITIVE_INFINITY,
    },
    multiline: {
      maxItemsPerLine: 1,
    },
  }],
  // TODO: implement
  // eslint-disable-next-line unused-imports/no-unused-vars
  create: (context, [options] = [{}]) => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    function checkInBrace(node: ASTNode) {
      // TODO
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    function checkInBracket(node: ASTNode) {
      // TODO
    }

    return {
      ArrayExpression(node) {
        checkInBracket(node)
      },
      ArrayPattern(node) {
        checkInBracket(node)
      },
      ObjectExpression(node) {
        checkInBrace(node)
      },
      ObjectPattern(node) {
        checkInBrace(node)
      },

      JSONArrayExpression(node: Tree.ArrayExpression) {
        checkInBracket(node)
      },
      JSONObjectExpression(node: Tree.ObjectExpression) {
        checkInBrace(node)
      },
    }
  },
})
