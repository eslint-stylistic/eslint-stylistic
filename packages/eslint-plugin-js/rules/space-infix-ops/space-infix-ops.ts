/**
 * @fileoverview Require spaces around infix operators
 * @author Michael Ficarra
 */

import type { ASTNode, Token, Tree } from '@shared/types'
import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { isNotOpeningParenToken } from '@typescript-eslint/utils/ast-utils'
import { createTSRule } from '../../utils'
import type { MessageIds, RuleOptions } from './types'

const UNIONS = ['|', '&']

export default createTSRule<RuleOptions, MessageIds>({
  name: 'space-infix-ops',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require spacing around infix operators',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          int32Hint: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingSpace: 'Operator \'{{operator}}\' must be spaced.',
    },
  },
  defaultOptions: [
    {
      int32Hint: false,
    },
  ],

  create(context) {
    const int32Hint = context.options[0] ? context.options[0].int32Hint === true : false
    const sourceCode = context.sourceCode

    /**
     * Returns the first token which violates the rule
     * @param left The left node of the main node
     * @param right The right node of the main node
     * @param op The operator of the main node
     * @returns The violator token or null
     * @private
     */
    function getFirstNonSpacedToken(left: ASTNode, right: ASTNode, op: string) {
      const operator = sourceCode.getFirstTokenBetween(left, right, token => token.value === op)!
      const prev = sourceCode.getTokenBefore(operator)!
      const next = sourceCode.getTokenAfter(operator)!

      if (!sourceCode.isSpaceBetweenTokens(prev, operator) || !sourceCode.isSpaceBetweenTokens(operator, next))
        return operator
      return null
    }

    /**
     * Reports an AST node as a rule violation
     * @param mainNode The node to report
     * @param culpritToken The token which has a problem
     * @private
     */
    function report(mainNode: ASTNode, culpritToken: Token) {
      context.report({
        node: mainNode,
        loc: culpritToken.loc,
        messageId: 'missingSpace',
        data: {
          operator: culpritToken.value,
        },
        fix(fixer) {
          const previousToken = sourceCode.getTokenBefore(culpritToken)!
          const afterToken = sourceCode.getTokenAfter(culpritToken)!
          let fixString = ''

          if (culpritToken.range[0] - previousToken.range[1] === 0)
            fixString = ' '

          fixString += culpritToken.value

          if (afterToken.range[0] - culpritToken.range[1] === 0)
            fixString += ' '

          return fixer.replaceText(culpritToken, fixString)
        },
      })
    }

    /**
     * Check if the node is binary then report
     * @param node node to evaluate
     * @private
     */
    function checkBinary(
      node:
        | Tree.AssignmentExpression
        | Tree.AssignmentPattern
        | Tree.BinaryExpression
        | Tree.LogicalExpression,
    ) {
      const leftNode = ('typeAnnotation' in node.left && node.left.typeAnnotation)
        ? node.left.typeAnnotation : node.left
      const rightNode = node.right

      // search for = in AssignmentPattern nodes
      const operator = ('operator' in node && node.operator) ? node.operator : '='

      const nonSpacedNode = getFirstNonSpacedToken(leftNode, rightNode, operator)

      if (nonSpacedNode) {
        if (!(int32Hint && sourceCode.getText(node).endsWith('|0')))
          report(node, nonSpacedNode)
      }
    }

    /**
     * Check if the node is conditional
     * @param node node to evaluate
     * @private
     */
    function checkConditional(node: Tree.ConditionalExpression) {
      const nonSpacedConsequentNode = getFirstNonSpacedToken(node.test, node.consequent, '?')
      const nonSpacedAlternateNode = getFirstNonSpacedToken(node.consequent, node.alternate, ':')

      if (nonSpacedConsequentNode)
        report(node, nonSpacedConsequentNode)

      if (nonSpacedAlternateNode)
        report(node, nonSpacedAlternateNode)
    }

    /**
     * Check if the node is a variable
     * @param node node to evaluate
     * @private
     */
    function checkVar(node: Tree.VariableDeclarator) {
      const leftNode = (node.id.typeAnnotation) ? node.id.typeAnnotation : node.id
      const rightNode = node.init

      if (rightNode) {
        const nonSpacedNode = getFirstNonSpacedToken(leftNode, rightNode, '=')

        if (nonSpacedNode)
          report(node, nonSpacedNode)
      }
    }

    function isSpaceChar(token: Token): boolean {
      return (
        token.type === AST_TOKEN_TYPES.Punctuator && /^[=?:]$/.test(token.value)
      )
    }

    function checkAndReportAssignmentSpace(
      node: ASTNode,
      leftNode: ASTNode | Token | null,
      rightNode?: ASTNode | Token | null,
    ): void {
      if (!rightNode || !leftNode)
        return

      const operator = sourceCode.getFirstTokenBetween(
        leftNode,
        rightNode,
        isSpaceChar,
      )!

      const prev = sourceCode.getTokenBefore(operator)!
      const next = sourceCode.getTokenAfter(operator)!

      if (
        !sourceCode.isSpaceBetween!(prev, operator)
        || !sourceCode.isSpaceBetween!(operator, next)
      ) {
        report(node, operator)
      }
    }

    /**
     * Check if it has an assignment char and report if it's faulty
     * @param node The node to report
     */
    function checkForEnumAssignmentSpace(node: Tree.TSEnumMember): void {
      checkAndReportAssignmentSpace(node, node.id, node.initializer)
    }

    /**
     * Check if it has an assignment char and report if it's faulty
     * @param node The node to report
     */
    function checkForPropertyDefinitionAssignmentSpace(
      node: Tree.PropertyDefinition,
    ): void {
      const leftNode
        = node.optional && !node.typeAnnotation
          ? sourceCode.getTokenAfter(node.key)
          : node.typeAnnotation ?? node.key

      checkAndReportAssignmentSpace(node, leftNode, node.value)
    }

    /**
     * Check if it is missing spaces between type annotations chaining
     * @param typeAnnotation TypeAnnotations list
     */
    function checkForTypeAnnotationSpace(
      typeAnnotation: Tree.TSIntersectionType | Tree.TSUnionType,
    ): void {
      const types = typeAnnotation.types

      types.forEach((type) => {
        const skipFunctionParenthesis
          = type.type === AST_NODE_TYPES.TSFunctionType
            ? isNotOpeningParenToken
            : 0
        const operator = sourceCode.getTokenBefore(
          type,
          skipFunctionParenthesis,
        )

        if (operator != null && UNIONS.includes(operator.value)) {
          const prev = sourceCode.getTokenBefore(operator)
          const next = sourceCode.getTokenAfter(operator)

          if (
            !sourceCode.isSpaceBetween!(prev!, operator)
            || !sourceCode.isSpaceBetween!(operator, next!)
          ) {
            report(typeAnnotation, operator)
          }
        }
      })
    }

    /**
     * Check if it has an assignment char and report if it's faulty
     * @param node The node to report
     */
    function checkForTypeAliasAssignment(
      node: Tree.TSTypeAliasDeclaration,
    ): void {
      checkAndReportAssignmentSpace(
        node,
        node.typeParameters ?? node.id,
        node.typeAnnotation,
      )
    }

    function checkForTypeConditional(node: Tree.TSConditionalType): void {
      checkAndReportAssignmentSpace(node, node.extendsType, node.trueType)
      checkAndReportAssignmentSpace(node, node.trueType, node.falseType)
    }

    return {
      AssignmentExpression: checkBinary,
      AssignmentPattern: checkBinary,
      BinaryExpression: checkBinary,
      LogicalExpression: checkBinary,
      ConditionalExpression: checkConditional,
      VariableDeclarator: checkVar,
      PropertyDefinition: checkForPropertyDefinitionAssignmentSpace,
      TSEnumMember: checkForEnumAssignmentSpace,
      TSTypeAliasDeclaration: checkForTypeAliasAssignment,
      TSUnionType: checkForTypeAnnotationSpace,
      TSIntersectionType: checkForTypeAnnotationSpace,
      TSConditionalType: checkForTypeConditional,
    }
  },
})
