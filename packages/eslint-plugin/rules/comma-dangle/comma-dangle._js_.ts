/**
 * @fileoverview Rule to forbid or enforce dangling commas.
 * @author Ian Christian Myers
 */
import type { EcmaVersion, Tree } from '#types'
import type { MessageIds, RuleOptions, Value } from './types._js_'
import { getNextLocation, isCommaToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const DEFAULT_OPTIONS = Object.freeze({
  arrays: 'never',
  objects: 'never',
  imports: 'never',
  exports: 'never',
  functions: 'never',
  importAttributes: 'never',
  dynamicImports: 'never',
})

const closeBraces = ['}', ']', ')', '>']

type TargetASTNode =
  | Tree.ArrayExpression
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

type ItemASTNode = NonNullable<
  | Tree.ObjectLiteralElement
  | Tree.ObjectPattern['properties'][number]
  | Tree.ArrayExpression['elements'][number]
  | Tree.ArrayPattern['elements'][number]
  | Tree.ImportClause
  | Tree.ExportSpecifier
  | Tree.Parameter
  | Tree.ImportAttribute
>

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
      importAttributes: optionValue,
      dynamicImports: !ecmaVersion || ecmaVersion === 'latest' ? optionValue : ecmaVersion < 2025 ? 'ignore' : optionValue,
    }
  }
  if (typeof optionValue === 'object' && optionValue !== null) {
    return {
      arrays: optionValue.arrays || DEFAULT_OPTIONS.arrays,
      objects: optionValue.objects || DEFAULT_OPTIONS.objects,
      imports: optionValue.imports || DEFAULT_OPTIONS.imports,
      exports: optionValue.exports || DEFAULT_OPTIONS.exports,
      functions: optionValue.functions || DEFAULT_OPTIONS.functions,
      importAttributes: optionValue.importAttributes || DEFAULT_OPTIONS.importAttributes,
      dynamicImports: optionValue.dynamicImports || DEFAULT_OPTIONS.dynamicImports,
    }
  }

  return DEFAULT_OPTIONS
}

export default createRule<RuleOptions, MessageIds>({
  name: 'comma-dangle',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Require or disallow trailing commas',
      recommended: true,
    },

    fixable: 'code',

    schema: {
      definitions: {
        value: {
          type: 'string',
          enum: [
            'always-multiline',
            'always',
            'never',
            'only-multiline',
          ],
        },
        valueWithIgnore: {
          type: 'string',
          enum: [
            'always-multiline',
            'always',
            'ignore',
            'never',
            'only-multiline',
          ],
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
                importAttributes: { $ref: '#/definitions/valueWithIgnore' },
                dynamicImports: { $ref: '#/definitions/valueWithIgnore' },
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

  create(context) {
    const ecmaVersion = context?.languageOptions?.ecmaVersion ?? context.parserOptions.ecmaVersion as EcmaVersion | undefined
    const options = normalizeOptions(context.options[0], ecmaVersion)

    const sourceCode = context.sourceCode

    /**
     * Returns the last element of an array
     * @param array The input array
     * @returns The last element
     */
    function last<T>(array: T[] | undefined): T | null {
      if (!array)
        return null
      return array[array.length - 1] ?? null
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
     * Reports a trailing comma if it exists.
     * @param info The information to verify.
     */
    function forbidTrailingComma(info: VerifyInfo) {
      const lastItem = info.lastItem

      if (!lastItem)
        return

      const trailingToken = getTrailingToken(info)

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
     * @param info The information to verify.
     */
    function forceTrailingComma(info: VerifyInfo) {
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
        *fix(fixer) {
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
      ignore() {},
    }

    return {
      ObjectExpression: (node) => {
        predicate[options.objects]({
          node,
          lastItem: last(node.properties),
        })
      },
      ObjectPattern: (node) => {
        predicate[options.objects]({
          node,
          lastItem: last(node.properties),
        })
      },
      ArrayExpression: (node) => {
        predicate[options.arrays]({
          node,
          lastItem: last(node.elements),
        })
      },
      ArrayPattern: (node) => {
        predicate[options.arrays]({
          node,
          lastItem: last(node.elements),
        })
      },
      ImportDeclaration: (node) => {
        const lastSpecifier = last(node.specifiers)
        if (lastSpecifier?.type === 'ImportSpecifier') {
          predicate[options.imports]({
            node,
            lastItem: lastSpecifier,
          })
        }
        predicate[options.importAttributes]({
          node,
          lastItem: last(node.attributes),
        })
      },
      ExportNamedDeclaration: (node) => {
        predicate[options.exports]({
          node,
          lastItem: last(node.specifiers),
        })
        predicate[options.importAttributes]({
          node,
          lastItem: last(node.attributes),
        })
      },
      ExportAllDeclaration: (node) => {
        predicate[options.importAttributes]({
          node,
          lastItem: last(node.attributes),
        })
      },
      FunctionDeclaration: (node) => {
        predicate[options.functions]({
          node,
          lastItem: last(node.params),
        })
      },
      FunctionExpression: (node) => {
        predicate[options.functions]({
          node,
          lastItem: last(node.params),
        })
      },
      ArrowFunctionExpression: (node) => {
        predicate[options.functions]({
          node,
          lastItem: last(node.params),
        })
      },
      CallExpression: (node) => {
        predicate[options.functions]({
          node,
          lastItem: last(node.arguments),
        })
      },
      NewExpression: (node) => {
        predicate[options.functions]({
          node,
          lastItem: last(node.arguments),
        })
      },
      ImportExpression: (node) => {
        predicate[options.dynamicImports]({
          node,
          lastItem: node.options ?? node.source,
        })
      },
    }
  },
})
