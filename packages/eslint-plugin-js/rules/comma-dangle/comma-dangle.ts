/**
 * @fileoverview Rule to forbid or enforce dangling commas.
 * @author Ian Christian Myers
 */
import type { ASTNode, EcmaVersion } from '@shared/types'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { getNextLocation, isCommaToken } from '../../utils/ast-utils'
import { createTSRule } from '../../utils'
import type { MessageIds, RuleOptions, Value } from './types'

const OPTION_VALUE_SCHEME = [
  'always-multiline',
  'always',
  'never',
  'only-multiline',
]

const DEFAULT_OPTIONS = Object.freeze({
  arrays: 'never',
  objects: 'never',
  imports: 'never',
  exports: 'never',
  functions: 'never',
  enums: 'never',
  generics: 'never',
  tuples: 'never',
})

const closeBraces = ['}', ']', ')', '>']

/**
 * Checks whether or not a trailing comma is allowed in a given node.
 * If the `lastItem` is `RestElement` or `RestProperty`, it disallows trailing commas.
 * @param lastItem The node of the last element in the given node.
 * @returns `true` if a trailing comma is allowed.
 */
function isTrailingCommaAllowed(lastItem: ASTNode) {
  return lastItem.type !== AST_NODE_TYPES.RestElement
}

/**
 * Normalize option value.
 * @param optionValue The 1st option value to normalize.
 * @param ecmaVersion The normalized ECMAScript version.
 * @returns The normalized option value.
 */
function normalizeOptions(optionValue: RuleOptions[0], ecmaVersion: EcmaVersion | 'latest' | undefined) {
  if (typeof optionValue === 'string') {
    return {
      arrays: optionValue,
      objects: optionValue,
      imports: optionValue,
      exports: optionValue,
      functions: !ecmaVersion || ecmaVersion === 'latest' ? optionValue : ecmaVersion < 2017 ? 'ignore' : optionValue,
      enums: optionValue,
      generics: optionValue,
      tuples: optionValue,
    }
  }
  if (typeof optionValue === 'object' && optionValue !== null) {
    return {
      arrays: optionValue.arrays ?? DEFAULT_OPTIONS.arrays,
      objects: optionValue.objects ?? DEFAULT_OPTIONS.objects,
      imports: optionValue.imports ?? DEFAULT_OPTIONS.imports,
      exports: optionValue.exports ?? DEFAULT_OPTIONS.exports,
      functions: optionValue.functions ?? DEFAULT_OPTIONS.functions,
      enums: optionValue.enums ?? DEFAULT_OPTIONS.enums,
      generics: optionValue.generics ?? DEFAULT_OPTIONS.generics,
      tuples: optionValue.tuples ?? DEFAULT_OPTIONS.tuples,
    }
  }

  return DEFAULT_OPTIONS
}

