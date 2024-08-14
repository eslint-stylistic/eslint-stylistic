/**
 * @fileoverview Rule to disallow mixed binary operators.
 * @author Toru Nagashima
 */

import type { ASTNode, Tree } from '@shared/types'
import { getPrecedence, isNotClosingParenToken, isParenthesised } from '../../utils/ast-utils'
import { createRule } from '../../../utils'
import type { MessageIds, RuleOptions } from './types'

const ARITHMETIC_OPERATORS = ['+', '-', '*', '/', '%', '**']
const BITWISE_OPERATORS = ['&', '|', '^', '~', '<<', '>>', '>>>']
const COMPARISON_OPERATORS = ['==', '!=', '===', '!==', '>', '>=', '<', '<=']
const LOGICAL_OPERATORS = ['&&', '||']
const RELATIONAL_OPERATORS = ['in', 'instanceof']
const TERNARY_OPERATOR = ['?:']
const COALESCE_OPERATOR = ['??']
const ALL_OPERATORS = ([] as string[]).concat(
  ARITHMETIC_OPERATORS,
  BITWISE_OPERATORS,
  COMPARISON_OPERATORS,
  LOGICAL_OPERATORS,
  RELATIONAL_OPERATORS,
  TERNARY_OPERATOR,
  COALESCE_OPERATOR,
)
const DEFAULT_GROUPS = [
  ARITHMETIC_OPERATORS,
  BITWISE_OPERATORS,
  COMPARISON_OPERATORS,
  LOGICAL_OPERATORS,
  RELATIONAL_OPERATORS,
]
const TARGET_NODE_TYPE = /^(?:Binary|Logical|Conditional)Expression$/u

/**
 * Normalizes options.
 * @param options A options object to normalize.
 * @returns Normalized option object.
 */
function normalizeOptions(options: RuleOptions[0] = {}) {
  const hasGroups = options.groups && options.groups.length > 0
  const groups = hasGroups ? options.groups : DEFAULT_GROUPS
  const allowSamePrecedence = options.allowSamePrecedence !== false

  return {
    groups,
    allowSamePrecedence,
  }
}

/**
 * Checks whether any group which includes both given operator exists or not.
 * @param groups A list of groups to check.
 * @param left An operator.
 * @param right Another operator.
 * @returns if such group existed.
 */
function includesBothInAGroup(groups: string[][], left: string, right: string): boolean {
  return groups.some(group => group.includes(left) && group.includes(right))
}

/**
 * Checks whether the given node is a conditional expression and returns the test node else the left node.
 * @param node A node which can be a BinaryExpression or a LogicalExpression node.
 * This parent node can be BinaryExpression, LogicalExpression
 *      , or a ConditionalExpression node
 * @returns node the appropriate node(left or test).
 */
function getChildNode(node: NodeType | Tree.ConditionalExpression): ASTNode {
  return node.type === 'ConditionalExpression' ? node.test : node.left
}

type NodeType = Tree.BinaryExpression | Tree.LogicalExpression

export default createRule<RuleOptions, MessageIds>({
  name: 'no-mixed-operators',
  package: 'js',
  meta: {
    type: 'layout',

    docs: {
      description: 'Disallow mixed binary operators',
    },

    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
            items: {
              type: 'array',
              items: {
                type: 'string',
                enum: ALL_OPERATORS,
              },
              minItems: 2,
              uniqueItems: true,
            },
            uniqueItems: true,
          },
          allowSamePrecedence: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],

    messages: {
      unexpectedMixedOperator: 'Unexpected mix of \'{{leftOperator}}\' and \'{{rightOperator}}\'. Use parentheses to clarify the intended order of operations.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode
    const options = normalizeOptions(context.options[0])

    /**
     * Checks whether a given node should be ignored by options or not.
     * @param node A node to check. This is a BinaryExpression
     *      node or a LogicalExpression node. This parent node is one of
     *      them, too.
     * @returns `true` if the node should be ignored.
     */
    function shouldIgnore(node: NodeType): boolean {
      const a = node
      const b = node.parent as (NodeType | Tree.ConditionalExpression)

      return (
        !includesBothInAGroup(
          options.groups ?? [],
          a.operator,
          b.type === 'ConditionalExpression' ? '?:' : b.operator,
        )
        || (
          options.allowSamePrecedence
          && getPrecedence(a) === getPrecedence(b)
        )
      )
    }

    /**
     * Checks whether the operator of a given node is mixed with parent
     * node's operator or not.
     * @param node A node to check. This is a BinaryExpression
     *      node or a LogicalExpression node. This parent node is one of
     *      them, too.
     * @returns `true` if the node was mixed.
     */
    function isMixedWithParent(node: NodeType): boolean {
      return (
        node.operator !== (node.parent as NodeType).operator
        && !isParenthesised(sourceCode, node)
      )
    }

    /**
     * Gets the operator token of a given node.
     * @param node A node to check. This is a BinaryExpression
     *      node or a LogicalExpression node.
     * @returns The operator token of the node.
     */
    function getOperatorToken(node: NodeType): Tree.Token {
      return sourceCode.getTokenAfter(getChildNode(node), isNotClosingParenToken)!
    }

    /**
     * Reports both the operator of a given node and the operator of the
     * parent node.
     * @param node A node to check. This is a BinaryExpression
     *      node or a LogicalExpression node. This parent node is one of
     *      them, too.
     */
    function reportBothOperators(node: NodeType) {
      const parent = node.parent as NodeType
      const left = (getChildNode(parent) === node) ? node : parent
      const right = (getChildNode(parent) !== node) ? node : parent
      const data = {
        leftOperator: left.operator || '?:',
        rightOperator: right.operator || '?:',
      }

      context.report({
        node: left,
        loc: getOperatorToken(left).loc,
        messageId: 'unexpectedMixedOperator',
        data,
      })
      context.report({
        node: right,
        loc: getOperatorToken(right).loc,
        messageId: 'unexpectedMixedOperator',
        data,
      })
    }

    /**
     * Checks between the operator of this node and the operator of the
     * parent node.
     * @param node A node to check.
     */
    function check(node: NodeType) {
      if (
        TARGET_NODE_TYPE.test(node.parent.type)
        && isMixedWithParent(node)
        && !shouldIgnore(node)
      ) {
        reportBothOperators(node)
      }
    }

    return {
      BinaryExpression: check,
      LogicalExpression: check,
    }
  },
})
