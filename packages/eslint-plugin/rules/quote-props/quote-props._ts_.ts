import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import type { MessageIds, RuleOptions } from './types._ts_'
import _baseRule from './quote-props._js_'
import { castRuleModule, createRule } from '#utils/create-rule'
import type { Tree } from '#types'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

export default createRule<RuleOptions, MessageIds>({
  name: 'quote-props',
  package: 'ts',
  meta: {
    ...baseRule.meta,
    docs: {
      description: 'Require quotes around object literal, type literal, interfaces and enums property names',
    },
  },
  defaultOptions: ['always'],
  create(context) {
    const rules = baseRule.create(context)

    return {
      ...rules,
      TSPropertySignature(node) {
        return rules.Property!({
          ...node as unknown as Tree.Property,
          type: AST_NODE_TYPES.Property,
          shorthand: false,
          method: false,
          kind: 'init',
          value: null as any,
        })
      },
      TSMethodSignature(node) {
        return rules.Property!({
          ...node as unknown as Tree.Property,
          type: AST_NODE_TYPES.Property,
          shorthand: false,
          method: true,
          kind: 'init',
          value: null as any,
        })
      },
      TSEnumMember(node) {
        return rules.Property!({
          ...node as unknown as Tree.Property,
          type: AST_NODE_TYPES.Property,
          key: node.id as any,
          optional: false,
          shorthand: false,
          method: false,
          kind: 'init',
          value: null as any,
        })
      },
      TSTypeLiteral(node) {
        return rules.ObjectExpression!({
          ...node,
          type: AST_NODE_TYPES.ObjectExpression,
          properties: node.members as any,
        })
      },
      TSInterfaceBody(node) {
        return rules.ObjectExpression!({
          ...node,
          type: AST_NODE_TYPES.ObjectExpression,
          properties: node.body as any,
        })
      },
      TSEnumDeclaration(node) {
        const members = node.body?.members || node.members
        return rules.ObjectExpression!({
          ...node,
          type: AST_NODE_TYPES.ObjectExpression,
          properties: members.map(member => ({ ...member, key: member.id })) as any,
        })
      },
    }
  },
})
