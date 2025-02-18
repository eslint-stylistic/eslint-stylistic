import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import type { MessageIds, RuleOptions } from './types'
import { castRuleModule, createRule } from '#utils/create-rule'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import _baseRule from './semi-spacing._js_'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

export default createRule<RuleOptions, MessageIds>({
  name: 'semi-spacing',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing before and after semicolons',
    },
    fixable: 'whitespace',
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema: baseRule.meta.schema,
    messages: baseRule.meta.messages,
  },
  create(context) {
    const rules = baseRule.create(context)
    const checkNode = rules.ExpressionStatement

    const tsNodesToCheck = [
      AST_NODE_TYPES.TSDeclareFunction,
      AST_NODE_TYPES.TSTypeAliasDeclaration,
    ].reduce<TSESLint.RuleListener>((acc, node) => {
      acc[node as string] = checkNode
      return acc
    }, {})

    const excludeNodeTypes = new Set([
      AST_NODE_TYPES.TSDeclareFunction,
    ])

    return {
      ...rules,
      ...tsNodesToCheck,
      TSTypeAnnotation(node) {
        if (node.parent && !excludeNodeTypes.has(node.parent.type))
          checkNode!(node.parent as TSESTree.ExpressionStatement)
      },
    }
  },
})
