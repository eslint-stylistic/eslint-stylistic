import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/utils'
import { isNotOpeningParenToken } from '@typescript-eslint/utils/ast-utils'
import type { MessageIds, RuleOptions } from './types'
import type { ASTNode, Token, Tree } from '#types'
import { createRule } from '#utils/create-rule'
import { getJsRule } from '#utils/get-js-rule'

const baseRule = getJsRule('space-infix-ops')

const UNIONS = ['|', '&']

export default createRule<RuleOptions, MessageIds>({
  name: 'space-infix-ops',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require spacing around infix operators',
    },
    fixable: baseRule.meta.fixable,
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema: baseRule.meta.schema,
    messages: {
      missingSpace: 'Operator \'{{operator}}\' must be spaced.',
      ...baseRule.meta.messages,
    },
  },
  defaultOptions: [
    {
      int32Hint: false,
    },
  ],
  create(context) {
    const rules = baseRule.create(context)
    const sourceCode = context.sourceCode

    function report(operator: Token): void {
      context.report({
        node: operator,
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

    function isSpaceChar(token: Token): boolean {
      return (
        token.type === AST_TOKEN_TYPES.Punctuator && /^[=?:]$/.test(token.value)
      )
    }

    function checkAndReportAssignmentSpace(
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
        report(operator)
      }
    }

    /**
     * Check if it has an assignment char and report if it's faulty
     * @param node The node to report
     */
    function checkForEnumAssignmentSpace(node: Tree.TSEnumMember): void {
      checkAndReportAssignmentSpace(node.id, node.initializer)
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

      checkAndReportAssignmentSpace(leftNode, node.value)
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
            report(operator)
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
        node.typeParameters ?? node.id,
        node.typeAnnotation,
      )
    }

    function checkForTypeConditional(node: Tree.TSConditionalType): void {
      checkAndReportAssignmentSpace(node.extendsType, node.trueType)
      checkAndReportAssignmentSpace(node.trueType, node.falseType)
    }

    return {
      ...rules,
      TSEnumMember: checkForEnumAssignmentSpace,
      PropertyDefinition: checkForPropertyDefinitionAssignmentSpace,
      TSTypeAliasDeclaration: checkForTypeAliasAssignment,
      TSUnionType: checkForTypeAnnotationSpace,
      TSIntersectionType: checkForTypeAnnotationSpace,
      TSConditionalType: checkForTypeConditional,
    }
  },
})
