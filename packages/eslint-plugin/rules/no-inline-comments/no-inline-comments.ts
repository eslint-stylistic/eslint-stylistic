/**
 * @fileoverview Disallow comments inline with code.
 * @author Greg Cochard
 */
import type { Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isDirectiveComment, isHashbangComment } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'no-inline-comments',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow inline comments after code',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePattern: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{}],
    messages: {
      unexpectedInlineComment: 'Unexpected comment inline with code.',
    },
  },
  create(context, [{ ignorePattern }]) {
    const sourceCode = context.sourceCode
    const customIgnoreRegExp = ignorePattern
      ? new RegExp(ignorePattern, 'u')
      : null

    /**
     * Will check that comments are not on lines starting with or ending with code
     * @param node The comment node to check
     */
    function testCodeAroundComment(node: Tree.Comment) {
      const startLine = String(sourceCode.lines[node.loc.start.line - 1])
      const endLine = String(sourceCode.lines[node.loc.end.line - 1])
      const preamble = startLine.slice(0, node.loc.start.column).trim()
      const postamble = endLine.slice(node.loc.end.column).trim()
      const isPreambleEmpty = !preamble
      const isPostambleEmpty = !postamble

      // Nothing on both sides
      if (isPreambleEmpty && isPostambleEmpty)
        return

      // Matches the ignore pattern
      if (customIgnoreRegExp?.test(node.value))
        return

      // JSX Exception
      if (
        (isPreambleEmpty || preamble === '{')
        && (isPostambleEmpty || postamble === '}')
      ) {
        const enclosingNode = sourceCode.getNodeByRangeIndex(node.range[0])

        if (enclosingNode && enclosingNode.type === 'JSXEmptyExpression')
          return
      }

      // Don't report ESLint directive comments
      if (isDirectiveComment(node))
        return

      context.report({
        node,
        messageId: 'unexpectedInlineComment',
      })
    }

    return {
      Program() {
        sourceCode
          .getAllComments()
          .filter(token => !isHashbangComment(token))
          .forEach(testCodeAroundComment)
      },
    }
  },
})
