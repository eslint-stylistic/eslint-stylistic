// any is required to work around manipulating the AST in weird ways

import type { ASTNode, Token, Tree } from '#types'
import type { TSESLint } from '@typescript-eslint/utils'
import type { MessageIds, RuleOptions } from './types'
import {
  canTokensBeAdjacent,
  getPrecedence,
  getStaticPropertyName,
  isParenthesized as isParenthesizedRaw,
  isTopLevelExpressionStatement,
  skipChainExpression,
} from '#utils/ast'
import { castRuleModule, createRule } from '#utils/create-rule'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { isOpeningParenToken, isTypeAssertion } from '@typescript-eslint/utils/ast-utils'
import _baseRule, { reportsBuffer } from './no-extra-parens._js_'

const baseRule = /* @__PURE__ */ castRuleModule(_baseRule)

export default createRule<RuleOptions, MessageIds>({
  name: 'no-extra-parens',
  package: 'ts',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow unnecessary parentheses',
    },
    fixable: 'code',
    hasSuggestions: baseRule.meta.hasSuggestions,
    schema: baseRule.meta.schema,
    messages: baseRule.meta.messages,
  },
  defaultOptions: ['all'],
  create(context) {
    const sourceCode = context.sourceCode
    const rules = baseRule.create(context)

    const tokensToIgnore = new WeakSet()
    const precedence = getPrecedence
    const ALL_NODES = context.options[0] !== 'functions'
    const EXCEPT_COND_ASSIGN = ALL_NODES && context.options[1]
      && context.options[1].conditionalAssign === false
    const EXCEPT_RETURN_ASSIGN = ALL_NODES && context.options[1]
      && context.options[1].returnAssign === false
    const IGNORE_JSX = ALL_NODES && context.options[1]
      && context.options[1].ignoreJSX
    const IGNORE_SEQUENCE_EXPRESSIONS = ALL_NODES && context.options[1]
      && context.options[1].enforceForSequenceExpressions === false
    const IGNORE_FUNCTION_PROTOTYPE_METHODS = ALL_NODES && context.options[1]
      && context.options[1].enforceForFunctionPrototypeMethods === false
    const ALLOW_PARENS_AFTER_COMMENT_PATTERN = ALL_NODES && context.options[1]
      && context.options[1].allowParensAfterCommentPattern

    // @ts-expect-error other properties are not used
    const PRECEDENCE_OF_ASSIGNMENT_EXPR = precedence({ type: 'AssignmentExpression' })
    // @ts-expect-error other properties are not used
    const PRECEDENCE_OF_UPDATE_EXPR = precedence({ type: 'UpdateExpression' })

    // type ReportsBuffer = {
    //   upper: ReportsBuffer
    //   inExpressionNodes: ASTNode[]
    //   reports: { node: ASTNode, finishReport: () => void }[]
    // } | undefined
    // let reportsBuffer: ReportsBuffer

    /**
     * Determines whether the given node is a `call` or `apply` method call, invoked directly on a `FunctionExpression` node.
     * Example: function(){}.call()
     * @param node The node to be checked.
     * @returns True if the node is an immediate `call` or `apply` method call.
     * @private
     */
    function isImmediateFunctionPrototypeMethodCall(node: ASTNode) {
      const callNode = skipChainExpression(node)

      if (callNode.type !== 'CallExpression')
        return false

      const callee = skipChainExpression(callNode.callee)

      return (
        callee.type === 'MemberExpression'
        && callee.object.type === 'FunctionExpression'
        && ['call', 'apply'].includes(getStaticPropertyName(callee)!)
      )
    }

    /**
     * Determines if this rule should be enforced for a node given the current configuration.
     * @param node The node to be checked.
     * @returns True if the rule should be enforced for this node.
     * @private
     */
    function ruleApplies(node: ASTNode) {
      if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
        const isSingleLine = node.loc.start.line === node.loc.end.line

        switch (IGNORE_JSX) {
          // Exclude this JSX element from linting
          case 'all':
            return false

            // Exclude this JSX element if it is multi-line element
          case 'multi-line':
            return isSingleLine

            // Exclude this JSX element if it is single-line element
          case 'single-line':
            return !isSingleLine

            // Nothing special to be done for JSX elements
          case 'none':
            break

                        // no default
        }
      }

      if (node.type === 'SequenceExpression' && IGNORE_SEQUENCE_EXPRESSIONS)
        return false

      if (isImmediateFunctionPrototypeMethodCall(node) && IGNORE_FUNCTION_PROTOTYPE_METHODS)
        return false

      return ALL_NODES || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression'
    }

    /**
     * Determines if a node is surrounded by parentheses.
     * @param node The node to be checked.
     * @returns True if the node is parenthesised.
     * @private
     */
    function isParenthesised(node: ASTNode) {
      return isParenthesizedRaw(node, sourceCode, 1)
    }

    /**
     * Determines if a node is surrounded by parentheses twice.
     * @param node The node to be checked.
     * @returns True if the node is doubly parenthesised.
     * @private
     */
    function isParenthesisedTwice(node: ASTNode) {
      return isParenthesizedRaw(node, sourceCode, 2)
    }

    /**
     * Determines if a node is surrounded by (potentially) invalid parentheses.
     * @param node The node to be checked.
     * @returns True if the node is incorrectly parenthesised.
     * @private
     */
    function hasExcessParens(node: ASTNode) {
      return ruleApplies(node) && isParenthesised(node)
    }

    /**
     * Determines if a node that is expected to be parenthesised is surrounded by
     * (potentially) invalid extra parentheses.
     * @param node The node to be checked.
     * @returns True if the node is has an unexpected extra pair of parentheses.
     * @private
     */
    function hasDoubleExcessParens(node: ASTNode) {
      return ruleApplies(node) && isParenthesisedTwice(node)
    }

    /**
     * Determines if a node that is expected to be parenthesised is surrounded by
     * (potentially) invalid extra parentheses with considering precedence level of the node.
     * If the preference level of the node is not higher or equal to precedence lower limit, it also checks
     * whether the node is surrounded by parentheses twice or not.
     * @param node The node to be checked.
     * @param precedenceLowerLimit The lower limit of precedence.
     * @returns True if the node is has an unexpected extra pair of parentheses.
     * @private
     */
    function hasExcessParensWithPrecedence(node: ASTNode, precedenceLowerLimit: number) {
      if (ruleApplies(node) && isParenthesised(node)) {
        if (
          precedence(node) >= precedenceLowerLimit
          || isParenthesisedTwice(node)
        ) {
          return true
        }
      }
      return false
    }

    /**
     * Determines if a node test expression is allowed to have a parenthesised assignment
     * @param node The node to be checked.
     * @returns True if the assignment can be parenthesised.
     * @private
     */
    function isCondAssignException(node: Tree.ConditionalExpression | Tree.DoWhileStatement | Tree.WhileStatement | Tree.IfStatement | Tree.ForStatement) {
      return EXCEPT_COND_ASSIGN && node.test && node.test.type === 'AssignmentExpression'
    }

    /**
     * Determines if a node is in a return statement
     * @param node The node to be checked.
     * @returns True if the node is in a return statement.
     * @private
     */
    function isInReturnStatement(node: ASTNode) {
      for (let currentNode = node; currentNode; currentNode = currentNode.parent!) {
        if (
          currentNode.type === 'ReturnStatement'
          || (currentNode.type === 'ArrowFunctionExpression' && currentNode.body.type !== 'BlockStatement')
        ) {
          return true
        }
      }

      return false
    }

    /**
     * Determines if a node is or contains an assignment expression
     * @param node The node to be checked.
     * @returns True if the node is or contains an assignment expression.
     * @private
     */
    function containsAssignment(node: ASTNode) {
      if (node.type === 'AssignmentExpression')
        return true

      if (node.type === 'ConditionalExpression'
        && (node.consequent.type === 'AssignmentExpression' || node.alternate.type === 'AssignmentExpression')) {
        return true
      }

      if ('left' in node && ((node.left && node.left.type === 'AssignmentExpression')
        || (node.right && node.right.type === 'AssignmentExpression'))) {
        return true
      }

      return false
    }

    /**
     * Determines if a node is contained by or is itself a return statement and is allowed to have a parenthesised assignment
     * @param node The node to be checked.
     * @returns True if the assignment can be parenthesised.
     * @private
     */
    function isReturnAssignException(node: ASTNode) {
      if (!EXCEPT_RETURN_ASSIGN || !isInReturnStatement(node))
        return false

      if (node.type === 'ReturnStatement')
        return node.argument && containsAssignment(node.argument)

      if (node.type === 'ArrowFunctionExpression' && node.body.type !== 'BlockStatement')
        return containsAssignment(node.body)

      return containsAssignment(node)
    }

    /**
     * Determines if a node following a [no LineTerminator here] restriction is
     * surrounded by (potentially) invalid extra parentheses.
     * @param token The token preceding the [no LineTerminator here] restriction.
     * @param node The node to be checked.
     * @returns True if the node is incorrectly parenthesised.
     * @private
     */
    function hasExcessParensNoLineTerminator(token: Token, node: ASTNode) {
      if (token.loc.end.line === node.loc.start.line)
        return hasExcessParens(node)

      return hasDoubleExcessParens(node)
    }

    function binaryExp(
      node: Tree.BinaryExpression | Tree.LogicalExpression,
    ): void {
      const rule = rules.BinaryExpression as (n: typeof node) => void

      // makes the rule think it should skip the left or right
      const isLeftTypeAssertion = isTypeAssertion(node.left)
      const isRightTypeAssertion = isTypeAssertion(node.right)
      if (isLeftTypeAssertion && isRightTypeAssertion)
        return // ignore

      if (isLeftTypeAssertion) {
        return rule({
          ...node,
          left: {
            ...node.left,
            type: AST_NODE_TYPES.SequenceExpression as any,
          },
        })
      }
      if (isRightTypeAssertion) {
        return rule({
          ...node,
          right: {
            ...node.right,
            type: AST_NODE_TYPES.SequenceExpression as any,
          },
        })
      }

      return rule(node)
    }
    function callExp(
      node: Tree.CallExpression | Tree.NewExpression,
    ): void {
      const rule = rules.CallExpression as (n: typeof node) => void

      if (isTypeAssertion(node.callee)) {
        // reduces the precedence of the node so the rule thinks it needs to be wrapped
        return rule({
          ...node,
          callee: {
            ...node.callee,
            type: AST_NODE_TYPES.SequenceExpression as any,
          },
        })
      }

      if (
        node.typeArguments
        && node.arguments.length === 1
        // is there any opening parenthesis in type arguments
        && sourceCode.getTokenAfter(node.callee, isOpeningParenToken)
        !== sourceCode.getTokenBefore(node.arguments[0], isOpeningParenToken)
      ) {
        return rule({
          ...node,
          arguments: [
            {
              ...node.arguments[0],
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          ],
        })
      }

      return rule(node)
    }
    function unaryUpdateExpression(
      node: Tree.UnaryExpression | Tree.UpdateExpression,
    ): void {
      const rule = rules.UnaryExpression as (n: typeof node) => void

      if (isTypeAssertion(node.argument)) {
        // reduces the precedence of the node so the rule thinks it needs to be wrapped
        return rule({
          ...node,
          argument: {
            ...node.argument,
            type: AST_NODE_TYPES.SequenceExpression as any,
          },
        })
      }

      return rule(node)
    }

    /**
     * Determines whether a node should be preceded by an additional space when removing parens
     * @param node node to evaluate; must be surrounded by parentheses
     * @returns `true` if a space should be inserted before the node
     * @private
     */
    function requiresLeadingSpace(node: ASTNode) {
      const leftParenToken = sourceCode.getTokenBefore(node)!
      const tokenBeforeLeftParen = sourceCode.getTokenBefore(leftParenToken, { includeComments: true })!
      const tokenAfterLeftParen = sourceCode.getTokenAfter(leftParenToken, { includeComments: true })!

      return tokenBeforeLeftParen
        && tokenBeforeLeftParen.range[1] === leftParenToken.range[0]
        && leftParenToken.range[1] === tokenAfterLeftParen.range[0]
        && !canTokensBeAdjacent(tokenBeforeLeftParen, tokenAfterLeftParen)
    }

    /**
     * Determines whether a node should be followed by an additional space when removing parens
     * @param node node to evaluate; must be surrounded by parentheses
     * @returns `true` if a space should be inserted after the node
     * @private
     */
    function requiresTrailingSpace(node: ASTNode) {
      const nextTwoTokens = sourceCode.getTokensAfter(node, { count: 2 })
      const rightParenToken = nextTwoTokens[0]
      const tokenAfterRightParen = nextTwoTokens[1]
      const tokenBeforeRightParen = sourceCode.getLastToken(node)!

      return rightParenToken && tokenAfterRightParen
        && !sourceCode.isSpaceBetween(rightParenToken, tokenAfterRightParen)
        && !canTokensBeAdjacent(tokenBeforeRightParen, tokenAfterRightParen)
    }

    /**
     * Determines if a given expression node is an IIFE
     * @param node The node to check
     * @returns `true` if the given node is an IIFE
     */
    function isIIFE(node: ASTNode) {
      const maybeCallNode = skipChainExpression(node)

      return maybeCallNode.type === 'CallExpression' && maybeCallNode.callee.type === 'FunctionExpression'
    }

    /**
     * Determines if the given node can be the assignment target in destructuring or the LHS of an assignment.
     * This is to avoid an autofix that could change behavior because parsers mistakenly allow invalid syntax,
     * such as `(a = b) = c` and `[(a = b) = c] = []`. Ideally, this function shouldn't be necessary.
     * @param [node] The node to check
     * @returns `true` if the given node can be a valid assignment target
     */
    function canBeAssignmentTarget(node: ASTNode) {
      return !!(node && (node.type === 'Identifier' || node.type === 'MemberExpression'))
    }

    /**
     * Checks if a node is fixable.
     * A node is fixable if removing a single pair of surrounding parentheses does not turn it
     * into a directive after fixing other nodes.
     * Almost all nodes are fixable, except if all of the following conditions are met:
     * The node is a string Literal
     * It has a single pair of parentheses
     * It is the only child of an ExpressionStatement
     * @param node The node to evaluate.
     * @returns Whether or not the node is fixable.
     * @private
     */
    function isFixable(node: ASTNode) {
      // if it's not a string literal it can be autofixed
      if (node.type !== 'Literal' || typeof node.value !== 'string')
        return true

      if (isParenthesisedTwice(node))
        return true

      return !isTopLevelExpressionStatement(node.parent)
    }

    /**
     * Report the node
     * @param node node to evaluate
     * @private
     */
    function report(node: ASTNode) {
      const leftParenToken = sourceCode.getTokenBefore(node)!
      const rightParenToken = sourceCode.getTokenAfter(node)!

      if (!isParenthesisedTwice(node)) {
        if (tokensToIgnore.has(sourceCode.getFirstToken(node)!))
          return

        if (isIIFE(node) && !('callee' in node && isParenthesised(node.callee)))
          return

        if (ALLOW_PARENS_AFTER_COMMENT_PATTERN) {
          const commentsBeforeLeftParenToken = sourceCode.getCommentsBefore(leftParenToken)
          const totalCommentsBeforeLeftParenTokenCount = commentsBeforeLeftParenToken.length
          const ignorePattern = new RegExp(ALLOW_PARENS_AFTER_COMMENT_PATTERN, 'u')

          if (
            totalCommentsBeforeLeftParenTokenCount > 0
            && ignorePattern.test(commentsBeforeLeftParenToken[totalCommentsBeforeLeftParenTokenCount - 1].value)
          ) {
            return
          }
        }
      }

      /**
       * Finishes reporting
       * @private
       */
      function finishReport() {
        context.report({
          node,
          loc: leftParenToken.loc,
          messageId: 'unexpected',
          fix: isFixable(node)
            ? (fixer) => {
                const parenthesizedSource = sourceCode.text.slice(leftParenToken.range[1], rightParenToken.range[0])

                return fixer.replaceTextRange([
                  leftParenToken.range[0],
                  rightParenToken.range[1],
                ], (requiresLeadingSpace(node) ? ' ' : '') + parenthesizedSource + (requiresTrailingSpace(node) ? ' ' : ''))
              }
            : null,
        })
      }

      if (reportsBuffer) {
        reportsBuffer.reports.push({ node, finishReport })
        return
      }

      finishReport()
    }

    /**
     * Evaluate a argument of the node.
     * @param node node to evaluate
     * @private
     */
    function checkArgumentWithPrecedence(node: ASTNode) {
      if ('argument' in node && node.argument && hasExcessParensWithPrecedence(node.argument, precedence(node)))
        report(node.argument)
    }

    /**
     * Check the parentheses around the super class of the given class definition.
     * @param node The node of class declarations to check.
     */
    function checkClass(node: Tree.ClassExpression | Tree.ClassDeclaration) {
      if (!node.superClass)
        return

      /**
       * If `node.superClass` is a LeftHandSideExpression, parentheses are extra.
       * Otherwise, parentheses are needed.
       */
      const hasExtraParens = precedence(node.superClass) > PRECEDENCE_OF_UPDATE_EXPR
        ? hasExcessParens(node.superClass)
        : hasDoubleExcessParens(node.superClass)

      if (hasExtraParens)
        report(node.superClass)
    }

    const overrides: TSESLint.RuleListener = {
      ArrayExpression(node) {
        node.elements
          .map(element =>
            isTypeAssertion(element)
              ? { ...element, type: AST_NODE_TYPES.FunctionExpression as any }
              : element,
          )
          .filter((e): e is NonNullable<typeof e> => !!e && hasExcessParensWithPrecedence(e, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          .forEach(report)
      },
      ArrowFunctionExpression(node) {
        if (!isTypeAssertion(node.body))
          return rules.ArrowFunctionExpression!(node)
      },
      // AssignmentExpression
      AssignmentPattern(node) {
        const { left, right } = node

        if (canBeAssignmentTarget(left) && hasExcessParens(left))
          report(left)

        if (right && hasExcessParensWithPrecedence(right, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(right)
      },
      AwaitExpression(node) {
        if (isTypeAssertion(node.argument)) {
          // reduces the precedence of the node so the rule thinks it needs to be wrapped
          return checkArgumentWithPrecedence({
            ...node,
            argument: {
              ...node.argument,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }
        return checkArgumentWithPrecedence(node)
      },
      'BinaryExpression': binaryExp,
      'CallExpression': callExp,
      ClassDeclaration(node) {
        if (node.superClass?.type === AST_NODE_TYPES.TSAsExpression) {
          return checkClass({
            ...node,
            superClass: {
              ...node.superClass,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }
        return checkClass(node)
      },
      ClassExpression(node) {
        if (node.superClass?.type === AST_NODE_TYPES.TSAsExpression) {
          return checkClass({
            ...node,
            superClass: {
              ...node.superClass,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }
        return checkClass(node)
      },
      ConditionalExpression(node) {
        // reduces the precedence of the node so the rule thinks it needs to be wrapped
        if (isTypeAssertion(node.test)) {
          return rules.ConditionalExpression!({
            ...node,
            test: {
              ...node.test,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }
        if (isTypeAssertion(node.consequent)) {
          return rules.ConditionalExpression!({
            ...node,
            consequent: {
              ...node.consequent,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }
        if (isTypeAssertion(node.alternate)) {
          // reduces the precedence of the node so the rule thinks it needs to be wrapped
          return rules.ConditionalExpression!({
            ...node,
            alternate: {
              ...node.alternate,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }
        return rules.ConditionalExpression!(node)
      },
      DoWhileStatement(node) {
        if (hasExcessParens(node.test) && !isCondAssignException(node))
          report(node.test)
      },
      // ExportDefaultDeclaration
      // ExpressionStatement
      ForInStatement(node) {
        if (isTypeAssertion(node.right)) {
          // as of 7.20.0 there's no way to skip checking the right of the ForIn
          // so just don't validate it at all
          return
        }
        return rules.ForInStatement!(node)
      },
      ForOfStatement(node) {
        if (isTypeAssertion(node.right)) {
          // makes the rule skip checking of the right
          return rules.ForOfStatement!({
            ...node,
            type: AST_NODE_TYPES.ForOfStatement,
            right: {
              ...node.right,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }

        return rules.ForOfStatement!(node)
      },
      ForStatement(node) {
        // make the rule skip the piece by removing it entirely
        if (node.init && isTypeAssertion(node.init)) {
          return rules.ForStatement!({
            ...node,
            init: null,
          })
        }
        if (node.test && isTypeAssertion(node.test)) {
          return rules.ForStatement!({
            ...node,
            test: null,
          })
        }
        if (node.update && isTypeAssertion(node.update)) {
          return rules.ForStatement!({
            ...node,
            update: null,
          })
        }

        return rules.ForStatement!(node)
      },
      'ForStatement > *.init:exit': function (node: ASTNode) {
        if (!isTypeAssertion(node))
          return (rules as any)['ForStatement > *.init:exit'](node)
      },
      IfStatement(node) {
        if (hasExcessParens(node.test) && !isCondAssignException(node))
          report(node.test)
      },
      ImportExpression(node) {
        const { source } = node

        if (source.type === 'SequenceExpression') {
          if (hasDoubleExcessParens(source))
            report(source)
        }
        else if (hasExcessParens(source)) {
          report(source)
        }
      },
      'LogicalExpression': binaryExp,
      MemberExpression(node) {
        if (isTypeAssertion(node.object)) {
          // reduces the precedence of the node so the rule thinks it needs to be wrapped
          return rules.MemberExpression!({
            ...node,
            object: {
              ...node.object,
              type: AST_NODE_TYPES.SequenceExpression as any,
            },
          })
        }

        if (isTypeAssertion(node.property)) {
          return rules.MemberExpression!({
            ...node,
            property: ({
              ...node.property,
              type: AST_NODE_TYPES.FunctionExpression as any,
            } as any),
          })
        }

        return rules.MemberExpression!(node)
      },
      // TODO: use MethodDefinition directly
      'MethodDefinition[computed=true]': function (node: Tree.MethodDefinition) {
        if (hasExcessParensWithPrecedence(node.key, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(node.key)
      },
      'NewExpression': callExp,
      ObjectExpression(node) {
        node.properties
          .filter((property): property is Tree.Property => property.type === 'Property' && property.value && hasExcessParensWithPrecedence(property.value, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          .forEach(property => report(property.value))
      },
      ObjectPattern(node) {
        node.properties
          .filter((property) => {
            const value = property.value

            return value && canBeAssignmentTarget(value) && hasExcessParens(value)
          })
          .forEach(property => report(property.value!))
      },
      Property(node) {
        if (node.computed) {
          const { key } = node

          if (key && hasExcessParensWithPrecedence(key, PRECEDENCE_OF_ASSIGNMENT_EXPR))
            report(key)
        }
      },
      PropertyDefinition(node) {
        if (node.computed && hasExcessParensWithPrecedence(node.key, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(node.key)

        if (node.value && hasExcessParensWithPrecedence(node.value, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(node.value)
      },
      RestElement(node) {
        const argument = node.argument

        if (canBeAssignmentTarget(argument) && hasExcessParens(argument))
          report(argument)
      },
      ReturnStatement(node) {
        const returnToken = sourceCode.getFirstToken(node)

        if (isReturnAssignException(node))
          return

        if (node.argument
          && returnToken
          && hasExcessParensNoLineTerminator(returnToken, node.argument)

        // RegExp literal is allowed to have parens (#1589)
          && !(node.argument.type === 'Literal' && 'regex' in node.argument && node.argument.regex)) {
          report(node.argument)
        }
      },
      SequenceExpression(node) {
        const precedenceOfNode = precedence(node)

        node.expressions
          .filter(e => hasExcessParensWithPrecedence(e, precedenceOfNode))
          .forEach(report)
      },
      SpreadElement(node) {
        if (isTypeAssertion(node.argument))
          return

        if (!hasExcessParensWithPrecedence(node.argument, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          return

        report(node.argument)
      },
      SwitchCase(node) {
        if (node.test && !isTypeAssertion(node.test) && hasExcessParens(node.test))
          report(node.test)
      },
      SwitchStatement(node) {
        if (hasExcessParens(node.discriminant))
          report(node.discriminant)
      },
      TemplateLiteral(node) {
        node.expressions
          .filter(e => e && hasExcessParens(e))
          .forEach(report)
      },
      ThrowStatement(node) {
        if (!node.argument || isTypeAssertion(node.argument))
          return

        const throwToken = sourceCode.getFirstToken(node)
        if (!throwToken)
          return

        if (hasExcessParensNoLineTerminator(throwToken, node.argument))
          report(node.argument)
      },
      'UnaryExpression': unaryUpdateExpression,
      UpdateExpression(node) {
        if (isTypeAssertion(node.argument)) {
          return unaryUpdateExpression(node)
        }
        return rules.UpdateExpression!(node)
      },
      VariableDeclarator(node) {
        if (isTypeAssertion(node.init)) {
          return rules.VariableDeclarator!({
            ...node,
            type: AST_NODE_TYPES.VariableDeclarator,
            init: {
              ...(node.init as Tree.TSAsExpression),
              type: AST_NODE_TYPES.FunctionExpression as any,
            },
          } as any)
        }

        return rules.VariableDeclarator!(node)
      },
      WhileStatement(node) {
        if (hasExcessParens(node.test) && !isCondAssignException(node))
          report(node.test)
      },
      WithStatement(node) {
        if (hasExcessParens(node.object))
          report(node.object)
      },
      YieldExpression(node) {
        if (!node.argument || isTypeAssertion(node.argument))
          return

        const yieldToken = sourceCode.getFirstToken(node)

        if ((precedence(node.argument) >= precedence(node)
          && yieldToken
          && hasExcessParensNoLineTerminator(yieldToken, node.argument))
        || hasDoubleExcessParens(node.argument)) {
          report(node.argument)
        }
      },
      TSStringKeyword(node) {
        if (hasExcessParens(node)) {
          report({
            ...node,
            type: AST_NODE_TYPES.FunctionExpression as any,
          })
        }
      },
    }
    return Object.assign({}, rules, overrides)
  },
})
