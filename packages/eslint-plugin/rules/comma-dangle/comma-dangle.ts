import type { EcmaVersion, Tree } from '#types'
import type { MessageIds, RuleOptions, Value } from './types'
import { AST_NODE_TYPES, getNextLocation, isCommaToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

type Extract<T> = T extends Record<any, any> ? T : never
type Option = RuleOptions[0]
type NormalizedOptions = Required<
  Extract<Exclude<Option, string>>
>

const OPTION_VALUE_SCHEME = [
  'always-multiline',
  'always',
  'never',
  'only-multiline',
]

type TargetASTNode
  = | Tree.ArrayExpression
    | Tree.ArrayPattern
    | Tree.ObjectExpression
    | Tree.ObjectPattern
    | Tree.ImportDeclaration
    | Tree.ExportNamedDeclaration
    | Tree.FunctionDeclaration
    | Tree.FunctionExpression
    | Tree.ArrowFunctionExpression
    | Tree.CallExpression
    | Tree.NewExpression
    | Tree.ImportExpression
    | Tree.ExportAllDeclaration
    | Tree.TSEnumDeclaration
    | Tree.TSTypeParameterDeclaration
    | Tree.TSTupleType

type ItemASTNode = NonNullable<
  | Tree.ObjectLiteralElement
  | Tree.ObjectPattern['properties'][number]
  | Tree.ArrayExpression['elements'][number]
  | Tree.ArrayPattern['elements'][number]
  | Tree.ImportClause
  | Tree.ExportSpecifier
  | Tree.Parameter
  | Tree.ImportAttribute
  | Tree.TSEnumMember
  | Tree.TSTypeParameter
  | Tree.TypeNode
>

export default createRule<RuleOptions, MessageIds>({
  name: 'comma-dangle',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow trailing commas',
    },
    schema: {
      $defs: {
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
              $ref: '#/$defs/value',
            },
            {
              type: 'object',
              properties: {
                arrays: { $ref: '#/$defs/valueWithIgnore' },
                objects: { $ref: '#/$defs/valueWithIgnore' },
                imports: { $ref: '#/$defs/valueWithIgnore' },
                exports: { $ref: '#/$defs/valueWithIgnore' },
                functions: { $ref: '#/$defs/valueWithIgnore' },
                importAttributes: { $ref: '#/$defs/valueWithIgnore' },
                dynamicImports: { $ref: '#/$defs/valueWithIgnore' },
                enums: { $ref: '#/$defs/valueWithIgnore' },
                generics: { $ref: '#/$defs/valueWithIgnore' },
                tuples: { $ref: '#/$defs/valueWithIgnore' },
              },
              additionalProperties: false,
            },
          ],
        },
      ],
      additionalItems: false,
    },
    fixable: 'code',
    messages: {
      unexpected: 'Unexpected trailing comma.',
      missing: 'Missing trailing comma.',
    },
  },
  defaultOptions: ['never'],
  create(context, [options]) {
    function normalizeOptions(options: Option = {}, ecmaVersion: EcmaVersion | 'latest' | undefined): NormalizedOptions {
      const DEFAULT_OPTION_VALUE = 'never'

      if (typeof options === 'string') {
        return {
          arrays: options,
          objects: options,
          imports: options,
          exports: options,
          functions: !ecmaVersion || ecmaVersion === 'latest' ? options : ecmaVersion < 2017 ? 'ignore' : options,
          importAttributes: options,
          dynamicImports: !ecmaVersion || ecmaVersion === 'latest' ? options : ecmaVersion < 2025 ? 'ignore' : options,
          enums: options,
          generics: options,
          tuples: options,
        }
      }
      return {
        arrays: options.arrays ?? DEFAULT_OPTION_VALUE,
        objects: options.objects ?? DEFAULT_OPTION_VALUE,
        imports: options.imports ?? DEFAULT_OPTION_VALUE,
        exports: options.exports ?? DEFAULT_OPTION_VALUE,
        functions: options.functions ?? DEFAULT_OPTION_VALUE,
        importAttributes: options.importAttributes ?? DEFAULT_OPTION_VALUE,
        dynamicImports: options.dynamicImports ?? DEFAULT_OPTION_VALUE,
        enums: options.enums ?? DEFAULT_OPTION_VALUE,
        generics: options.generics ?? DEFAULT_OPTION_VALUE,
        tuples: options.tuples ?? DEFAULT_OPTION_VALUE,
      }
    }

    const ecmaVersion = context?.languageOptions?.ecmaVersion ?? context.parserOptions.ecmaVersion as EcmaVersion | undefined
    const normalizedOptions = normalizeOptions(options, ecmaVersion)

    const isTSX = context.parserOptions?.ecmaFeatures?.jsx
      && context.filename?.endsWith('.tsx')

    const sourceCode = context.sourceCode
    const closeBraces = ['}', ']', ')', '>']

    interface VerifyInfo {
      /** A node to check. */
      node: TargetASTNode
      /** The last item of the node. */
      lastItem: ItemASTNode | null
    }

    const predicate: Record<Value | 'ignore' | string, (info: VerifyInfo) => void> = {
      'always': forceTrailingComma,
      'always-multiline': forceTrailingCommaIfMultiline,
      'only-multiline': allowTrailingCommaIfMultiline,
      'never': forbidTrailingComma,
      // https://github.com/typescript-eslint/typescript-eslint/issues/7220
      'ignore': () => {},
    }

    function last<T>(nodes: T[] | undefined): T | null {
      if (!nodes)
        return null
      return nodes[nodes.length - 1] ?? null
    }

    /**
     * Gets the trailing comma token of the given node.
     * If the trailing comma does not exist, this returns the token which is
     * the insertion point of the trailing comma token.
     * @param info The information to verify.
     * @returns The trailing comma token or the insertion point.
     */
    function getTrailingToken(info: VerifyInfo) {
      switch (info.node.type) {
        case 'ObjectExpression':
        case 'ArrayExpression':
        case 'CallExpression':
        case 'NewExpression':
        case 'ImportExpression':
          return sourceCode.getLastToken(info.node, 1)
        default: {
          const lastItem = info.lastItem
          if (!lastItem)
            return null
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
     * @param info The information to verify.
     * @returns `true` if the node is multiline.
     */
    function isMultiline(info: VerifyInfo) {
      const lastItem = info.lastItem

      if (!lastItem)
        return false
      const penultimateToken = getTrailingToken(info)
      if (!penultimateToken)
        return false
      const lastToken = sourceCode.getTokenAfter(penultimateToken)
      if (!lastToken)
        return false

      return lastToken.loc.end.line !== penultimateToken.loc.end.line
    }

    /**
     * Checks whether or not a trailing comma is allowed in a given node.
     * If the `lastItem` is `RestElement` or `RestProperty`, it disallows trailing commas.
     * @param lastItem The node of the last element in the given node.
     * @returns `true` if a trailing comma is allowed.
     */
    function isTrailingCommaAllowed(lastItem: ItemASTNode) {
      return lastItem.type !== 'RestElement'
    }

    /**
     * Reports a trailing comma if it exists.
     * @param info The information to verify.
     */
    function forbidTrailingComma(info: VerifyInfo): void {
      /**
       * We allow tailing comma in TSTypeParameterDeclaration in TSX,
       * because it's used to differentiate JSX tags from generics.
       *
       * https://github.com/microsoft/TypeScript/issues/15713#issuecomment-499474386
       * https://github.com/eslint-stylistic/eslint-stylistic/issues/35
       */
      if (isTSX && info.node.type === AST_NODE_TYPES.TSTypeParameterDeclaration && info.node.params.length === 1)
        return

      const lastItem = info.lastItem

      if (!lastItem)
        return

      const trailingToken = getTrailingToken(info)

      if (trailingToken && isCommaToken(trailingToken)) {
        context.report({
          node: lastItem,
          loc: trailingToken.loc,
          messageId: 'unexpected',
          * fix(fixer) {
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
     * @param info The information to verify.
     */
    function forceTrailingComma(info: VerifyInfo): void {
      const lastItem = info.lastItem

      if (!lastItem)
        return

      if (!isTrailingCommaAllowed(lastItem)) {
        forbidTrailingComma(info)
        return
      }

      const trailingToken = getTrailingToken(info)

      if (!trailingToken || trailingToken.value === ',')
        return

      const nextToken = sourceCode.getTokenAfter(trailingToken)
      if (!nextToken || !closeBraces.includes(nextToken.value))
        return

      context.report({
        node: lastItem,
        loc: {
          start: trailingToken.loc.end,
          end: getNextLocation(sourceCode, trailingToken.loc.end)!,
        },
        messageId: 'missing',
        * fix(fixer) {
          yield fixer.insertTextAfter(trailingToken, ',')

          /**
           * Extend the range of the fix to include surrounding tokens to ensure
           * that the element after which the comma is inserted stays _last_.
           * This intentionally makes conflicts in fix ranges with rules that may be
           * adding or removing elements in the same autofix pass.
           * https://github.com/eslint/eslint/issues/15660
           */
          yield fixer.insertTextBefore(trailingToken, '')
          yield fixer.insertTextAfter(sourceCode.getTokenAfter(trailingToken)!, '')
        },
      })
    }

    /**
     * Only if a given node is not multiline, reports the last element of a given node
     * when it does not have a trailing comma.
     * Otherwise, reports a trailing comma if it exists.
     * @param info The information to verify.
     */
    function allowTrailingCommaIfMultiline(info: VerifyInfo) {
      if (!isMultiline(info))
        forbidTrailingComma(info)
    }

    /**
     * If a given node is multiline, reports the last element of a given node
     * when it does not have a trailing comma.
     * Otherwise, reports a trailing comma if it exists.
     * @param info The information to verify.
     */
    function forceTrailingCommaIfMultiline(info: VerifyInfo) {
      if (isMultiline(info))
        forceTrailingComma(info)
      else
        forbidTrailingComma(info)
    }

    return {
      ObjectExpression: (node) => {
        predicate[normalizedOptions.objects]({
          node,
          lastItem: last(node.properties),
        })
      },
      ObjectPattern: (node) => {
        predicate[normalizedOptions.objects]({
          node,
          lastItem: last(node.properties),
        })
      },
      ArrayExpression: (node) => {
        predicate[normalizedOptions.arrays]({
          node,
          lastItem: last(node.elements),
        })
      },
      ArrayPattern: (node) => {
        predicate[normalizedOptions.arrays]({
          node,
          lastItem: last(node.elements),
        })
      },
      ImportDeclaration: (node) => {
        const lastSpecifier = last(node.specifiers)
        if (lastSpecifier?.type === 'ImportSpecifier') {
          predicate[normalizedOptions.imports]({
            node,
            lastItem: lastSpecifier,
          })
        }
        predicate[normalizedOptions.importAttributes]({
          node,
          lastItem: last(node.attributes),
        })
      },
      ExportNamedDeclaration: (node) => {
        predicate[normalizedOptions.exports]({
          node,
          lastItem: last(node.specifiers),
        })
        predicate[normalizedOptions.importAttributes]({
          node,
          lastItem: last(node.attributes),
        })
      },
      ExportAllDeclaration: (node) => {
        predicate[normalizedOptions.importAttributes]({
          node,
          lastItem: last(node.attributes),
        })
      },
      FunctionDeclaration: (node) => {
        predicate[normalizedOptions.functions]({
          node,
          lastItem: last(node.params),
        })
      },
      FunctionExpression: (node) => {
        predicate[normalizedOptions.functions]({
          node,
          lastItem: last(node.params),
        })
      },
      ArrowFunctionExpression: (node) => {
        predicate[normalizedOptions.functions]({
          node,
          lastItem: last(node.params),
        })
      },
      CallExpression: (node) => {
        predicate[normalizedOptions.functions]({
          node,
          lastItem: last(node.arguments),
        })
      },
      NewExpression: (node) => {
        predicate[normalizedOptions.functions]({
          node,
          lastItem: last(node.arguments),
        })
      },
      ImportExpression: (node) => {
        predicate[normalizedOptions.dynamicImports]({
          node,
          lastItem: node.options ?? node.source,
        })
      },
      TSEnumDeclaration(node) {
        predicate[normalizedOptions.enums]({
          node,
          lastItem: last(node.body?.members ?? node.members),
        })
      },
      TSTypeParameterDeclaration(node) {
        predicate[normalizedOptions.generics]({
          node,
          lastItem: last(node.params),
        })
      },
      TSTupleType(node) {
        predicate[normalizedOptions.tuples]({
          node,
          lastItem: last(node.elementTypes),
        })
      },
    }
  },
})
