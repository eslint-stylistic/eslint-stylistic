import type { Tree } from '@shared/types'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'

import { createRule } from '../../utils'
import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('quotes')

export default createRule<RuleOptions, MessageIds>({
  name: 'quotes',
  meta: {
    type: 'layout',
    docs: {
      description:
        'Enforce the consistent use of either backticks, double, or single quotes',
    },
    fixable: 'code',
    hasSuggestions: baseRule.meta.hasSuggestions,
    messages: baseRule.meta.messages,
    schema: baseRule.meta.schema,
  },
  defaultOptions: [
    'double',
    {
      allowTemplateLiterals: false,
      avoidEscape: false,
      ignoreStringLiterals: false,
    },
  ],
  create(context, [option]) {
    const rules = baseRule.create(context)

    function isAllowedAsNonBacktick(node: Tree.Literal): boolean {
      const parent = node.parent

      switch (parent?.type) {
        case AST_NODE_TYPES.TSAbstractMethodDefinition:
        case AST_NODE_TYPES.TSMethodSignature:
        case AST_NODE_TYPES.TSPropertySignature:
        case AST_NODE_TYPES.TSModuleDeclaration:
        case AST_NODE_TYPES.TSExternalModuleReference:
          return true

        case AST_NODE_TYPES.TSEnumMember:
          return node === parent.id

        case AST_NODE_TYPES.TSAbstractPropertyDefinition:
        case AST_NODE_TYPES.PropertyDefinition:
          return node === parent.key

        case AST_NODE_TYPES.TSLiteralType:
          return parent.parent?.type === AST_NODE_TYPES.TSImportType

        default:
          return false
      }
    }

    return {
      Literal(node): void {
        if (option === 'backtick' && isAllowedAsNonBacktick(node))
          return

        rules.Literal!(node)
      },

      TemplateLiteral(node): void {
        rules.TemplateLiteral!(node)
      },
    }
  },
})
