import type { ReportFixFunction, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isTokenOnSameLine, STATEMENT_LIST_PARENTS } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'brace-style',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent brace style for blocks',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'string',
        enum: ['1tbs', 'stroustrup', 'allman'],
      },
      {
        type: 'object',
        properties: {
          allowSingleLine: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      nextLineOpen: 'Opening curly brace does not appear on the same line as controlling statement.',
      sameLineOpen: 'Opening curly brace appears on the same line as controlling statement.',
      blockSameLine: 'Statement inside of curly braces should be on next line.',
      nextLineClose: 'Closing curly brace does not appear on the same line as the subsequent block.',
      singleLineClose: 'Closing curly brace should be on the same line as opening curly brace or on the line after the previous block.',
      sameLineClose: 'Closing curly brace appears on the same line as the subsequent block.',
    },
  },
  defaultOptions: ['1tbs', { allowSingleLine: false }],
  create(context, optionsWithDefaults) {
    const [
      style,
      { allowSingleLine } = { allowSingleLine: false },
    ] = optionsWithDefaults

    const isAllmanStyle = style === 'allman'
    const sourceCode = context.sourceCode

    /**
     * Fixes a place where a newline unexpectedly appears
     * @param firstToken The token before the unexpected newline
     * @param secondToken The token after the unexpected newline
     * @returns A fixer function to remove the newlines between the tokens
     */
    function removeNewlineBetween(firstToken: Token, secondToken: Token): ReportFixFunction | null {
      const textRange = [firstToken.range[1], secondToken.range[0]] as const
      const textBetween = sourceCode.text.slice(textRange[0], textRange[1])

      // Don't do a fix if there is a comment between the tokens
      if (textBetween.trim())
        return null

      return fixer => fixer.replaceTextRange(textRange, ' ')
    }

    /**
     * Validates a pair of curly brackets based on the user's config
     * @param openingCurlyToken The opening curly bracket
     * @param closingCurlyToken The closing curly bracket
     */
    function validateCurlyPair(
      openingCurlyToken: Token,
      closingCurlyToken: Token,
    ): void {
      const tokenBeforeOpeningCurly = sourceCode.getTokenBefore(openingCurlyToken)!
      const tokenBeforeClosingCurly = sourceCode.getTokenBefore(closingCurlyToken)!
      const tokenAfterOpeningCurly = sourceCode.getTokenAfter(openingCurlyToken)!
      const singleLineException = allowSingleLine && isTokenOnSameLine(openingCurlyToken, closingCurlyToken)

      if (
        !isAllmanStyle
        && !isTokenOnSameLine(tokenBeforeOpeningCurly, openingCurlyToken)
      ) {
        context.report({
          node: openingCurlyToken,
          messageId: 'nextLineOpen',
          fix: removeNewlineBetween(
            tokenBeforeOpeningCurly!,
            openingCurlyToken,
          ),
        })
      }

      if (
        isAllmanStyle
        && isTokenOnSameLine(tokenBeforeOpeningCurly, openingCurlyToken)
        && !singleLineException
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
        && !singleLineException
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
        && !singleLineException
      ) {
        context.report({
          node: closingCurlyToken,
          messageId: 'singleLineClose',
          fix: fixer => fixer.insertTextBefore(closingCurlyToken, '\n'),
        })
      }
    }

    /**
     * Validates the location of a token that appears before a keyword (e.g. a newline before `else`)
     * @param curlyToken The closing curly token. This is assumed to precede a keyword token (such as `else` or `finally`).
     */
    function validateCurlyBeforeKeyword(curlyToken: Token): void {
      const keywordToken = sourceCode.getTokenAfter(curlyToken)!

      if (style === '1tbs' && !isTokenOnSameLine(curlyToken, keywordToken)) {
        context.report({
          node: curlyToken,
          messageId: 'nextLineClose',
          fix: removeNewlineBetween(curlyToken, keywordToken),
        })
      }

      if (style !== '1tbs' && isTokenOnSameLine(curlyToken, keywordToken)) {
        context.report({
          node: curlyToken,
          messageId: 'sameLineClose',
          fix: fixer => fixer.insertTextAfter(curlyToken, '\n'),
        })
      }
    }

    return {
      BlockStatement(node) {
        if (!STATEMENT_LIST_PARENTS.has(node.parent.type))
          validateCurlyPair(sourceCode.getFirstToken(node)!, sourceCode.getLastToken(node)!)
      },
      StaticBlock(node) {
        validateCurlyPair(
          sourceCode.getFirstToken(node, { skip: 1 })!, // skip the `static` token
          sourceCode.getLastToken(node)!,
        )
      },
      ClassBody(node) {
        validateCurlyPair(sourceCode.getFirstToken(node)!, sourceCode.getLastToken(node)!)
      },
      SwitchStatement(node) {
        const closingCurly = sourceCode.getLastToken(node)
        const openingCurly = sourceCode.getTokenBefore(node.cases.length ? node.cases[0] : closingCurly!)

        validateCurlyPair(openingCurly!, closingCurly!)
      },
      IfStatement(node) {
        if (node.consequent.type === 'BlockStatement' && node.alternate) {
          // Handle the keyword after the `if` block (before `else`)
          validateCurlyBeforeKeyword(sourceCode.getLastToken(node.consequent)!)
        }
      },
      TryStatement(node) {
        // Handle the keyword after the `try` block (before `catch` or `finally`)
        validateCurlyBeforeKeyword(sourceCode.getLastToken(node.block)!)

        if (node.handler && node.finalizer) {
          // Handle the keyword after the `catch` block (before `finally`)
          validateCurlyBeforeKeyword(sourceCode.getLastToken(node.handler.body)!)
        }
      },
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
