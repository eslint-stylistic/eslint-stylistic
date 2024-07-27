/**
 * Note this file is rather type-unsafe in its current state.
 * This is due to some really funky type conversions between different node types.
 * This is done intentionally based on the internal implementation of the base indent rule.
 */

import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import type { ASTNode, RuleFunction, Tree } from '@shared/types'
import { createRule } from '../../utils'
import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('indent')

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

export default createRule<RuleOptions, MessageIds>({
  name: 'indent',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent indentation',
      // too opinionated to be recommended
    },
    fixable: 'whitespace',
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema: baseRule.meta.schema,
    messages: baseRule.meta.messages,
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

      // overwrite the base rule here so we can use our KNOWN_NODES list instead
      '*:exit': function (node: ASTNode) {
        // For nodes we care about, skip the default handling, because it just marks the node as ignored...
        if (!KNOWN_NODES.has(node.type))
          rules['*:exit'](node)
      },

      PropertyDefinition(node) {
        if (node.parent.type !== AST_NODE_TYPES.ClassBody || !node.decorators?.length || node.loc.start.line === node.loc.end.line)
          return rules.PropertyDefinition(node)

        let startDecorator = node.decorators[0]
        let endDecorator = startDecorator

        for (let i = 1; i <= node.decorators.length; i++) {
          const decorator = node.decorators[i]
          if (i === node.decorators.length || startDecorator.loc.start.line !== decorator.loc.start.line) {
            rules.PropertyDefinition({
              type: AST_NODE_TYPES.PropertyDefinition,
              key: node.key,
              parent: node.parent,
              range: [startDecorator.range[0], endDecorator.range[1]],
              loc: {
                start: startDecorator.loc.start,
                end: endDecorator.loc.end,
              },
            })
            if (decorator)
              startDecorator = endDecorator = decorator
          }
          else {
            endDecorator = decorator
          }
        }

        return rules.PropertyDefinition({
          ...node,
          range: [endDecorator.range[1] + 1, node.range[1]],
          loc: {
            start: node.key.loc.start,
            end: node.loc.end,
          },
        })
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
        const members = 'body' in node ? node.body.members : node.members

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
