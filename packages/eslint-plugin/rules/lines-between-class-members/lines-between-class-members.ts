import type { ASTNode, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isSemicolonToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

type NodeTest = (
  node: ASTNode,
) => boolean

interface NodeTestObject {
  test: NodeTest
}
/**
 * Types of class members.
 * Those have `test` method to check it matches to the given class member.
 * @private
 */
const ClassMemberTypes: Record<string, NodeTestObject> = {
  '*': { test: () => true },
  'field': { test: node => node.type === 'PropertyDefinition' },
  'method': { test: node => node.type === 'MethodDefinition' },
}

export default createRule<RuleOptions, MessageIds>({
  name: 'lines-between-class-members',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow an empty line between class members',
    },
    fixable: 'whitespace',
    schema: [
      {
        anyOf: [
          {
            type: 'object',
            properties: {
              enforce: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    blankLine: { type: 'string', enum: ['always', 'never'] },
                    prev: { type: 'string', enum: ['method', 'field', '*'] },
                    next: { type: 'string', enum: ['method', 'field', '*'] },
                  },
                  additionalProperties: false,
                  required: ['blankLine', 'prev', 'next'],
                },
                minItems: 1,
              },
            },
            additionalProperties: false,
            required: ['enforce'],
          },
          {
            type: 'string',
            enum: ['always', 'never'],
          },
        ],
      },
      {
        type: 'object',
        properties: {
          exceptAfterSingleLine: {
            type: 'boolean',
            default: false,
          },
          exceptAfterOverload: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      never: 'Unexpected blank line between class members.',
      always: 'Expected blank line between class members.',
    },
  },
  defaultOptions: [
    'always',
    {
      exceptAfterOverload: true,
      exceptAfterSingleLine: false,
    },
  ],
  create(context, [firstOption, secondOption]) {
    const options: RuleOptions = []

    options[0] = context.options[0] || 'always'
    options[1] = context.options[1] || { exceptAfterSingleLine: false }

    const configureList = typeof options[0] === 'object' ? options[0].enforce : [{ blankLine: options[0], prev: '*', next: '*' }]
    const sourceCode = context.sourceCode

    /**
     * Gets a pair of tokens that should be used to check lines between two class member nodes.
     *
     * In most cases, this returns the very last token of the current node and
     * the very first token of the next node.
     * For example:
     *
     *     class C {
     *         x = 1;   // curLast: `;` nextFirst: `in`
     *         in = 2
     *     }
     *
     * There is only one exception. If the given node ends with a semicolon, and it looks like
     * a semicolon-less style's semicolon - one that is not on the same line as the preceding
     * token, but is on the line where the next class member starts - this returns the preceding
     * token and the semicolon as boundary tokens.
     * For example:
     *
     *     class C {
     *         x = 1    // curLast: `1` nextFirst: `;`
     *         ;in = 2
     *     }
     * When determining the desired layout of the code, we should treat this semicolon as
     * a part of the next class member node instead of the one it technically belongs to.
     * @param curNode Current class member node.
     * @param nextNode Next class member node.
     * @returns The actual last token of `node`.
     * @private
     */
    function getBoundaryTokens(curNode: ASTNode, nextNode: ASTNode) {
      const lastToken = sourceCode.getLastToken(curNode)!
      const prevToken = sourceCode.getTokenBefore(lastToken)!
      const nextToken = sourceCode.getFirstToken(nextNode)! // skip possible lone `;` between nodes

      const isSemicolonLessStyle = (
        isSemicolonToken(lastToken)
        && !isTokenOnSameLine(prevToken, lastToken)
        && isTokenOnSameLine(lastToken, nextToken)
      )

      return isSemicolonLessStyle
        ? { curLast: prevToken, nextFirst: lastToken }
        : { curLast: lastToken, nextFirst: nextToken }
    }

    /**
     * Return the last token among the consecutive tokens that have no exceed max line difference in between, before the first token in the next member.
     * @param prevLastToken The last token in the previous member node.
     * @param nextFirstToken The first token in the next member node.
     * @param maxLine The maximum number of allowed line difference between consecutive tokens.
     * @returns  The last token among the consecutive tokens.
     */
    function findLastConsecutiveTokenAfter(prevLastToken: Token, nextFirstToken: Token, maxLine: number): Token {
      const after = sourceCode.getTokenAfter(prevLastToken, { includeComments: true })!

      if (after !== nextFirstToken && after.loc.start.line - prevLastToken.loc.end.line <= maxLine)
        return findLastConsecutiveTokenAfter(after, nextFirstToken, maxLine)

      return prevLastToken
    }

    /**
     * Return the first token among the consecutive tokens that have no exceed max line difference in between, after the last token in the previous member.
     * @param nextFirstToken The first token in the next member node.
     * @param prevLastToken The last token in the previous member node.
     * @param maxLine The maximum number of allowed line difference between consecutive tokens.
     * @returns The first token among the consecutive tokens.
     */
    function findFirstConsecutiveTokenBefore(nextFirstToken: Token, prevLastToken: Token, maxLine: number): Token {
      const before = sourceCode.getTokenBefore(nextFirstToken, { includeComments: true })!

      if (before !== prevLastToken && nextFirstToken.loc.start.line - before.loc.end.line <= maxLine)
        return findFirstConsecutiveTokenBefore(before, prevLastToken, maxLine)

      return nextFirstToken
    }

    /**
     * Checks if there is a token or comment between two tokens.
     * @param before The token before.
     * @param after The token after.
     * @returns True if there is a token or comment between two tokens.
     */
    function hasTokenOrCommentBetween(before: Token, after: Token): boolean {
      return sourceCode.getTokensBetween(before, after, { includeComments: true }).length !== 0
    }

    /**
     * Checks whether the given node matches the given type.
     * @param node The class member node to check.
     * @param type The class member type to check.
     * @returns `true` if the class member node matched the type.
     * @private
     */
    function match(node: ASTNode, type: keyof typeof ClassMemberTypes): boolean {
      return ClassMemberTypes[type].test(node)
    }

    /**
     * Finds the last matched configuration from the configureList.
     * @param prevNode The previous node to match.
     * @param nextNode The current node to match.
     * @returns Padding type or `null` if no matches were found.
     * @private
     */
    function getPaddingType(prevNode: ASTNode, nextNode: ASTNode) {
      for (let i = configureList.length - 1; i >= 0; --i) {
        const configure = configureList[i]
        const matched
          = match(prevNode, configure.prev)
            && match(nextNode, configure.next)

        if (matched)
          return configure.blankLine
      }
      return null
    }

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
        (node.type === 'TSAbstractMethodDefinition'
          || node.type === 'MethodDefinition')
        && node.value.type === 'TSEmptyBodyFunctionExpression'
      )
    }

    return {
      ClassBody(node) {
        const body = exceptAfterOverload
          ? node.body.filter(node => !isOverload(node))
          : node.body

        for (let i = 0; i < body.length - 1; i++) {
          const curFirst = sourceCode.getFirstToken(body[i])!
          const { curLast, nextFirst } = getBoundaryTokens(body[i], body[i + 1])
          const isMulti = !isTokenOnSameLine(curFirst, curLast)
          const skip = !isMulti && options[1]!.exceptAfterSingleLine
          const beforePadding = findLastConsecutiveTokenAfter(curLast!, nextFirst!, 1)
          const afterPadding = findFirstConsecutiveTokenBefore(nextFirst!, curLast!, 1)
          const isPadded = afterPadding.loc.start.line - beforePadding.loc.end.line > 1
          const hasTokenInPadding = hasTokenOrCommentBetween(beforePadding, afterPadding)
          const curLineLastToken = findLastConsecutiveTokenAfter(curLast!, nextFirst!, 0)
          const paddingType = getPaddingType(body[i], body[i + 1])

          if (paddingType === 'never' && isPadded) {
            context.report({
              node: body[i + 1],
              messageId: 'never',

              fix(fixer) {
                if (hasTokenInPadding)
                  return null

                return fixer.replaceTextRange([beforePadding.range[1], afterPadding.range[0]], '\n')
              },
            })
          }
          else if (paddingType === 'always' && !skip && !isPadded) {
            context.report({
              node: body[i + 1],
              messageId: 'always',

              fix(fixer) {
                if (hasTokenInPadding)
                  return null

                return fixer.insertTextAfter(curLineLastToken, '\n')
              },
            })
          }
        }
      },
    }
  },
})
