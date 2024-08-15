/**
 * @fileoverview Specify the maximum number of statements allowed per line.
 * @author Kenneth Williams
 */

import type { MessageIds, RuleOptions } from './types'
import type { ASTNode } from '#types'
import { isNotSemicolonToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'max-statements-per-line',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Enforce a maximum number of statements allowed per line',
    },

    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      exceed: 'This line has {{numberOfStatementsOnThisLine}} {{statements}}. Maximum allowed is {{maxStatementsPerLine}}.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const options = context.options[0] || {}
    const maxStatementsPerLine = typeof options.max !== 'undefined' ? options.max : 1

    let lastStatementLine = 0
    let numberOfStatementsOnThisLine = 0
    let firstExtraStatement: ASTNode | null = null

    const SINGLE_CHILD_ALLOWED = /^(?:(?:DoWhile|For|ForIn|ForOf|If|Labeled|While)Statement|Export(?:Default|Named)Declaration)$/u

    /**
     * Reports with the first extra statement, and clears it.
     */
    function reportFirstExtraStatementAndClear() {
      if (firstExtraStatement) {
        context.report({
          node: firstExtraStatement,
          messageId: 'exceed',
          data: {
            numberOfStatementsOnThisLine,
            maxStatementsPerLine,
            statements: numberOfStatementsOnThisLine === 1 ? 'statement' : 'statements',
          },
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
        && (!('alternate' in node.parent) || node.parent.alternate !== node)
      ) {
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

    return {
      'BreakStatement': enterStatement,
      'ClassDeclaration': enterStatement,
      'ContinueStatement': enterStatement,
      'DebuggerStatement': enterStatement,
      'DoWhileStatement': enterStatement,
      'ExpressionStatement': enterStatement,
      'ForInStatement': enterStatement,
      'ForOfStatement': enterStatement,
      'ForStatement': enterStatement,
      'FunctionDeclaration': enterStatement,
      'IfStatement': enterStatement,
      'ImportDeclaration': enterStatement,
      'LabeledStatement': enterStatement,
      'ReturnStatement': enterStatement,
      'SwitchStatement': enterStatement,
      'ThrowStatement': enterStatement,
      'TryStatement': enterStatement,
      'VariableDeclaration': enterStatement,
      'WhileStatement': enterStatement,
      'WithStatement': enterStatement,
      'ExportNamedDeclaration': enterStatement,
      'ExportDefaultDeclaration': enterStatement,
      'ExportAllDeclaration': enterStatement,

      'BreakStatement:exit': leaveStatement,
      'ClassDeclaration:exit': leaveStatement,
      'ContinueStatement:exit': leaveStatement,
      'DebuggerStatement:exit': leaveStatement,
      'DoWhileStatement:exit': leaveStatement,
      'ExpressionStatement:exit': leaveStatement,
      'ForInStatement:exit': leaveStatement,
      'ForOfStatement:exit': leaveStatement,
      'ForStatement:exit': leaveStatement,
      'FunctionDeclaration:exit': leaveStatement,
      'IfStatement:exit': leaveStatement,
      'ImportDeclaration:exit': leaveStatement,
      'LabeledStatement:exit': leaveStatement,
      'ReturnStatement:exit': leaveStatement,
      'SwitchStatement:exit': leaveStatement,
      'ThrowStatement:exit': leaveStatement,
      'TryStatement:exit': leaveStatement,
      'VariableDeclaration:exit': leaveStatement,
      'WhileStatement:exit': leaveStatement,
      'WithStatement:exit': leaveStatement,
      'ExportNamedDeclaration:exit': leaveStatement,
      'ExportDefaultDeclaration:exit': leaveStatement,
      'ExportAllDeclaration:exit': leaveStatement,
      'Program:exit': reportFirstExtraStatementAndClear,
    }
  },
})
