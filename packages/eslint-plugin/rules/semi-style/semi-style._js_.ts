/**
 * @fileoverview Rule to enforce location of semicolons.
 * @author Toru Nagashima
 */

import { isSemicolonToken, isTokenOnSameLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import type { ASTNode, Token } from '#types'
import type { MessageIds, RuleOptions } from './types'

const SELECTOR = [
  'BreakStatement',
  'ContinueStatement',
  'DebuggerStatement',
  'DoWhileStatement',
  'ExportAllDeclaration',
  'ExportDefaultDeclaration',
  'ExportNamedDeclaration',
  'ExpressionStatement',
  'ImportDeclaration',
  'ReturnStatement',
  'ThrowStatement',
  'VariableDeclaration',
  'PropertyDefinition',
].join(',')

/**
 * Get the child node list of a given node.
 * This returns `BlockStatement#body`, `StaticBlock#body`, `Program#body`,
 * `ClassBody#body`, or `SwitchCase#consequent`.
 * This is used to check whether a node is the first/last child.
 * @param node A node to get child node list.
 * @returns The child node list.
 */
function getChildren(node: ASTNode) {
  const t = node.type

  if (
    t === 'BlockStatement'
    || t === 'StaticBlock'
    || t === 'Program'
    || t === 'ClassBody'
  ) {
    return node.body
  }

  if (t === 'SwitchCase')
    return node.consequent

  return null
}

/**
 * Check whether a given node is the last statement in the parent block.
 * @param node A node to check.
 * @returns `true` if the node is the last statement in the parent block.
 */
function isLastChild(node: ASTNode): boolean {
  if (!node.parent)
    return true
  const t = node.parent.type

  if (t === 'IfStatement' && node.parent.consequent === node && node.parent.alternate) { // before `else` keyword.
    return true
  }
  if (t === 'DoWhileStatement') { // before `while` keyword.
    return true
  }
  const nodeList = getChildren(node.parent)

  return nodeList !== null && nodeList[nodeList.length - 1] === node // before `}` or etc.
}

export default createRule<RuleOptions, MessageIds>({
  name: 'semi-style',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce location of semicolons',
    },

    schema: [{ type: 'string', enum: ['last', 'first'] }],
    fixable: 'whitespace',

    messages: {
      expectedSemiColon: 'Expected this semicolon to be at {{pos}}.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const option = context.options[0] || 'last'

    /**
     * Check the given semicolon token.
     * @param semiToken The semicolon token to check.
     * @param expected The expected location to check.
     */
    function check(semiToken: Token, expected: 'last' | 'first'): void {
      const prevToken = sourceCode.getTokenBefore(semiToken)
      const nextToken = sourceCode.getTokenAfter(semiToken)
      const prevIsSameLine = !prevToken || isTokenOnSameLine(prevToken, semiToken)
      const nextIsSameLine = !nextToken || isTokenOnSameLine(semiToken, nextToken)

      if ((expected === 'last' && !prevIsSameLine) || (expected === 'first' && !nextIsSameLine)) {
        context.report({
          loc: semiToken.loc,
          messageId: 'expectedSemiColon',
          data: {
            pos: (expected === 'last')
              ? 'the end of the previous line'
              : 'the beginning of the next line',
          },
          fix(fixer) {
            if (prevToken && nextToken && sourceCode.commentsExistBetween(prevToken, nextToken))
              return null

            const start = prevToken ? prevToken.range[1] : semiToken.range[0]
            const end = nextToken ? nextToken.range[0] : semiToken.range[1]
            const text = (expected === 'last') ? ';\n' : '\n;'

            return fixer.replaceTextRange([start, end], text)
          },
        })
      }
    }

    return {
      [SELECTOR](node) {
        if (option === 'first' && isLastChild(node))
          return

        const lastToken = sourceCode.getLastToken(node)!

        if (isSemicolonToken(lastToken))
          check(lastToken, option)
      },

      ForStatement(node) {
        const firstSemi = node.init && sourceCode.getTokenAfter(node.init, isSemicolonToken)
        const secondSemi = node.test && sourceCode.getTokenAfter(node.test, isSemicolonToken)

        if (firstSemi)
          check(firstSemi, 'last')

        if (secondSemi)
          check(secondSemi, 'last')
      },
    }
  },
})
