import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import type { MessageIds, RuleOptions } from './types._ts_'
import _baseRule from './lines-between-class-members._js_'
import { castRuleModule, createRule } from '#utils/create-rule'
import type { ASTNode, JSONSchema } from '#types'

import { deepMerge } from '#utils/merge'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

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
      = secondOption?.exceptAfterOverload && (
        firstOption === 'always'
        || (
          typeof firstOption !== 'string'
          && firstOption?.enforce.some(({ blankLine, prev, next }) => blankLine === 'always' && prev !== 'field' && next !== 'field')
        )
      )

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
