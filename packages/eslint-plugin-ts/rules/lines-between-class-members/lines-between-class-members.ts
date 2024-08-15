import type { ASTNode, JSONSchema } from '@shared/types'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { createRule, deepMerge } from '../../utils'
import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('lines-between-class-members')

const schema = Object.values(
  deepMerge(
    { ...baseRule.meta.schema },
    {
      1: {
        properties: {
          exceptAfterOverload: {
            type: 'boolean',
            default: true,
          },
        },
      },
    },
  ),
) as JSONSchema.JSONSchema4[]

export default createRule<RuleOptions, MessageIds>({
  name: 'lines-between-class-members',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow an empty line between class members',
    },
    fixable: 'whitespace',
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema,
    messages: baseRule.meta.messages,
  },
  defaultOptions: [
    'always',
    {
      exceptAfterOverload: true,
      exceptAfterSingleLine: false,
    },
  ],
  create(context, [firstOption, secondOption]) {
    const rules = baseRule.create(context)
    const exceptAfterOverload
      = secondOption?.exceptAfterOverload && firstOption === 'always'

    function isOverload(node: ASTNode): boolean {
      return (
        (node.type === AST_NODE_TYPES.TSAbstractMethodDefinition
        || node.type === AST_NODE_TYPES.MethodDefinition)
        && node.value.type === AST_NODE_TYPES.TSEmptyBodyFunctionExpression
      )
    }

    return {
      ClassBody(node): void {
        const body = exceptAfterOverload
          ? node.body.filter(node => !isOverload(node))
          : node.body

        rules.ClassBody!({ ...node, body })
      },
    }
  },
})
