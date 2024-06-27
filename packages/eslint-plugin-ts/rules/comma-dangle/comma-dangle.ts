import type { ASTNode, Tree } from '@shared/types'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { isCommaToken } from '@typescript-eslint/utils/ast-utils'

import { createRule } from '../../utils'
import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('comma-dangle')

type Extract<T> = T extends Record<any, any> ? T : never
type Option = RuleOptions[0]
type NormalizedOptions = Required<
  Pick<Extract<Exclude<Option, string>>, 'enums' | 'generics' | 'tuples'>
>

const OPTION_VALUE_SCHEME = [
  'always-multiline',
  'always',
  'never',
  'only-multiline',
]

const DEFAULT_OPTION_VALUE = 'never'

function normalizeOptions(options: Option = {}): NormalizedOptions {
  if (typeof options === 'string') {
    return {
      enums: options,
      generics: options,
      tuples: options,
    }
  }
  return {
    enums: options.enums ?? DEFAULT_OPTION_VALUE,
    generics: options.generics ?? DEFAULT_OPTION_VALUE,
    tuples: options.tuples ?? DEFAULT_OPTION_VALUE,
  }
}

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
    hasSuggestions: baseRule.meta.hasSuggestions,
    messages: baseRule.meta.messages,
  },
  defaultOptions: ['never'],
  create(context, [options]) {
    const rules = baseRule.create(context)
    const sourceCode = context.sourceCode
    const normalizedOptions = normalizeOptions(options)
    const isTSX = context.parserOptions?.ecmaFeatures?.jsx
      && context.filename?.endsWith('.tsx')

    const predicate = {
      'always': forceComma,
      'always-multiline': forceCommaIfMultiline,
      'only-multiline': allowCommaIfMultiline,
      'never': forbidComma,
      // https://github.com/typescript-eslint/typescript-eslint/issues/7220
      'ignore': () => {},
    }

    function last(nodes: ASTNode[]): ASTNode | null {
      return nodes[nodes.length - 1] ?? null
    }

    function getLastItem(node: ASTNode): ASTNode | null {
      switch (node.type) {
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

    function getTrailingToken(node: ASTNode): Tree.Token | null {
      const last = getLastItem(node)
      const trailing = last && sourceCode.getTokenAfter(last)
      return trailing
    }

    function isMultiline(node: ASTNode): boolean {
      const last = getLastItem(node)
      const lastToken = sourceCode.getLastToken(node)
      return last?.loc.end.line !== lastToken?.loc.end.line
    }

    function forbidComma(node: ASTNode): void {
      /**
       * We allow tailing comma in TSTypeParameterDeclaration in TSX,
       * because it's used to differentiate JSX tags from generics.
       *
       * https://github.com/microsoft/TypeScript/issues/15713#issuecomment-499474386
       * https://github.com/eslint-stylistic/eslint-stylistic/issues/35
       */
      if (isTSX && node.type === AST_NODE_TYPES.TSTypeParameterDeclaration && node.params.length === 1)
        return

      /**
       * Forbid tailing comma
       */
      const last = getLastItem(node)
      const trailing = getTrailingToken(node)
      if (last && trailing && isCommaToken(trailing)) {
        context.report({
          node,
          messageId: 'unexpected',
          fix(fixer) {
            return fixer.remove(trailing)
          },
        })
      }
    }

    function forceComma(node: ASTNode): void {
      const last = getLastItem(node)
      const trailing = getTrailingToken(node)
      if (last && trailing && !isCommaToken(trailing)) {
        context.report({
          node,
          messageId: 'missing',
          fix(fixer) {
            return fixer.insertTextAfter(last, ',')
          },
        })
      }
    }

    function allowCommaIfMultiline(node: ASTNode): void {
      if (!isMultiline(node))
        forbidComma(node)
    }

    function forceCommaIfMultiline(node: ASTNode): void {
      if (isMultiline(node))
        forceComma(node)
      else
        forbidComma(node)
    }

    return {
      ...rules,
      TSEnumDeclaration: predicate[normalizedOptions.enums],
      TSTypeParameterDeclaration: predicate[normalizedOptions.generics],
      TSTupleType: predicate[normalizedOptions.tuples],
    }
  },
})
