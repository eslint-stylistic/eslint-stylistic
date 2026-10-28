/**
 * @fileoverview Specify the maximum number of statements allowed per line.
 * @author Kenneth Williams
 */

import type { ASTNode } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isClosingBraceToken, isNotSemicolonToken, isSemicolonToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const listeningNodes = [
  'BreakStatement',
  'ClassDeclaration',
  'ContinueStatement',
  'DebuggerStatement',
  'DoWhileStatement',
  'ExpressionStatement',
  'ForInStatement',
  'ForOfStatement',
  'ForStatement',
  'FunctionDeclaration',
  'IfStatement',
  'ImportDeclaration',
  'LabeledStatement',
  'ReturnStatement',
  'SwitchStatement',
  'ThrowStatement',
  'TryStatement',
  'VariableDeclaration',
  'WhileStatement',
  'WithStatement',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
  'ExportAllDeclaration',
] as const

export default createRule<RuleOptions, MessageIds>({
  name: 'max-statements-per-line',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce a maximum number of statements allowed per line',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 1,
          },
          ignoredNodes: {
            type: 'array',
            items: {
              type: 'string',
              enum: listeningNodes as unknown as string[],
            },
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ max: 1 }],
    messages: {
      exceed: 'This line has {{numberOfStatementsOnThisLine}} {{statements}}. Maximum allowed is {{maxStatementsPerLine}}.',
    },
  },
  create(context, [options]) {
    const {
      max: maxStatementsPerLine = 1,
      ignoredNodes = [],
    } = options!

    const sourceCode = context.sourceCode

    let lastStatementLine = 0
    let numberOfStatementsOnThisLine = 0
    let firstExtraStatement: ASTNode | null = null

    const SINGLE_CHILD_ALLOWED = /^(?:(?:DoWhile|For|ForIn|ForOf|If|Labeled|While)Statement|Export(?:Default|Named)Declaration)$/u

    /**
     * Reports with the first extra statement, and clears it.
     */
    function reportFirstExtraStatementAndClear() {
      if (firstExtraStatement) {
        const node = firstExtraStatement
        const prevToken = sourceCode.getTokenBefore(node)!

        /**
         * Only split right after a previous statement (`;` or `}`), and not inside a block
         * that starts on the same line (e.g. `if (a) { b; c; }`, `case a: b; break;`).
         */
        const canFix = (isSemicolonToken(prevToken) || isClosingBraceToken(prevToken))
          && (node.parent!.type === 'Program' || node.parent!.loc.start.line < node.loc.start.line)

        context.report({
          node,
          messageId: 'exceed',
          data: {
            numberOfStatementsOnThisLine,
            maxStatementsPerLine,
            statements: numberOfStatementsOnThisLine === 1 ? 'statement' : 'statements',
          },
          fix: canFix
            ? (fixer) => {
                const nextToken = sourceCode.getTokenAfter(prevToken, { includeComments: true })!
                const indent = sourceCode.lines[node.loc.start.line - 1].match(/^\s*/u)![0]

                return fixer.replaceTextRange([prevToken.range[1], nextToken.range[0]], `\n${indent}`)
              }
            : null,
        })
      }
      firstExtraStatement = null
    }

    /**
     * Gets the actual last token of a given node.
     * @param node A node to get. This is a node except EmptyStatement.
     * @returns The actual last token.
     */
    function getActualLastToken(node: ASTNode) {
      return sourceCode.getLastToken(node, isNotSemicolonToken)
    }

    /**
     * Addresses a given node.
     * It updates the state of this rule, then reports the node if the node violated this rule.
     * @param node A node to check.
     */
    function enterStatement(node: ASTNode) {
      const line = node.loc.start.line

      /**
       * Skip to allow non-block statements if this is direct child of control statements.
       * `if (a) foo();` is counted as 1.
       * But `if (a) foo(); else foo();` should be counted as 2.
       */
      if (node.parent
        && SINGLE_CHILD_ALLOWED.test(node.parent.type)
        && (!('alternate' in node.parent) || node.parent.alternate !== node)) {
        return
      }

      // Update state.
      if (line === lastStatementLine) {
        numberOfStatementsOnThisLine += 1
      }
      else {
        reportFirstExtraStatementAndClear()
        numberOfStatementsOnThisLine = 1
        lastStatementLine = line
      }

      // Reports if the node violated this rule.
      if (numberOfStatementsOnThisLine === maxStatementsPerLine + 1)
        firstExtraStatement = firstExtraStatement || node
    }

    /**
     * Updates the state of this rule with the end line of leaving node to check with the next statement.
     * @param node A node to check.
     */
    function leaveStatement(node: ASTNode) {
      const line = getActualLastToken(node)!.loc.end.line

      // Update state.
      if (line !== lastStatementLine) {
        reportFirstExtraStatementAndClear()
        numberOfStatementsOnThisLine = 1
        lastStatementLine = line
      }
    }

    const listeners: Record<string, (node: ASTNode) => void> = {
      'Program:exit': reportFirstExtraStatementAndClear,
    }

    for (const node of listeningNodes) {
      if (ignoredNodes.includes(node))
        continue
      listeners[node] = enterStatement
      listeners[`${node}:exit`] = leaveStatement
    }

    return listeners
  },
})
