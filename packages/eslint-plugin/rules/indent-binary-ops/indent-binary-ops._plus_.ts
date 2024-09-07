import { createRule } from '#utils/create-rule'
import type { ASTNode } from '#types'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  name: 'indent-binary-ops',
  package: 'plus',
  meta: {
    type: 'layout',
    docs: {
      description: 'Indentation for binary operators',
    },
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [
          {
            type: 'integer',
            minimum: 0,
          },
          {
            type: 'string',
            enum: ['tab'],
          },
        ],
      },
    ],
    messages: {
      wrongIndentation: 'Expected indentation of {{expected}}',
    },
  },
  defaultOptions: [2],
  create: (context, options) => {
    const { sourceCode } = context

    const indentStr = options[0] === 'tab' ? '\t' : ' '.repeat(options[0] ?? 2)

    const indentCache = new Map<number, string>()
    function getIndentOfLine(line: number) {
      if (indentCache.has(line))
        return indentCache.get(line)!
      return sourceCode.lines[line - 1].match(/^\s*/)?.[0] ?? ''
    }

    function firstTokenOfLine(line: number) {
      return sourceCode.tokensAndComments.find(token => token.loc.start.line === line)
    }

    function lastTokenOfLine(line: number) {
      return [...sourceCode.tokensAndComments].reverse().find(token => token.loc.end.line === line)
    }

    function handler(node: ASTNode, right: ASTNode) {
      if (node.loc.start.line === node.loc.end.line)
        return

      let tokenRight = sourceCode.getFirstToken(right)!
      let tokenOperator = sourceCode.getTokenBefore(tokenRight)!
      while (tokenOperator.value === '(') {
        tokenRight = tokenOperator
        tokenOperator = sourceCode.getTokenBefore(tokenRight)!
        if (tokenOperator.range[0] <= right.parent!.range[0])
          return
      }
      const tokenLeft = sourceCode.getTokenBefore(tokenOperator)!

      const isMultiline = tokenRight.loc.start.line !== tokenLeft.loc.start.line
      if (!isMultiline)
        return

      // If the first token of the line is a keyword (`if`, `return`, etc),
      //   or the last token of the line is a opening bracket (`[`, `(`, `<`),
      //   we bump the indentation level by one.
      const firstTokenOfLineLeft = firstTokenOfLine(tokenLeft.loc.start.line)
      const lastTokenOfLineLeft = lastTokenOfLine(tokenLeft.loc.start.line)
      const needAdditionIndent = (firstTokenOfLineLeft?.type === 'Keyword' && !['typeof', 'instanceof', 'this'].includes(firstTokenOfLineLeft.value))
        || (firstTokenOfLineLeft?.type === 'Identifier' && firstTokenOfLineLeft.value === 'type' && node.parent?.type === 'TSTypeAliasDeclaration')
        || [':', '[', '(', '<', '='].includes(lastTokenOfLineLeft?.value || '')
        || (['||', '&&'].includes(lastTokenOfLineLeft?.value || '') && node.loc.start.line === tokenLeft.loc.start.line && node.loc.start.column !== getIndentOfLine(node.loc.start.line).length)

      const indentTarget = getIndentOfLine(tokenLeft.loc.start.line) + (needAdditionIndent ? indentStr : '')
      const indentRight = getIndentOfLine(tokenRight.loc.start.line)
      if (indentTarget !== indentRight) {
        const start = {
          line: tokenRight.loc.start.line,
          column: 0,
        }
        const end = {
          line: tokenRight.loc.start.line,
          column: indentRight.length,
        }
        context.report({
          loc: {
            start,
            end,
          },
          messageId: 'wrongIndentation',
          data: {
            expected: `${indentTarget.length} ${options[0] === 'tab' ? 'tab' : 'space'}${indentTarget.length === 1 ? '' : 's'}`,
          },
          fix(fixer) {
            return fixer.replaceTextRange(
              [sourceCode.getIndexFromLoc(start), sourceCode.getIndexFromLoc(end)],
              indentTarget,
            )
          },
        })
        indentCache.set(tokenRight.loc.start.line, indentTarget)
      }
    }

    return {
      BinaryExpression(node) {
        handler(node, node.right)
      },
      LogicalExpression(node) {
        handler(node, node.right)
      },
      TSUnionType(node) {
        if (node.types.length > 1) {
          node.types.forEach((type) => {
            handler(node, type)
          })
        }
      },
      TSIntersectionType(node) {
        if (node.types.length > 1) {
          node.types.forEach((type) => {
            handler(node, type)
          })
        }
      },
    }
  },
})
