import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { AST_NODE_TYPES, AST_TOKEN_TYPES, isNotOpeningParenToken } from '#utils/ast'
import { createRule } from '#utils/create-rule'

const UNIONS = ['|', '&']

export default createRule<RuleOptions, MessageIds>({
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
          ignoreTypes: {
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
      ignoreTypes: false,
    },
  ],
  create(context, [options]) {
    const { int32Hint, ignoreTypes } = options!
    const sourceCode = context.sourceCode

    function report(node: ASTNode, operator: Token): void {
      context.report({
        node,
        loc: operator.loc,
        messageId: 'missingSpace',
        data: {
          operator: operator.value,
        },
        fix(fixer) {
          const previousToken = sourceCode.getTokenBefore(operator)
          const afterToken = sourceCode.getTokenAfter(operator)
          let fixString = ''

          if (operator.range[0] - previousToken!.range[1] === 0)
            fixString = ' '

          fixString += operator.value

          if (afterToken!.range[0] - operator.range[1] === 0)
            fixString += ' '

          return fixer.replaceText(operator, fixString)
        },
      })
    }

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

      if (!sourceCode.isSpaceBetween(prev, operator) || !sourceCode.isSpaceBetween(operator, next))
        return operator
      return null
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

    function isSpaceChar(token: Token): boolean {
      return token.type === AST_TOKEN_TYPES.Punctuator && /^[=?:]$/.test(token.value)
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
        !sourceCode.isSpaceBetween(prev, operator)
        || !sourceCode.isSpaceBetween(operator, next)
      ) {
        report(node, operator)
      }
    }

    /**
     * Check if it has an assignment char and report if it's faulty
     * @param node The node to report
     */
    function checkPropertyAssignment(
      node: Tree.PropertyDefinition | Tree.AccessorProperty,
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
    function checkTSBinary(
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

        if (!ignoreTypes && operator != null && UNIONS.includes(operator.value)) {
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

    return {
      AssignmentExpression: checkBinary,
      AssignmentPattern: checkBinary,
      BinaryExpression: checkBinary,
      LogicalExpression: checkBinary,
      ConditionalExpression(node) {
        checkAndReportAssignmentSpace(node, node.test, node.consequent)
        checkAndReportAssignmentSpace(node, node.consequent, node.alternate)
      },
      VariableDeclarator(node) {
        checkAndReportAssignmentSpace(
          node,
          node.id.typeAnnotation ?? node.id,
          node.init,
        )
      },
      PropertyDefinition: checkPropertyAssignment,
      AccessorProperty: checkPropertyAssignment,
      TSEnumMember(node) {
        checkAndReportAssignmentSpace(node, node.id, node.initializer)
      },
      TSTypeAliasDeclaration(node) {
        checkAndReportAssignmentSpace(
          node,
          node.typeParameters ?? node.id,
          node.typeAnnotation,
        )
      },
      TSUnionType: checkTSBinary,
      TSIntersectionType: checkTSBinary,
      TSConditionalType(node) {
        checkAndReportAssignmentSpace(node, node.extendsType, node.trueType)
        checkAndReportAssignmentSpace(node, node.trueType, node.falseType)
      },
    }
  },
})
