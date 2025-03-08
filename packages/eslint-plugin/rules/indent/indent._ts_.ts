/**
 * Note this file is rather type-unsafe in its current state.
 * This is due to some really funky type conversions between different node types.
 * This is done intentionally based on the internal implementation of the base indent rule.
 */

import type { ASTNode, JSONSchema, RuleFunction, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { castRuleModule, createRule } from '#utils/create-rule'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import _baseRule from './indent._js_'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

const KNOWN_NODES = new Set([
  // Class properties aren't yet supported by eslint...
  AST_NODE_TYPES.PropertyDefinition,

  // ts keywords
  AST_NODE_TYPES.TSAbstractKeyword,
  AST_NODE_TYPES.TSAnyKeyword,
  AST_NODE_TYPES.TSBooleanKeyword,
  AST_NODE_TYPES.TSNeverKeyword,
  AST_NODE_TYPES.TSNumberKeyword,
  AST_NODE_TYPES.TSStringKeyword,
  AST_NODE_TYPES.TSSymbolKeyword,
  AST_NODE_TYPES.TSUndefinedKeyword,
  AST_NODE_TYPES.TSUnknownKeyword,
  AST_NODE_TYPES.TSVoidKeyword,
  AST_NODE_TYPES.TSNullKeyword,

  // ts specific nodes we want to support
  AST_NODE_TYPES.TSAbstractPropertyDefinition,
  AST_NODE_TYPES.TSAbstractMethodDefinition,
  AST_NODE_TYPES.TSArrayType,
  AST_NODE_TYPES.TSAsExpression,
  AST_NODE_TYPES.TSCallSignatureDeclaration,
  AST_NODE_TYPES.TSConditionalType,
  AST_NODE_TYPES.TSConstructorType,
  AST_NODE_TYPES.TSConstructSignatureDeclaration,
  AST_NODE_TYPES.TSDeclareFunction,
  AST_NODE_TYPES.TSEmptyBodyFunctionExpression,
  AST_NODE_TYPES.TSEnumDeclaration,
  AST_NODE_TYPES.TSEnumMember,
  AST_NODE_TYPES.TSExportAssignment,
  AST_NODE_TYPES.TSExternalModuleReference,
  AST_NODE_TYPES.TSFunctionType,
  AST_NODE_TYPES.TSImportType,
  AST_NODE_TYPES.TSIndexedAccessType,
  AST_NODE_TYPES.TSIndexSignature,
  AST_NODE_TYPES.TSInferType,
  AST_NODE_TYPES.TSInterfaceBody,
  AST_NODE_TYPES.TSInterfaceDeclaration,
  AST_NODE_TYPES.TSInterfaceHeritage,
  AST_NODE_TYPES.TSImportEqualsDeclaration,
  AST_NODE_TYPES.TSLiteralType,
  AST_NODE_TYPES.TSMappedType,
  AST_NODE_TYPES.TSMethodSignature,
  'TSMinusToken',
  AST_NODE_TYPES.TSModuleBlock,
  AST_NODE_TYPES.TSModuleDeclaration,
  AST_NODE_TYPES.TSNonNullExpression,
  AST_NODE_TYPES.TSParameterProperty,
  'TSPlusToken',
  AST_NODE_TYPES.TSPropertySignature,
  AST_NODE_TYPES.TSQualifiedName,
  'TSQuestionToken',
  AST_NODE_TYPES.TSRestType,
  AST_NODE_TYPES.TSThisType,
  AST_NODE_TYPES.TSTupleType,
  AST_NODE_TYPES.TSTypeAnnotation,
  AST_NODE_TYPES.TSTypeLiteral,
  AST_NODE_TYPES.TSTypeOperator,
  AST_NODE_TYPES.TSTypeParameter,
  AST_NODE_TYPES.TSTypeParameterDeclaration,
  AST_NODE_TYPES.TSTypeParameterInstantiation,
  AST_NODE_TYPES.TSTypeReference,
  AST_NODE_TYPES.Decorator,

  // These are took care by `indent-binary-ops` rule
  // AST_NODE_TYPES.TSIntersectionType,
  // AST_NODE_TYPES.TSUnionType,
])

const ELEMENT_LIST_SCHEMA: JSONSchema.JSONSchema4 = {
  oneOf: [
    {
      type: 'integer',
      minimum: 0,
    },
    {
      type: 'string',
      enum: ['first', 'off'],
    },
  ],
}

export default createRule<RuleOptions, MessageIds>({
  name: 'indent',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent indentation',
      // too opinionated to be recommended
    },
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [
          {
            type: 'string',
            enum: ['tab'],
          },
          {
            type: 'integer',
            minimum: 0,
          },
        ],
      },
      {
        type: 'object',
        properties: {
          SwitchCase: {
            type: 'integer',
            minimum: 0,
            default: 0,
          },
          VariableDeclarator: {
            oneOf: [
              ELEMENT_LIST_SCHEMA,
              {
                type: 'object',
                properties: {
                  var: ELEMENT_LIST_SCHEMA,
                  let: ELEMENT_LIST_SCHEMA,
                  const: ELEMENT_LIST_SCHEMA,
                },
                additionalProperties: false,
              },
            ],
          },
          outerIIFEBody: {
            oneOf: [
              {
                type: 'integer',
                minimum: 0,
              },
              {
                type: 'string',
                enum: ['off'],
              },
            ],
          },
          MemberExpression: {
            oneOf: [
              {
                type: 'integer',
                minimum: 0,
              },
              {
                type: 'string',
                enum: ['off'],
              },
            ],
          },
          FunctionDeclaration: {
            type: 'object',
            properties: {
              parameters: ELEMENT_LIST_SCHEMA,
              body: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
          FunctionExpression: {
            type: 'object',
            properties: {
              parameters: ELEMENT_LIST_SCHEMA,
              body: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
          StaticBlock: {
            type: 'object',
            properties: {
              body: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
          CallExpression: {
            type: 'object',
            properties: {
              arguments: ELEMENT_LIST_SCHEMA,
            },
            additionalProperties: false,
          },
          ArrayExpression: ELEMENT_LIST_SCHEMA,
          ObjectExpression: ELEMENT_LIST_SCHEMA,
          ImportDeclaration: ELEMENT_LIST_SCHEMA,
          flatTernaryExpressions: {
            type: 'boolean',
            default: false,
          },
          offsetTernaryExpressions: {
            type: 'boolean',
            default: false,
          },
          offsetTernaryExpressionsOffsetCallExpressions: {
            type: 'boolean',
            default: true,
          },
          ignoredNodes: {
            type: 'array',
            items: {
              type: 'string',
              // @ts-expect-error Not sure the original intention
              not: {
                pattern: ':exit$',
              },
            },
          },
          ignoreComments: {
            type: 'boolean',
            default: false,
          },
          tabLength: {
            type: 'number',
            default: 4,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      wrongIndentation: 'Expected indentation of {{expected}} but found {{actual}}.',
    },
  },
  defaultOptions: [
    // typescript docs and playground use 4 space indent
    4,
    {
      // typescript docs indent the case from the switch
      // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-8.html#example-4
      SwitchCase: 1,
      flatTernaryExpressions: false,
      ignoredNodes: [],
    },
  ],
  create(context, optionsWithDefaults) {
    // because we extend the base rule, have to update opts on the context
    // the context defines options as readonly though...
    const contextWithDefaults: typeof context = Object.create(context, {
      options: {
        writable: false,
        configurable: false,
        value: optionsWithDefaults,
      },
    })

    const rules = baseRule.create(contextWithDefaults) as Record<string, RuleFunction<any>>

    const DEFAULT_VARIABLE_INDENT = 1
    const DEFAULT_PARAMETER_INDENT = 1
    const DEFAULT_FUNCTION_BODY_INDENT = 1

    let indentType = 'space'
    let indentSize = 4
    const options = {
      SwitchCase: 0,
      VariableDeclarator: {
        var: DEFAULT_VARIABLE_INDENT as number | 'first',
        let: DEFAULT_VARIABLE_INDENT as number | 'first',
        const: DEFAULT_VARIABLE_INDENT as number | 'first',
      },
      outerIIFEBody: 1,
      FunctionDeclaration: {
        parameters: DEFAULT_PARAMETER_INDENT,
        body: DEFAULT_FUNCTION_BODY_INDENT,
      },
      FunctionExpression: {
        parameters: DEFAULT_PARAMETER_INDENT,
        body: DEFAULT_FUNCTION_BODY_INDENT,
      },
      StaticBlock: {
        body: DEFAULT_FUNCTION_BODY_INDENT,
      },
      CallExpression: {
        arguments: DEFAULT_PARAMETER_INDENT,
      },
      MemberExpression: 1,
      ArrayExpression: 1,
      ObjectExpression: 1,
      ImportDeclaration: 1,
      flatTernaryExpressions: false,
      ignoredNodes: [],
      ignoreComments: false,
      offsetTernaryExpressions: false,
      offsetTernaryExpressionsOffsetCallExpressions: true,
      tabLength: 4,
    }

    if (optionsWithDefaults.length) {
      if (optionsWithDefaults[0] === 'tab') {
        indentSize = 1
        indentType = 'tab'
      }
      else {
        indentSize = optionsWithDefaults[0] ?? indentSize
        indentType = 'space'
      }

      const userOptions = optionsWithDefaults[1]
      if (userOptions) {
        Object.assign(options, userOptions)

        if (typeof userOptions.VariableDeclarator === 'number' || userOptions.VariableDeclarator === 'first') {
          options.VariableDeclarator = {
            var: userOptions.VariableDeclarator,
            let: userOptions.VariableDeclarator,
            const: userOptions.VariableDeclarator,
          }
        }
      }
    }

    /**
     * Creates an error message for a line, given the expected/actual indentation.
     * @param expectedAmount The expected amount of indentation characters for this line
     * @param actualSpaces The actual number of indentation spaces that were found on this line
     * @param actualTabs The actual number of indentation tabs that were found on this line
     * @returns An error message for this line
     */
    function createErrorMessageData(expectedAmount: number, actualSpaces: number, actualTabs: number) {
      const expectedStatement = `${expectedAmount} ${indentType}${expectedAmount === 1 ? '' : 's'}` // e.g. "2 tabs"
      const foundSpacesWord = `space${actualSpaces === 1 ? '' : 's'}` // e.g. "space"
      const foundTabsWord = `tab${actualTabs === 1 ? '' : 's'}` // e.g. "tabs"
      let foundStatement

      if (actualSpaces > 0) {
        /**
         * Abbreviate the message if the expected indentation is also spaces.
         * e.g. 'Expected 4 spaces but found 2' rather than 'Expected 4 spaces but found 2 spaces'
         */
        foundStatement = indentType === 'space' ? actualSpaces : `${actualSpaces} ${foundSpacesWord}`
      }
      else if (actualTabs > 0) {
        foundStatement = indentType === 'tab' ? actualTabs : `${actualTabs} ${foundTabsWord}`
      }
      else {
        foundStatement = '0'
      }
      return {
        expected: expectedStatement,
        actual: foundStatement,
      }
    }

    // JSXText
    function getNodeIndent(node: ASTNode | Token, byLastLine = false, excludeCommas = false) {
      let src = context.sourceCode.getText(node, node.loc.start.column)
      const lines = src.split('\n')
      if (byLastLine)
        src = lines[lines.length - 1]
      else
        src = lines[0]

      const skip = excludeCommas ? ',' : ''

      let regExp
      if (indentType === 'space')
        regExp = new RegExp(`^[ ${skip}]+`)
      else
        regExp = new RegExp(`^[\t${skip}]+`)

      const indent = regExp.exec(src)
      return indent ? indent[0].length : 0
    }

    /**
     * Converts from a TSPropertySignature to a Property
     * @param node a TSPropertySignature node
     * @param [type] the type to give the new node
     * @returns a Property node
     */
    function TSPropertySignatureToProperty(
      node:
        | Tree.TSEnumMember
        | Tree.TSPropertySignature
        | Tree.TypeElement,
      type:
        | AST_NODE_TYPES.Property
        | AST_NODE_TYPES.PropertyDefinition = AST_NODE_TYPES.Property,
    ): ASTNode | null {
      const base = {
        // indent doesn't actually use these
        key: null as any,
        value: null as any,

        // Property flags
        computed: false,
        method: false,
        kind: 'init',
        // this will stop eslint from interrogating the type literal
        shorthand: true,

        // location data
        parent: node.parent,
        range: node.range,
        loc: node.loc,
      }
      if (type === AST_NODE_TYPES.Property) {
        return {
          ...base as unknown as Tree.Property,
          type,
        }
      }
      return {
        type,
        accessibility: undefined,
        declare: false,
        decorators: [],
        definite: false,
        optional: false,
        override: false,
        readonly: false,
        static: false,
        typeAnnotation: undefined,
        ...base,
      } as Tree.PropertyDefinition
    }

    return {
      ...rules,

      // Special handling for JSXText nodes
      JSXText(node) {
        if (!node.parent)
          return

        if (node.parent.type !== 'JSXElement' && node.parent.type !== 'JSXFragment')
          return

        const value = node.value
        // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation
        const regExp = indentType === 'space' ? /\n( *)[\t ]*\S/g : /\n(\t*)[\t ]*\S/g
        const nodeIndentsPerLine = Array.from(
          String(value).matchAll(regExp),
          match => (match[1] ? match[1].length : 0),
        )
        const hasFirstInLineNode = nodeIndentsPerLine.length > 0
        const parentNodeIndent = getNodeIndent(node.parent)
        const indent = parentNodeIndent + indentSize
        if (
          hasFirstInLineNode
          && !nodeIndentsPerLine.every(actualIndent => actualIndent === indent)
        ) {
          nodeIndentsPerLine.forEach((nodeIndent) => {
            context.report({
              node,
              messageId: 'wrongIndentation',
              data: createErrorMessageData(indent, nodeIndent, nodeIndent),
              fix(fixer) {
                const indentChar = indentType === 'space' ? ' ' : '\t'
                const indentStr = new Array(indent + 1).join(indentChar)
                const regExp = /\n[\t ]*(\S)/g
                const fixedText = node.raw.replace(regExp, (match, p1) => `\n${indentStr}${p1}`)
                return fixer.replaceText(node, fixedText)
              },
            })
          })
        }
      },

      // overwrite the base rule here so we can use our KNOWN_NODES list instead
      '*:exit': function (node: ASTNode) {
        // For nodes we care about, skip the default handling, because it just marks the node as ignored...
        if (!KNOWN_NODES.has(node.type))
          rules['*:exit'](node)
      },

      VariableDeclaration(node) {
        // https://github.com/typescript-eslint/typescript-eslint/issues/441
        if (node.declarations.length === 0)
          return

        return rules.VariableDeclaration(node)
      },

      TSAsExpression(node: Tree.TSAsExpression) {
        // transform it to a BinaryExpression
        return rules['BinaryExpression, LogicalExpression']({
          type: AST_NODE_TYPES.BinaryExpression,
          operator: 'as' as any,
          left: node.expression,
          // the first typeAnnotation includes the as token
          right: node.typeAnnotation as any,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      TSConditionalType(node: Tree.TSConditionalType) {
        // transform it to a ConditionalExpression
        return rules.ConditionalExpression({
          type: AST_NODE_TYPES.ConditionalExpression,
          test: {
            parent: node,
            type: AST_NODE_TYPES.BinaryExpression,
            operator: 'extends' as any,
            left: node.checkType as any,
            right: node.extendsType as any,

            // location data
            range: [node.checkType.range[0], node.extendsType.range[1]],
            loc: {
              start: node.checkType.loc.start,
              end: node.extendsType.loc.end,
            },
          },
          consequent: node.trueType as any,
          alternate: node.falseType as any,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      'TSEnumDeclaration, TSTypeLiteral': function (
        node: Tree.TSEnumDeclaration | Tree.TSTypeLiteral,
      ) {
        const members = 'body' in node
          ? node.body?.members || node.members
          : node.members

        // transform it to an ObjectExpression
        return rules['ObjectExpression, ObjectPattern']({
          type: AST_NODE_TYPES.ObjectExpression,
          properties: members.map(
            member => TSPropertySignatureToProperty(member) as Tree.Property,
          ),

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      TSImportEqualsDeclaration(node: Tree.TSImportEqualsDeclaration) {
        // transform it to an VariableDeclaration
        // use VariableDeclaration instead of ImportDeclaration because it's essentially the same thing
        const { id, moduleReference } = node

        return rules.VariableDeclaration({
          type: AST_NODE_TYPES.VariableDeclaration,
          kind: 'const' as const,
          declarations: [
            {
              type: AST_NODE_TYPES.VariableDeclarator,
              range: [id.range[0], moduleReference.range[1]],
              loc: {
                start: id.loc.start,
                end: moduleReference.loc.end,
              },
              id,
              init: {
                type: AST_NODE_TYPES.CallExpression,
                callee: {
                  type: AST_NODE_TYPES.Identifier,
                  name: 'require',
                  range: [
                    moduleReference.range[0],
                    moduleReference.range[0] + 'require'.length,
                  ],
                  loc: {
                    start: moduleReference.loc.start,
                    end: {
                      line: moduleReference.loc.end.line,
                      column: moduleReference.loc.start.line + 'require'.length,
                    },
                  },
                },
                arguments:
                  'expression' in moduleReference
                    ? [moduleReference.expression]
                    : [],

                // location data
                range: moduleReference.range,
                loc: moduleReference.loc,
              },
            } as Tree.VariableDeclarator,
          ],
          declare: false,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      TSIndexedAccessType(node: Tree.TSIndexedAccessType) {
        // convert to a MemberExpression
        return rules['MemberExpression, JSXMemberExpression, MetaProperty']({
          type: AST_NODE_TYPES.MemberExpression,
          object: node.objectType as any,
          property: node.indexType as any,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
          optional: false,
          computed: true,
        })
      },

      TSInterfaceBody(node: Tree.TSInterfaceBody) {
        // transform it to an ClassBody
        return rules['BlockStatement, ClassBody']({
          type: AST_NODE_TYPES.ClassBody,
          body: node.body.map(
            p =>
              TSPropertySignatureToProperty(
                p,
                AST_NODE_TYPES.PropertyDefinition,
              ) as Tree.PropertyDefinition,
          ),

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      'TSInterfaceDeclaration[extends.length > 0]': function (
        node: Tree.TSInterfaceDeclaration,
      ) {
        // transform it to a ClassDeclaration
        return rules[
          'ClassDeclaration[superClass], ClassExpression[superClass]'
        ]({
          type: AST_NODE_TYPES.ClassDeclaration,
          body: node.body as any,
          id: null,
          // TODO: This is invalid, there can be more than one extends in interface
          superClass: node.extends[0].expression as any,
          abstract: false,
          declare: false,
          decorators: [],
          implements: [],
          superTypeArguments: undefined,
          superTypeParameters: undefined,
          typeParameters: undefined,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        },
        )
      },

      TSMappedType(node: Tree.TSMappedType) {
        const sourceCode = context.sourceCode

        const squareBracketStart = sourceCode.getTokenBefore(
          node.constraint || node.typeParameter,
        )!

        // transform it to an ObjectExpression
        return rules['ObjectExpression, ObjectPattern']({
          type: AST_NODE_TYPES.ObjectExpression,
          properties: [
            {
              parent: node,
              type: AST_NODE_TYPES.Property,
              key: node.key || node.typeParameter as any,
              value: node.typeAnnotation as any,

              // location data
              range: [
                squareBracketStart.range[0],
                node.typeAnnotation
                  ? node.typeAnnotation.range[1]
                  : squareBracketStart.range[0],
              ],
              loc: {
                start: squareBracketStart.loc.start,
                end: node.typeAnnotation
                  ? node.typeAnnotation.loc.end
                  : squareBracketStart.loc.end,
              },
              kind: 'init' as const,
              computed: false,
              method: false,
              optional: false,
              shorthand: false,
            },
          ],

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      TSModuleBlock(node: Tree.TSModuleBlock) {
        // transform it to a BlockStatement
        return rules['BlockStatement, ClassBody']({
          type: AST_NODE_TYPES.BlockStatement,
          body: node.body as any,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      TSQualifiedName(node: Tree.TSQualifiedName) {
        return rules['MemberExpression, JSXMemberExpression, MetaProperty']({
          type: AST_NODE_TYPES.MemberExpression,
          object: node.left as any,
          property: node.right as any,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
          optional: false,
          computed: false,
        })
      },

      TSTupleType(node: Tree.TSTupleType) {
        // transform it to an ArrayExpression
        return rules['ArrayExpression, ArrayPattern']({
          type: AST_NODE_TYPES.ArrayExpression,
          elements: node.elementTypes as any,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      TSTypeParameterDeclaration(node: Tree.TSTypeParameterDeclaration) {
        if (!node.params.length)
          return

        const [name, ...attributes] = node.params

        // JSX is about the closest we can get because the angle brackets
        // it's not perfect but it works!
        return rules.JSXOpeningElement({
          type: AST_NODE_TYPES.JSXOpeningElement,
          selfClosing: false,
          name: name as any,
          attributes: attributes as any,
          typeArguments: undefined,
          typeParameters: undefined,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },

      TSTypeParameterInstantiation(node: Tree.TSTypeParameterInstantiation) {
        if (!node.params.length)
          return

        const [name, ...attributes] = node.params

        // JSX is about the closest we can get because the angle brackets
        // it's not perfect but it works!
        return rules.JSXOpeningElement({
          type: AST_NODE_TYPES.JSXOpeningElement,
          selfClosing: false,
          name: name as any,
          attributes: attributes as any,
          typeArguments: undefined,
          typeParameters: undefined,

          // location data
          parent: node.parent,
          range: node.range,
          loc: node.loc,
        })
      },
    }
  },
})
