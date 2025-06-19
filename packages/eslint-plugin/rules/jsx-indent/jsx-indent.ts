/**
 * @fileoverview Validate JSX indentation
 * @author Yannick Croissant
 *
 * This rule has been ported and modified from eslint and nodeca.
 * @author Vitaly Puzrin
 * @author Gyandeep Singh
 * @copyright 2015 Vitaly Puzrin. All rights reserved.
 * @copyright 2015 Gyandeep Singh. All rights reserved.
 */
/*
 Copyright (C) 2014 by Vitaly Puzrin

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the 'Software'), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import type { ASTNode, ReportFixFunction, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { getFirstNodeInLine, isColonToken, isCommaToken, isNodeFirstInLine } from '#utils/ast'
import { isJSX, isReturningJSX } from '#utils/ast/jsx'
import { createRule } from '#utils/create-rule'

const messages = {
  wrongIndent: 'Expected indentation of {{needed}} {{type}} {{characters}} but found {{gotten}}.',
}

export default createRule<RuleOptions, MessageIds>({
  name: 'jsx-indent',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce JSX indentation. Deprecated, use `indent` rule instead.',
    },

    deprecated: true,

    fixable: 'whitespace',

    messages,

    schema: [
      {
        anyOf: [
          {
            type: 'string',
            enum: ['tab'],
          },
          {
            type: 'integer',
          },
        ],
      },
      {
        type: 'object',
        properties: {
          checkAttributes: {
            type: 'boolean',
          },
          indentLogicalExpressions: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const extraColumnStart = 0
    let indentType = 'space'
    let indentSize = 4

    if (context.options.length) {
      if (context.options[0] === 'tab') {
        indentSize = 1
        indentType = 'tab'
      }
      else if (typeof context.options[0] === 'number') {
        indentSize = context.options[0]
        indentType = 'space'
      }
    }

    const indentChar = indentType === 'space' ? ' ' : '\t'
    const options = context.options[1] || {}
    const checkAttributes = options.checkAttributes || false
    const indentLogicalExpressions = options.indentLogicalExpressions || false

    /**
     * Responsible for fixing the indentation issue fix
     * @param node Node violating the indent rule
     * @param needed Expected indentation character count
     * @returns function to be executed by the fixer
     * @private
     */
    function getFixerFunction(node: ASTNode, needed: number): ReportFixFunction {
      const indent = new Array(needed + 1).join(indentChar)

      if (node.type === 'JSXText' || node.type === 'Literal') {
        return function fix(fixer) {
          const regExp = /\n[\t ]*(\S)/g
          const fixedText = node.raw.replace(regExp, (match, p1) => `\n${indent}${p1}`)
          return fixer.replaceText(node, fixedText)
        }
      }

      if (node.type === 'ReturnStatement') {
        const raw = context.sourceCode.getText(node)
        const lines = raw.split('\n')
        if (lines.length > 1) {
          return function fix(fixer) {
            const lastLineStart = raw.lastIndexOf('\n')
            const lastLine = raw.slice(lastLineStart).replace(/^\n[\t ]*(\S)/, (match, p1) => `\n${indent}${p1}`)
            return fixer.replaceTextRange(
              [node.range[0] + lastLineStart, node.range[1]],
              lastLine,
            )
          }
        }
      }

      return function fix(fixer) {
        return fixer.replaceTextRange(
          [node.range[0] - node.loc.start.column, node.range[0]],
          indent,
        )
      }
    }

    /**
     * Reports a given indent violation and properly pluralizes the message
     * @param node Node violating the indent rule
     * @param needed Expected indentation character count
     * @param gotten Indentation character count in the actual node/code
     * @param [loc] Error line and column location
     */
    function report(node: ASTNode, needed: number, gotten: number, loc?: ASTNode['loc']) {
      const msgContext = {
        needed,
        type: indentType,
        characters: needed === 1 ? 'character' : 'characters',
        gotten,
      }

      context.report({
        node,
        messageId: 'wrongIndent',
        data: msgContext,
        fix: getFixerFunction(node, needed),
        ...loc ? { loc } : {},
      })
    }

    /**
     * Get node indent
     * @param node Node to examine
     * @param [byLastLine] get indent of node's last line
     * @param [excludeCommas] skip comma on start of line
     * @return {number} Indent
     */
    function getNodeIndent(node: ASTNode | Token, byLastLine = false, excludeCommas = false) {
      let src = context.sourceCode.getText(node, node.loc.start.column + extraColumnStart)
      const lines = src.split('\n')
      if (byLastLine)
        src = lines[lines.length - 1]
      else
        src = lines[0]

      const skip = excludeCommas ? ',' : ''

      let regExp
      if (indentType === 'space')
        regExp = new RegExp(`^[ ${skip}]+`)
      else
        regExp = new RegExp(`^[\t${skip}]+`)

      const indent = regExp.exec(src)
      return indent ? indent[0].length : 0
    }

    /**
     * Check if the node is the right member of a logical expression
     * @param node The node to check
     * @return {boolean} true if its the case, false if not
     */
    function isRightInLogicalExp(node: ASTNode) {
      return (
        node.parent
        && node.parent.parent
        && node.parent.parent.type === 'LogicalExpression'
        && node.parent.parent.right === node.parent
        && !indentLogicalExpressions
      )
    }

    /**
     * Check if the node is the alternate member of a conditional expression
     * @param node The node to check
     * @return {boolean} true if its the case, false if not
     */
    function isAlternateInConditionalExp(node: ASTNode) {
      return (
        node.parent
        && node.parent.parent
        && node.parent.parent.type === 'ConditionalExpression'
        && node.parent.parent.alternate === node.parent
        && context.sourceCode.getTokenBefore(node)!.value !== '('
      )
    }

    /**
     * Check if the node is within a DoExpression block but not the first expression (which need to be indented)
     * @param node The node to check
     * @return {boolean} true if its the case, false if not
     */
    function isSecondOrSubsequentExpWithinDoExp(node: ASTNode) {
      /**
       * It returns true when node.parent.parent.parent.parent matches:
       *
       * DoExpression({
       *   ...,
       *   body: BlockStatement({
       *     ...,
       *     body: [
       *       ...,  // 1-n times
       *       ExpressionStatement({
       *         ...,
       *         expression: JSXElement({
       *           ...,
       *           openingElement: JSXOpeningElement()  // the node
       *         })
       *       }),
       *       ...  // 0-n times
       *     ]
       *   })
       * })
       *
       * except:
       *
       * DoExpression({
       *   ...,
       *   body: BlockStatement({
       *     ...,
       *     body: [
       *       ExpressionStatement({
       *         ...,
       *         expression: JSXElement({
       *           ...,
       *           openingElement: JSXOpeningElement()  // the node
       *         })
       *       }),
       *       ...  // 0-n times
       *     ]
       *   })
       * })
       */
      if (!node.parent
        || !node.parent.parent
        || node.parent.parent.type !== 'ExpressionStatement'
      ) {
        return false
      }

      const expStmt = node.parent.parent!
      const isInBlockStmtWithinDoExp = (
        expStmt.parent
        && expStmt.parent.type === 'BlockStatement'
        && expStmt.parent.parent
        // @ts-expect-error Missing in types
        && expStmt.parent.parent.type === 'DoExpression'
      )
      if (!isInBlockStmtWithinDoExp)
        return false

      const blockStmt = expStmt.parent as Tree.BlockStatement
      const blockStmtFirstExp = blockStmt.body[0]
      return !(blockStmtFirstExp === expStmt)
    }

    /**
     * Check indent for nodes list
     * @param node The node to check
     * @param indent needed indent
     * @param [excludeCommas] skip comma on start of line
     */
    function checkNodesIndent(node: ASTNode, indent: number, excludeCommas = false) {
      const nodeIndent = getNodeIndent(node, false, excludeCommas)
      const isCorrectRightInLogicalExp = isRightInLogicalExp(node) && (nodeIndent - indent) === indentSize
      const isCorrectAlternateInCondExp = isAlternateInConditionalExp(node) && (nodeIndent - indent) === 0
      if (
        nodeIndent !== indent
        && isNodeFirstInLine(context, node)
        && !isCorrectRightInLogicalExp
        && !isCorrectAlternateInCondExp
      ) {
        report(node, indent, nodeIndent)
      }
    }

    /**
     * Check indent for Literal Node or JSXText Node
     * @param node The node to check
     * @param indent needed indent
     */
    function checkLiteralNodeIndent(node: Tree.Literal | Tree.JSXText, indent: number) {
      const value = node.value
      // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation
      const regExp = indentType === 'space' ? /\n( *)[\t ]*\S/g : /\n(\t*)[\t ]*\S/g
      const nodeIndentsPerLine = Array.from(
        String(value).matchAll(regExp),
        match => (match[1] ? match[1].length : 0),
      )
      const hasFirstInLineNode = nodeIndentsPerLine.length > 0
      if (
        hasFirstInLineNode
        && !nodeIndentsPerLine.every(actualIndent => actualIndent === indent)
      ) {
        nodeIndentsPerLine.forEach((nodeIndent) => {
          report(node, indent, nodeIndent)
        })
      }
    }

    function handleOpeningElement(node: Tree.JSXOpeningElement | Tree.JSXOpeningFragment) {
      const sourceCode = context.sourceCode
      let prevToken: ASTNode | Token = sourceCode.getTokenBefore(node)!
      if (!prevToken)
        return

      // Use the parent in a list or an array
      if (prevToken.type === 'JSXText' || isCommaToken(prevToken)) {
        prevToken = sourceCode.getNodeByRangeIndex(prevToken.range[0])!
        prevToken = prevToken.type === 'Literal' || prevToken.type === 'JSXText' ? prevToken.parent : prevToken
        // Use the first non-punctuator token in a conditional expression
      }
      else if (isColonToken(prevToken)) {
        do
          prevToken = sourceCode.getTokenBefore(prevToken)!

        while (prevToken.type === 'Punctuator' && prevToken.value !== '/')
        prevToken = sourceCode.getNodeByRangeIndex(prevToken.range[0])!

        while (prevToken.parent && prevToken.parent.type !== 'ConditionalExpression')
          prevToken = prevToken.parent
      }
      prevToken = prevToken.type === 'JSXExpressionContainer' ? prevToken.expression : prevToken
      const parentElementIndent = getNodeIndent(prevToken)
      const indent = (
        prevToken.loc.start.line === node.loc.start.line
        || isRightInLogicalExp(node)
        || isAlternateInConditionalExp(node)
        || isSecondOrSubsequentExpWithinDoExp(node)
      ) ? 0 : indentSize
      checkNodesIndent(node, parentElementIndent + indent)
    }

    function handleClosingElement(node: Tree.JSXClosingElement | Tree.JSXClosingFragment) {
      if (!node.parent)
        return

      const peerElementIndent = getNodeIndent((<Tree.JSXElement>node.parent).openingElement || (<Tree.JSXFragment>node.parent).openingFragment)
      checkNodesIndent(node, peerElementIndent)
    }

    function handleAttribute(node: Tree.JSXAttribute) {
      if (!checkAttributes || (!node.value || node.value.type !== 'JSXExpressionContainer'))
        return

      const nameIndent = getNodeIndent(node.name)
      const lastToken = context.sourceCode.getLastToken(node.value)!
      const firstInLine = getFirstNodeInLine(context, lastToken)
      // leave this for `indent` rule to handle
      if (firstInLine.loc.start.line !== lastToken.loc.start.line)
        return
      const indent = node.name.loc.start.line === firstInLine.loc.start.line ? 0 : nameIndent
      checkNodesIndent(firstInLine as unknown as ASTNode, indent)
    }

    function handleLiteral(node: Tree.Literal | Tree.JSXText) {
      if (!node.parent)
        return

      if (node.parent.type !== 'JSXElement' && node.parent.type !== 'JSXFragment')
        return

      const parentNodeIndent = getNodeIndent(node.parent)
      checkLiteralNodeIndent(node, parentNodeIndent + indentSize)
    }

    return {
      JSXOpeningElement: handleOpeningElement,
      JSXOpeningFragment: handleOpeningElement,
      JSXClosingElement: handleClosingElement,
      JSXClosingFragment: handleClosingElement,
      JSXAttribute: handleAttribute,
      JSXExpressionContainer(node) {
        if (!node.parent)
          return

        const parentNodeIndent = getNodeIndent(node.parent)
        checkNodesIndent(node, parentNodeIndent + indentSize)
      },
      Literal: handleLiteral,
      JSXText: handleLiteral,

      ReturnStatement(node) {
        if (
          !node.parent
          || !node.argument
          || !isJSX(node.argument)
        ) {
          return
        }

        let fn: ASTNode | undefined = node.parent
        while (fn && fn.type !== 'FunctionDeclaration' && fn.type !== 'FunctionExpression')
          fn = fn.parent

        if (
          !fn
          || !isReturningJSX(node, context, true)
        ) {
          return
        }

        const openingIndent = getNodeIndent(node)
        const closingIndent = getNodeIndent(node, true)

        if (openingIndent !== closingIndent)
          report(node, openingIndent, closingIndent)
      },
    }
  },
})
