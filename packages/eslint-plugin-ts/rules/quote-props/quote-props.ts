import type { Tree } from '@shared/types'
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils'

import {
  isClosingBraceToken,
  isClosingBracketToken,
  isTokenOnSameLine,
} from '@typescript-eslint/utils/ast-utils'
import {
  createRule,
} from '../../utils'

import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('quote-props')

export default createRule<RuleOptions, MessageIds>({
  name: 'quote-props',
  //
  meta: {
    ...baseRule.meta,
    docs: {
      description: 'Require quotes around object literal property names',
      extendsBaseRule: true,
    },
  },
  defaultOptions: ['never'],
  create(context) {
    const sourceCode = context.sourceCode

    const rules = baseRule.create(context)
    return {
      ...rules,
      TSPropertySignature(node) {
        return rules.Property!({
          ...node,
          shorthand: false,
          method: false,
        })
      },
      TSMethodSignature(node) {
        return rules.Property!({
          ...node,
          shorthand: false,
          method: true,
        })
      },
      TSEnumMember(node) {
        return rules.Property!({
          ...node,
          optional: false,
          shorthand: false,
          method: false,
        })
      },
      TSTypeLiteral(node) {},
      TSInterfaceBody(node) {},
      TSEnumDeclaration(node) {},
    }
  },
})
