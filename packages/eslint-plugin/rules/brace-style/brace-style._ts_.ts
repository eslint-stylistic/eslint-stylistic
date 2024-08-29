import { isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'
import type { MessageIds, RuleOptions } from './types._ts_'
import _baseRule from './brace-style._js_'
import { castRuleModule, createRule } from '#utils/create-rule'
import type { Tree } from '#types'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

export default createRule<RuleOptions, MessageIds>({
  name: 'brace-style',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent brace style for blocks',
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
        const members = node.body?.members || node.members
        const openingCurly = sourceCode.getTokenBefore(
          members.length ? members[0] : closingCurly,
        )!

        validateCurlyPair(openingCurly, closingCurly)
      },
    }
  },
})
