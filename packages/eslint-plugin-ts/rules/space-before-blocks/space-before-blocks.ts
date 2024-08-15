import type { Tree } from '@shared/types'

import { isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'

import { createRule } from '../../utils'
import { getJsRule } from '../../utils/get-js-rule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getJsRule('space-before-blocks')

export default createRule<RuleOptions, MessageIds>({
  name: 'space-before-blocks',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing before blocks',
    },
    fixable: baseRule.meta.fixable,
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema: baseRule.meta.schema,
    messages: {
      unexpectedSpace: 'Unexpected space before opening brace.',
      missingSpace: 'Missing space before opening brace.',
      ...baseRule.meta.messages,
    },
  },
  defaultOptions: ['always'],
  create(context, [config]) {
    const rules = baseRule.create(context)
    const sourceCode = context.sourceCode

    let requireSpace = true

    if (typeof config === 'object')
      requireSpace = config.classes === 'always'
    else if (config === 'never')
      requireSpace = false

    function checkPrecedingSpace(
      node: Tree.Token | Tree.TSInterfaceBody,
    ): void {
      const precedingToken = sourceCode.getTokenBefore(node)
      if (precedingToken && isTokenOnSameLine(precedingToken, node)) {
        //  -- TODO - switch once our min ESLint version is 6.7.0
        const hasSpace = sourceCode.isSpaceBetweenTokens(
          precedingToken,
          node as Tree.Token,
        )

        if (requireSpace && !hasSpace) {
          context.report({
            node,
            messageId: 'missingSpace',
            fix(fixer) {
              return fixer.insertTextBefore(node, ' ')
            },
          })
        }
        else if (!requireSpace && hasSpace) {
          context.report({
            node,
            messageId: 'unexpectedSpace',
            fix(fixer) {
              return fixer.removeRange([
                precedingToken.range[1],
                node.range[0],
              ])
            },
          })
        }
      }
    }

    function checkSpaceAfterEnum(node: Tree.TSEnumDeclaration): void {
      const punctuator = sourceCode.getTokenAfter(node.id)
      if (punctuator)
        checkPrecedingSpace(punctuator)
    }

    return {
      ...rules,
      TSEnumDeclaration: checkSpaceAfterEnum,
      TSInterfaceBody: checkPrecedingSpace,
    }
  },
})
