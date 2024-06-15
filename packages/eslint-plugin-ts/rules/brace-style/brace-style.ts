import type { Tree } from '@shared/types'

import { isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'

import { createRule } from '../../utils'
import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('brace-style')

export default createRule<RuleOptions, MessageIds>({
  name: 'brace-style',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent brace style for blocks',
      extendsBaseRule: true,
    },
    messages: baseRule.meta.messages,
    fixable: baseRule.meta.fixable,
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema: baseRule.meta.schema,
  },
  defaultOptions: ['1tbs'],
  create(context) {
    const [style, { allowSingleLine } = { allowSingleLine: false }]

      = context.options

    const isAllmanStyle = style === 'allman'
    const sourceCode = context.sourceCode
    const rules = baseRule.create(context)

    /**
     * Checks a pair of curly brackets based on the user's config
     */
    function validateCurlyPair(
      openingCurlyToken: Tree.Token,
      closingCurlyToken: Tree.Token,
    ): void {
      if (
        allowSingleLine
        && isTokenOnSameLine(openingCurlyToken, closingCurlyToken)
      ) {
        return
      }

      const tokenBeforeOpeningCurly
        = sourceCode.getTokenBefore(openingCurlyToken)!
      const tokenBeforeClosingCurly
        = sourceCode.getTokenBefore(closingCurlyToken)!
      const tokenAfterOpeningCurly
        = sourceCode.getTokenAfter(openingCurlyToken)!

      if (
        !isAllmanStyle
        && !isTokenOnSameLine(tokenBeforeOpeningCurly, openingCurlyToken)
      ) {
        context.report({
          node: openingCurlyToken,
          messageId: 'nextLineOpen',
          fix: (fixer) => {
            const textRange: Tree.Range = [
              tokenBeforeOpeningCurly.range[1],
              openingCurlyToken.range[0],
            ]
            const textBetween = sourceCode.text.slice(
              textRange[0],
              textRange[1],
            )

            if (textBetween.trim())
              return null

            return fixer.replaceTextRange(textRange, ' ')
          },
        })
      }

      if (
        isAllmanStyle
        && isTokenOnSameLine(tokenBeforeOpeningCurly, openingCurlyToken)
      ) {
        context.report({
          node: openingCurlyToken,
          messageId: 'sameLineOpen',
          fix: fixer => fixer.insertTextBefore(openingCurlyToken, '\n'),
        })
      }

      if (
        isTokenOnSameLine(openingCurlyToken, tokenAfterOpeningCurly)
        && tokenAfterOpeningCurly !== closingCurlyToken
      ) {
        context.report({
          node: openingCurlyToken,
          messageId: 'blockSameLine',
          fix: fixer => fixer.insertTextAfter(openingCurlyToken, '\n'),
        })
      }

      if (
        isTokenOnSameLine(tokenBeforeClosingCurly, closingCurlyToken)
        && tokenBeforeClosingCurly !== openingCurlyToken
      ) {
        context.report({
          node: closingCurlyToken,
          messageId: 'singleLineClose',
          fix: fixer => fixer.insertTextBefore(closingCurlyToken, '\n'),
        })
      }
    }

    return {
      ...rules,
      'TSInterfaceBody, TSModuleBlock': function (
        node: Tree.TSInterfaceBody | Tree.TSModuleBlock,
      ): void {
        const openingCurly = sourceCode.getFirstToken(node)!
        const closingCurly = sourceCode.getLastToken(node)!

        validateCurlyPair(openingCurly, closingCurly)
      },
      TSEnumDeclaration(node): void {
        const closingCurly = sourceCode.getLastToken(node)!
        const openingCurly = sourceCode.getTokenBefore(
          node.members.length ? node.members[0] : closingCurly,
        )!

        validateCurlyPair(openingCurly, closingCurly)
      },
    }
  },
})