export default createTSRule<RuleOptions, MessageIds>({
  name: 'comma-dangle',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow trailing commas',
    },
    fixable: 'code',
    schema: {
      definitions: {
        value: {
          type: 'string',
          enum: OPTION_VALUE_SCHEME,
        },
        valueWithIgnore: {
          type: 'string',
          enum: [...OPTION_VALUE_SCHEME, 'ignore'],
        },
      },
      type: 'array',
      items: [
        {
          oneOf: [
            {
              $ref: '#/definitions/value',
            },
            {
              type: 'object',
              properties: {
                arrays: { $ref: '#/definitions/valueWithIgnore' },
                objects: { $ref: '#/definitions/valueWithIgnore' },
                imports: { $ref: '#/definitions/valueWithIgnore' },
                exports: { $ref: '#/definitions/valueWithIgnore' },
                functions: { $ref: '#/definitions/valueWithIgnore' },
                enums: { $ref: '#/definitions/valueWithIgnore' },
                generics: { $ref: '#/definitions/valueWithIgnore' },
                tuples: { $ref: '#/definitions/valueWithIgnore' },
              },
              additionalProperties: false,
            },
          ],
        },
      ],
      additionalItems: false,
    },
    messages: {
      unexpected: 'Unexpected trailing comma.',
      missing: 'Missing trailing comma.',
    },
  },
  defaultOptions: ['never'],
  create(context, [_options]) {
    const ecmaVersion = context?.languageOptions?.ecmaVersion ?? context.parserOptions.ecmaVersion as EcmaVersion | undefined
    const options = normalizeOptions(_options, ecmaVersion)

    const sourceCode = context.sourceCode
    const isTSX = context.parserOptions?.ecmaFeatures?.jsx && context.filename?.endsWith('.tsx')

    const tsNodes = [
      AST_NODE_TYPES.TSEnumDeclaration,
      AST_NODE_TYPES.TSTypeParameterDeclaration,
      AST_NODE_TYPES.TSTupleType,
    ]

    /**
     * Gets the last item of the given node.
     * @param node The node to get.
     * @returns The last node or null.
     */
    function getLastItem(node: ASTNode): ASTNode | null {
      /**
       * Returns the last element of an array
       * @param nodes The input array
       * @returns The last element
       */
      function last(nodes: (ASTNode | null)[]): ASTNode | null {
        return nodes[nodes.length - 1] ?? null
      }

      switch (node.type) {
        case AST_NODE_TYPES.ObjectExpression:
        case AST_NODE_TYPES.ObjectPattern:
          return last(node.properties)
        case AST_NODE_TYPES.ArrayExpression:
        case AST_NODE_TYPES.ArrayPattern:
          return last(node.elements)
        case AST_NODE_TYPES.ImportDeclaration:
        case AST_NODE_TYPES.ExportNamedDeclaration:
          return last(node.specifiers)
        case AST_NODE_TYPES.FunctionDeclaration:
        case AST_NODE_TYPES.FunctionExpression:
        case AST_NODE_TYPES.ArrowFunctionExpression:
          return last(node.params)
        case AST_NODE_TYPES.CallExpression:
        case AST_NODE_TYPES.NewExpression:
          return last(node.arguments)
        case AST_NODE_TYPES.TSEnumDeclaration:
          return last(node.body.members || node.members)
        case AST_NODE_TYPES.TSTypeParameterDeclaration:
          return last(node.params)
        case AST_NODE_TYPES.TSTupleType:
          return last(node.elementTypes)
        default:
          return null
      }
    }

    /**
     * Gets the trailing comma token of the given node.
     * If the trailing comma does not exist, this returns the token which is
     * the insertion point of the trailing comma token.
     * @param node The node to get.
     * @param lastItem The last item of the node.
     * @returns The trailing comma token or the insertion point.
     */
    function getTrailingToken(node: ASTNode, lastItem: ASTNode) {
      switch (node.type) {
        case AST_NODE_TYPES.ObjectExpression:
        case AST_NODE_TYPES.ArrayExpression:
        case AST_NODE_TYPES.CallExpression:
        case AST_NODE_TYPES.NewExpression:
          return sourceCode.getLastToken(node, 1)
        case AST_NODE_TYPES.TSEnumDeclaration:
        case AST_NODE_TYPES.TSTypeParameterDeclaration:
        case AST_NODE_TYPES.TSTupleType: {
          const last = getLastItem(node)
          const trailing = last && sourceCode.getTokenAfter(last)
          return trailing
        }
        default: {
          const nextToken = sourceCode.getTokenAfter(lastItem)!

          if (isCommaToken(nextToken))
            return nextToken

          return sourceCode.getLastToken(lastItem)
        }
      }
    }

    /**
     * Checks whether or not a given node is multiline.
     * This rule handles a given node as multiline when the closing parenthesis
     * and the last element are not on the same line.
     * @param node A node to check.
     * @returns `true` if the node is multiline.
     */
    function isMultiline(node: ASTNode) {
      const lastItem = getLastItem(node)

      if (!lastItem)
        return false

      if (!tsNodes.includes(node.type)) {
        const penultimateToken = getTrailingToken(node, lastItem)
        if (!penultimateToken)
          return false
        const lastToken = sourceCode.getTokenAfter(penultimateToken)
        if (!lastToken)
          return false

        return lastToken.loc.end.line !== penultimateToken.loc.end.line
      }
      else {
        const lastToken = sourceCode.getLastToken(node)
        return lastItem?.loc.end.line !== lastToken?.loc.end.line
      }
    }

    /**
     * Reports a trailing comma if it exists.
     * @param node A node to check. Its type is one of
     *   ObjectExpression, ObjectPattern, ArrayExpression, ArrayPattern,
     *   ImportDeclaration, and ExportNamedDeclaration.
     */
    function forbidTrailingComma(node: ASTNode) {
      /**
       * We allow tailing comma in TSTypeParameterDeclaration in TSX,
       * because it's used to differentiate JSX tags from generics.
       *
       * https://github.com/microsoft/TypeScript/issues/15713#issuecomment-499474386
       * https://github.com/eslint-stylistic/eslint-stylistic/issues/35
       */
      if (
        isTSX
        && node.type === AST_NODE_TYPES.TSTypeParameterDeclaration
        && node.params.length === 1
      ) {
        return
      }

      const lastItem = getLastItem(node)

      if (
        !lastItem
        || (
          node.type === AST_NODE_TYPES.ImportDeclaration
          && lastItem.type !== AST_NODE_TYPES.ImportSpecifier
        )
      ) {
        return
      }

      const trailingToken = getTrailingToken(node, lastItem)

      if (trailingToken && isCommaToken(trailingToken)) {
        context.report({
          node: lastItem,
          loc: trailingToken.loc,
          messageId: 'unexpected',
          *fix(fixer) {
            yield fixer.remove(trailingToken)

            /**
             * Extend the range of the fix to include surrounding tokens to ensure
             * that the element after which the comma is removed stays _last_.
             * This intentionally makes conflicts in fix ranges with rules that may be
             * adding or removing elements in the same autofix pass.
             * https://github.com/eslint/eslint/issues/15660
             */
            yield fixer.insertTextBefore(sourceCode.getTokenBefore(trailingToken)!, '')
            yield fixer.insertTextAfter(sourceCode.getTokenAfter(trailingToken)!, '')
          },
        })
      }
    }

    /**
     * Reports the last element of a given node if it does not have a trailing
     * comma.
     *
     * If a given node is `ArrayPattern` which has `RestElement`, the trailing
     * comma is disallowed, so report if it exists.
     * @param node A node to check. Its type is one of
     *   ObjectExpression, ObjectPattern, ArrayExpression, ArrayPattern,
     *   ImportDeclaration, and ExportNamedDeclaration.
     */
    function forceTrailingComma(node: ASTNode) {
      const lastItem = getLastItem(node)

      if (
        !lastItem
        || (
          node.type === AST_NODE_TYPES.ImportDeclaration
          && lastItem.type !== AST_NODE_TYPES.ImportSpecifier
        )
      ) {
        return
      }

      if (!isTrailingCommaAllowed(lastItem)) {
        forbidTrailingComma(node)
        return
      }

      const trailingToken = getTrailingToken(node, lastItem)

      if (!trailingToken || isCommaToken(trailingToken))
        return

      const isTSTypeNode = tsNodes.includes(node.type)

      const nextToken = sourceCode.getTokenAfter(trailingToken)
      if (!isTSTypeNode && (!nextToken || !closeBraces.includes(nextToken.value)))
        return

      context.report({
        node: lastItem,
        loc: {
          start: trailingToken.loc.end,
          end: getNextLocation(sourceCode, trailingToken.loc.end)!,
        },
        messageId: 'missing',
        *fix(fixer) {
          const fixNode = isTSTypeNode ? lastItem : trailingToken

          yield fixer.insertTextAfter(fixNode, ',')

          /**
           * Extend the range of the fix to include surrounding tokens to ensure
           * that the element after which the comma is inserted stays _last_.
           * This intentionally makes conflicts in fix ranges with rules that may be
           * adding or removing elements in the same autofix pass.
           * https://github.com/eslint/eslint/issues/15660
           */
          yield fixer.insertTextBefore(fixNode, '')
          yield fixer.insertTextAfter(sourceCode.getTokenAfter(fixNode)!, '')
        },
      })
    }

    /**
     * If a given node is multiline, reports the last element of a given node
     * when it does not have a trailing comma.
     * Otherwise, reports a trailing comma if it exists.
     * @param node A node to check. Its type is one of
     *   ObjectExpression, ObjectPattern, ArrayExpression, ArrayPattern,
     *   ImportDeclaration, and ExportNamedDeclaration.
     */
    function forceTrailingCommaIfMultiline(node: ASTNode) {
      if (isMultiline(node))
        forceTrailingComma(node)
      else
        forbidTrailingComma(node)
    }

    /**
     * Only if a given node is not multiline, reports the last element of a given node
     * when it does not have a trailing comma.
     * Otherwise, reports a trailing comma if it exists.
     * @param node A node to check. Its type is one of
     *   ObjectExpression, ObjectPattern, ArrayExpression, ArrayPattern,
     *   ImportDeclaration, and ExportNamedDeclaration.
     */
    function allowTrailingCommaIfMultiline(node: ASTNode) {
      if (!isMultiline(node))
        forbidTrailingComma(node)
    }

    const predicate: Record<Value | 'ignore' | string, (node: ASTNode) => void> = {
      'always': forceTrailingComma,
      'always-multiline': forceTrailingCommaIfMultiline,
      'only-multiline': allowTrailingCommaIfMultiline,
      'never': forbidTrailingComma,
      ignore() {},
    }

    return {
      ObjectExpression: predicate[options.objects],
      ObjectPattern: predicate[options.objects],

      ArrayExpression: predicate[options.arrays],
      ArrayPattern: predicate[options.arrays],

      ImportDeclaration: predicate[options.imports],

      ExportNamedDeclaration: predicate[options.exports],

      FunctionDeclaration: predicate[options.functions],
      FunctionExpression: predicate[options.functions],
      ArrowFunctionExpression: predicate[options.functions],
      CallExpression: predicate[options.functions],
      NewExpression: predicate[options.functions],

      TSEnumDeclaration: predicate[options.enums],
      TSTypeParameterDeclaration: predicate[options.generics],
      TSTupleType: predicate[options.tuples],
    }
  },
})
