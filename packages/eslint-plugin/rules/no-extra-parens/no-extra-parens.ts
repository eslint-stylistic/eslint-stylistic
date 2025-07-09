// any is required to work around manipulating the AST in weird ways

import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  AST_NODE_TYPES,
  canTokensBeAdjacent,
  getPrecedence,
  getStaticPropertyName,
  isClosingParenToken,
  isDecimalInteger,
  isKeywordToken,
  isMixedLogicalAndCoalesceExpressions,
  isNodeOfTypes,
  isNotClosingParenToken,
  isNotOpeningParenToken,
  isOpeningBraceToken,
  isOpeningBracketToken,
  isOpeningParenToken,
  isParenthesized as isParenthesizedRaw,
  isRegExpLiteral,
  isSingleLine,
  isTokenOnSameLine,
  isTopLevelExpressionStatement,
  skipChainExpression,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'no-extra-parens',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow unnecessary parentheses',
    },
    fixable: 'code',
    schema: {
      anyOf: [
        {
          type: 'array',
          items: [
            {
              type: 'string',
              enum: ['functions'],
            },
          ],
          minItems: 0,
          maxItems: 1,
        },
        {
          type: 'array',
          items: [
            {
              type: 'string',
              enum: ['all'],
            },
            {
              type: 'object',
              properties: {
                conditionalAssign: { type: 'boolean' },
                ternaryOperandBinaryExpressions: { type: 'boolean' },
                nestedBinaryExpressions: { type: 'boolean' },
                returnAssign: { type: 'boolean' },
                ignoreJSX: { type: 'string', enum: ['none', 'all', 'single-line', 'multi-line'] },
                enforceForArrowConditionals: { type: 'boolean' },
                enforceForSequenceExpressions: { type: 'boolean' },
                enforceForNewInMemberExpressions: { type: 'boolean' },
                enforceForFunctionPrototypeMethods: { type: 'boolean' },
                allowParensAfterCommentPattern: { type: 'string' },
                nestedConditionalExpressions: { type: 'boolean' },
                allowNodesInSpreadElement: {
                  type: 'object',
                  properties: {
                    ConditionalExpression: { type: 'boolean' },
                    LogicalExpression: { type: 'boolean' },
                    AwaitExpression: { type: 'boolean' },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
            },
          ],
          minItems: 0,
          maxItems: 2,
        },
      ],
    },
    messages: {
      unexpected: 'Unnecessary parentheses around expression.',
    },
  },
  defaultOptions: ['all'],
  create(context) {
    const sourceCode = context.sourceCode

    const tokensToIgnore = new WeakSet()
    const precedence = getPrecedence
    const ALL_NODES = context.options[0] !== 'functions'
    const EXCEPT_COND_ASSIGN = ALL_NODES && context.options[1]
      && context.options[1].conditionalAssign === false
    const EXCEPT_COND_TERNARY = ALL_NODES && context.options[1]
      && context.options[1].ternaryOperandBinaryExpressions === false
    const NESTED_BINARY = ALL_NODES && context.options[1]
      && context.options[1].nestedBinaryExpressions === false
    const EXCEPT_RETURN_ASSIGN = ALL_NODES && context.options[1]
      && context.options[1].returnAssign === false
    const IGNORE_JSX = ALL_NODES && context.options[1]
      && context.options[1].ignoreJSX
    const IGNORE_ARROW_CONDITIONALS = ALL_NODES && context.options[1]
      && context.options[1].enforceForArrowConditionals === false
    const IGNORE_SEQUENCE_EXPRESSIONS = ALL_NODES && context.options[1]
      && context.options[1].enforceForSequenceExpressions === false
    const IGNORE_NEW_IN_MEMBER_EXPR = ALL_NODES && context.options[1]
      && context.options[1].enforceForNewInMemberExpressions === false
    const IGNORE_FUNCTION_PROTOTYPE_METHODS = ALL_NODES && context.options[1]
      && context.options[1].enforceForFunctionPrototypeMethods === false
    const ALLOW_PARENS_AFTER_COMMENT_PATTERN = ALL_NODES && context.options[1]
      && context.options[1].allowParensAfterCommentPattern
    const ALLOW_NESTED_TERNARY = ALL_NODES && context.options[1]
      && context.options[1].nestedConditionalExpressions === false
    const ALLOW_NODES_IN_SPREAD = ALL_NODES && context.options[1]
      && new Set(Object.entries(context.options[1].allowNodesInSpreadElement || {}).filter(([_, value]) => value).map(([key]) => key))

    // @ts-expect-error other properties are not used
    const PRECEDENCE_OF_ASSIGNMENT_EXPR = precedence({ type: 'AssignmentExpression' })
    // @ts-expect-error other properties are not used
    const PRECEDENCE_OF_UPDATE_EXPR = precedence({ type: 'UpdateExpression' })

    type ReportsBuffer = {
      upper: ReportsBuffer
      inExpressionNodes: ASTNode[]
      reports: { node: ASTNode, finishReport: () => void }[]
    } | undefined
    let reportsBuffer: ReportsBuffer

    /**
     * extends from https://github.com/typescript-eslint/typescript-eslint/blob/5c5e3d5c3853ab613e06be0d77a40e970017b3fc/packages/utils/src/ast-utils/predicates.ts#L57
     *
     * Checks if a node is a type assertion:
     *
     * ``` ts
     * x as foo
     * <foo>x
     * x satisfies foo
     * ```
     */
    const isTypeAssertion = isNodeOfTypes([
      AST_NODE_TYPES.TSAsExpression,
      AST_NODE_TYPES.TSNonNullExpression,
      AST_NODE_TYPES.TSSatisfiesExpression,
      AST_NODE_TYPES.TSTypeAssertion,
    ])

    /**
     * Finds the path from the given node to the specified ancestor.
     * @param node First node in the path.
     * @param ancestor Last node in the path.
     * @returns Path, including both nodes.
     * @throws {Error} If the given node does not have the specified ancestor.
     */
    function pathToAncestor(node: ASTNode, ancestor: ASTNode) {
      const path = [node]
      let currentNode: ASTNode | null | undefined = node

      while (currentNode !== ancestor) {
        currentNode = currentNode.parent

        /* c8 ignore start */
        if (currentNode === null || currentNode === undefined)
          throw new Error('Nodes are not in the ancestor-descendant relationship.')
        /* c8 ignore stop */

        path.push(currentNode)
      }

      return path
    }

    /**
     * Finds the path from the given node to the specified descendant.
     * @param node First node in the path.
     * @param descendant Last node in the path.
     * @returns Path, including both nodes.
     * @throws {Error} If the given node does not have the specified descendant.
     */
    function pathToDescendant(node: ASTNode, descendant: ASTNode) {
      return pathToAncestor(descendant, node).reverse()
    }

    /**
     * Checks whether the syntax of the given ancestor of an 'in' expression inside a for-loop initializer
     * is preventing the 'in' keyword from being interpreted as a part of an ill-formed for-in loop.
     * @param node Ancestor of an 'in' expression.
     * @param child Child of the node, ancestor of the same 'in' expression or the 'in' expression itself.
     * @returns True if the keyword 'in' would be interpreted as the 'in' operator, without any parenthesis.
     */
    function isSafelyEnclosingInExpression(node: ASTNode, child: ASTNode) {
      switch (node.type) {
        case 'ArrayExpression':
        case 'ArrayPattern':
        case 'BlockStatement':
        case 'ObjectExpression':
        case 'ObjectPattern':
        case 'TemplateLiteral':
          return true
        case 'ArrowFunctionExpression':
        case 'FunctionExpression':
          // @ts-expect-error type cast
          return node.params.includes(child)
        case 'CallExpression':
        case 'NewExpression':
          // @ts-expect-error type cast
          return node.arguments.includes(child)
        case 'MemberExpression':
          return node.computed && node.property === child
        case 'ConditionalExpression':
          return node.consequent === child
        default:
          return false
      }
    }

    /**
     * Starts a new reports buffering. Warnings will be stored in a buffer instead of being reported immediately.
     * An additional logic that requires multiple nodes (e.g. a whole subtree) may dismiss some of the stored warnings.
     */
    function startNewReportsBuffering() {
      reportsBuffer = {
        upper: reportsBuffer,
        inExpressionNodes: [],
        reports: [],
      }
    }

    /**
     * Ends the current reports buffering.
     */
    function endCurrentReportsBuffering() {
      const { upper, inExpressionNodes, reports } = reportsBuffer ?? {}

      if (upper) {
        upper.inExpressionNodes.push(...inExpressionNodes ?? [])
        upper.reports.push(...reports ?? [])
      }
      else {
        // flush remaining reports
        reports?.forEach(({ finishReport }) => finishReport())
      }

      reportsBuffer = upper
    }

    /**
     * Checks whether the given node is in the current reports buffer.
     * @param node Node to check.
     * @returns True if the node is in the current buffer, false otherwise.
     */
    function isInCurrentReportsBuffer(node: ASTNode) {
      return reportsBuffer?.reports.some(r => r.node === node)
    }

    /**
     * Removes the given node from the current reports buffer.
     * @param node Node to remove.
     */
    function removeFromCurrentReportsBuffer(node: ASTNode) {
      if (reportsBuffer)
        reportsBuffer.reports = reportsBuffer.reports.filter(r => r.node !== node)
    }

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
        switch (IGNORE_JSX) {
          // Exclude this JSX element from linting
          case 'all':
            return false

          // Exclude this JSX element if it is multi-line element
          case 'multi-line':
            return isSingleLine(node)

          // Exclude this JSX element if it is single-line element
          case 'single-line':
            return !isSingleLine(node)

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

      if (node.type === AST_NODE_TYPES.FunctionExpression || node.type === AST_NODE_TYPES.ArrowFunctionExpression)
        return true

      if (isTypeAssertion(node))
        return true

      return ALL_NODES
    }

    /**
     * Determines if a node is surrounded by parentheses.
     * @param node The node to be checked.
     * @returns True if the node is parenthesised.
     * @private
     */
    function isParenthesised(node: ASTNode) {
      return isParenthesizedRaw(1, node, sourceCode)
    }

    /**
     * Determines if a node is surrounded by parentheses twice.
     * @param node The node to be checked.
     * @returns True if the node is doubly parenthesised.
     * @private
     */
    function isParenthesisedTwice(node: ASTNode) {
      return isParenthesizedRaw(2, node, sourceCode)
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
      return ruleApplies(node)
        && (
          precedence(node) >= precedenceLowerLimit
            ? isParenthesised(node)
            : isParenthesisedTwice(node)
        )
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
     * Determines if a constructor function is newed-up with parens
     * @param newExpression The NewExpression node to be checked.
     * @returns True if the constructor is called with parens.
     * @private
     */
    function isNewExpressionWithParens(newExpression: Tree.NewExpression) {
      const lastToken = sourceCode.getLastToken(newExpression)!
      const penultimateToken = sourceCode.getTokenBefore(lastToken)!

      return newExpression.arguments.length > 0
        || (

      // The expression should end with its own parens, e.g., new new foo() is not a new expression with parens
          isOpeningParenToken(penultimateToken)
          && isClosingParenToken(lastToken)
          && newExpression.callee.range[1] < newExpression.range[1]
        )
    }

    /**
     * Checks whether a node is a MemberExpression at NewExpression's callee.
     * @param node node to check.
     * @returns True if the node is a MemberExpression at NewExpression's callee. false otherwise.
     */
    function isMemberExpInNewCallee(node: ASTNode): boolean {
      if (node.type === 'MemberExpression') {
        return node.parent.type === 'NewExpression' && node.parent.callee === node
          ? true
          : 'object' in node.parent && node.parent.object === node && isMemberExpInNewCallee(node.parent)
      }
      return false
    }

    /**
     * Check if a member expression contains a call expression
     * @param node MemberExpression node to evaluate
     * @returns true if found, false if not
     */
    function doesMemberExpressionContainCallExpression(node: Tree.MemberExpression) {
      let currentNode = node.object
      let currentNodeType = node.object.type

      while (currentNodeType === 'MemberExpression') {
        if (!('object' in currentNode))
          break
        currentNode = currentNode.object
        currentNodeType = currentNode.type
      }

      return currentNodeType === 'CallExpression'
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
      if (isTokenOnSameLine(token, node))
        return hasExcessParens(node)

      return hasDoubleExcessParens(node)
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
     * Checks if the left-hand side of an assignment is an identifier, the operator is one of
     * `=`, `&&=`, `||=` or `??=` and the right-hand side is an anonymous class or function.
     *
     * As per https://tc39.es/ecma262/#sec-assignment-operators-runtime-semantics-evaluation, an
     * assignment involving one of the operators `=`, `&&=`, `||=` or `??=` where the right-hand
     * side is an anonymous class or function and the left-hand side is an *unparenthesized*
     * identifier has different semantics than other assignments.
     * Specifically, when an expression like `foo = function () {}` is evaluated, `foo.name`
     * will be set to the string "foo", i.e. the identifier name. The same thing does not happen
     * when evaluating `(foo) = function () {}`.
     * Since the parenthesizing of the identifier in the left-hand side is significant in this
     * special case, the parentheses, if present, should not be flagged as unnecessary.
     * @param node an AssignmentExpression node.
     * @returns `true` if the left-hand side of the assignment is an identifier, the
     * operator is one of `=`, `&&=`, `||=` or `??=` and the right-hand side is an anonymous
     * class or function; otherwise, `false`.
     */
    function isAnonymousFunctionAssignmentException({ left, operator, right }: Tree.AssignmentExpression) {
      if (left.type === 'Identifier' && ['=', '&&=', '||=', '??='].includes(operator)) {
        const rhsType = right.type

        if (rhsType === 'ArrowFunctionExpression')
          return true

        if ((rhsType === 'FunctionExpression' || rhsType === 'ClassExpression') && !right.id)
          return true
      }
      return false
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
      if ('argument' in node && node.argument) {
        if (hasExcessParensWithPrecedence(node.argument, precedence(node)))
          report(node.argument)
      }
    }

    /**
     * Evaluate binary logicals
     * @param node node to evaluate
     * @private
     */
    function checkBinaryLogical(node: Tree.BinaryExpression | Tree.LogicalExpression) {
      // makes the rule think it should skip the left or right
      const isLeftTypeAssertion = isTypeAssertion(node.left)
      const isRightTypeAssertion = isTypeAssertion(node.right)
      if (isLeftTypeAssertion && isRightTypeAssertion)
        return // ignore

      function shouldSkip(expression: ASTNode) {
        return (
          NESTED_BINARY
          && (expression.type === 'BinaryExpression' || expression.type === 'LogicalExpression')
        )
        || !hasExcessParens(expression)
      }

      const nodePrecedence = precedence(node)
      const isExponentiation = node.operator === '**'

      if (!shouldSkip(node.left)) {
        const leftPrecedence = precedence(node.left)

        if (
          !(['AwaitExpression', 'UnaryExpression'].includes(node.left.type) && isExponentiation)
          // The parent is a ReturnStatement spanning multiple lines without parentheses
          && !(node.parent.type === 'ReturnStatement' && node.parent.loc.start.line !== node.left.loc.start.line && !isParenthesised(node))
          && !isMixedLogicalAndCoalesceExpressions(node.left, node)
          && (leftPrecedence > nodePrecedence || (leftPrecedence === nodePrecedence && !isExponentiation))
          || isParenthesisedTwice(node.left)
        ) {
          report(node.left)
        }
      }

      if (!shouldSkip(node.right)) {
        const rightPrecedence = precedence(node.right)

        if (
          !isMixedLogicalAndCoalesceExpressions(node.right, node)
          && (rightPrecedence > nodePrecedence || (rightPrecedence === nodePrecedence && isExponentiation))
          || isParenthesisedTwice(node.right)
        ) {
          report(node.right)
        }
      }
    }

    function checkCallNew(
      node: Tree.CallExpression | Tree.NewExpression,
    ): void {
      const rule = (node: Tree.CallExpression | Tree.NewExpression) => {
        const callee = node.callee

        if (hasExcessParensWithPrecedence(callee, precedence(node))) {
          if (
            hasDoubleExcessParens(callee)
            || !(
              isIIFE(node)
              // (new A)(); new (new A)();
              || (
                callee.type === 'NewExpression'
                && !isNewExpressionWithParens(callee)
                && !(
                  node.type === 'NewExpression'
                  && !isNewExpressionWithParens(node)
                )
              )

              // new (a().b)(); new (a.b().c);
              || (
                node.type === 'NewExpression'
                && callee.type === 'MemberExpression'
                && doesMemberExpressionContainCallExpression(callee)
              )

              // (a?.b)(); (a?.())();
              || (
                (!('optional' in node) || !node.optional)
                && callee.type === 'ChainExpression'
              )
            )
          ) {
            report(node.callee)
          }
        }
        node.arguments
          .forEach((arg) => {
            if (hasExcessParensWithPrecedence(arg, PRECEDENCE_OF_ASSIGNMENT_EXPR))
              report(arg)
          })
      }

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

    /**
     * Checks the parentheses for an ExpressionStatement or ExportDefaultDeclaration
     * @param node The ExpressionStatement.expression or ExportDefaultDeclaration.declaration node
     */
    function checkExpressionOrExportStatement(node: Tree.ExportDefaultDeclaration | Tree.ExpressionStatement | Tree.DefaultExportDeclarations) {
      const firstToken = isParenthesised(node) ? sourceCode.getTokenBefore(node)! : sourceCode.getFirstToken(node)!
      const secondToken = sourceCode.getTokenAfter(firstToken, isNotOpeningParenToken)!
      const thirdToken = secondToken ? sourceCode.getTokenAfter(secondToken) : null
      const tokenAfterClosingParens = secondToken ? sourceCode.getTokenAfter(secondToken, isNotClosingParenToken) : null

      if (
        isOpeningParenToken(firstToken)
        && (
          isOpeningBraceToken(secondToken)
          || isKeywordToken(secondToken) && (
            secondToken.value === 'function'
            || secondToken.value === 'class'
            || secondToken.value === 'let'
            && tokenAfterClosingParens
            && (
              isOpeningBracketToken(tokenAfterClosingParens)
              || tokenAfterClosingParens.type === 'Identifier'
            )
          )
          || secondToken && secondToken.type === 'Identifier' && secondToken.value === 'async' && isKeywordToken(thirdToken) && thirdToken.value === 'function'
        )
      ) {
        tokensToIgnore.add(secondToken)
      }

      const hasExtraParens = node.parent.type === 'ExportDefaultDeclaration'
        ? hasExcessParensWithPrecedence(node, PRECEDENCE_OF_ASSIGNMENT_EXPR)
        : hasExcessParens(node)

      if (hasExtraParens)
        report(node)
    }

    return {
      ArrayExpression(node) {
        node.elements
          .forEach((ele) => {
            if (ele && hasExcessParensWithPrecedence(ele, PRECEDENCE_OF_ASSIGNMENT_EXPR))
              report(ele)
          })
      },
      ArrayPattern(node) {
        node.elements
          .forEach((ele) => {
            if (ele && canBeAssignmentTarget(ele) && hasExcessParens(ele))
              report(ele)
          })
      },
      ArrowFunctionExpression(node) {
        if (isTypeAssertion(node.body))
          return

        if (isReturnAssignException(node))
          return

        if (
          node.body.type === 'ConditionalExpression'
          && IGNORE_ARROW_CONDITIONALS
        ) {
          return
        }

        if (node.body.type === 'BlockStatement')
          return

        const firstBodyToken = sourceCode.getFirstToken(node.body, isNotOpeningParenToken)!
        const tokenBeforeFirst = sourceCode.getTokenBefore(firstBodyToken)!

        if (isOpeningParenToken(tokenBeforeFirst) && isOpeningBraceToken(firstBodyToken))
          tokensToIgnore.add(firstBodyToken)

        if (hasExcessParensWithPrecedence(node.body, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(node.body)
      },
      AssignmentExpression(node) {
        if (canBeAssignmentTarget(node.left) && hasExcessParens(node.left)
          && (!isAnonymousFunctionAssignmentException(node) || isParenthesisedTwice(node.left))) {
          report(node.left)
        }

        if (!isReturnAssignException(node) && hasExcessParensWithPrecedence(node.right, precedence(node)))
          report(node.right)
      },
      AssignmentPattern(node) {
        const { left, right } = node

        if (canBeAssignmentTarget(left) && hasExcessParens(left))
          report(left)

        if (right && hasExcessParensWithPrecedence(right, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(right)
      },
      'AwaitExpression': checkArgumentWithPrecedence,
      BinaryExpression(node) {
        if (reportsBuffer && node.operator === 'in')
          reportsBuffer.inExpressionNodes.push(node)

        checkBinaryLogical(node)
      },
      'CallExpression': checkCallNew,
      'ClassDeclaration': checkClass,
      'ClassExpression': checkClass,

      ConditionalExpression(node) {
        if (isReturnAssignException(node))
          return

        const availableTypes = new Set(['BinaryExpression', 'LogicalExpression'])

        // TODO: fix in v6
        function shouldCheck(expression: ASTNode, precedenceLimit: number) {
          return isTypeAssertion(expression)
            ? hasDoubleExcessParens(expression)
            : hasExcessParensWithPrecedence(expression, precedenceLimit)
        }

        if (
          !(EXCEPT_COND_TERNARY && availableTypes.has(node.test.type))
          && !(ALLOW_NESTED_TERNARY && ['ConditionalExpression'].includes(node.test.type))
          && !isCondAssignException(node)
          && shouldCheck(node.test, precedence({ type: 'LogicalExpression', operator: '||' } as Tree.LogicalExpression))
        ) {
          report(node.test)
        }

        if (
          !(EXCEPT_COND_TERNARY && availableTypes.has(node.consequent.type))
          && !(ALLOW_NESTED_TERNARY && ['ConditionalExpression'].includes(node.consequent.type))
          && shouldCheck(node.consequent, PRECEDENCE_OF_ASSIGNMENT_EXPR)
        ) {
          report(node.consequent)
        }

        if (
          !(EXCEPT_COND_TERNARY && availableTypes.has(node.alternate.type))
          && !(ALLOW_NESTED_TERNARY && ['ConditionalExpression'].includes(node.alternate.type))
          && shouldCheck(node.alternate, PRECEDENCE_OF_ASSIGNMENT_EXPR)
        ) {
          report(node.alternate)
        }
      },
      DoWhileStatement(node) {
        if (hasExcessParens(node.test) && !isCondAssignException(node))
          report(node.test)
      },
      ExportDefaultDeclaration(node) {
        checkExpressionOrExportStatement(node.declaration)
      },
      ExpressionStatement(node) {
        checkExpressionOrExportStatement(node.expression)
      },
      ForInStatement(node) {
        if (isTypeAssertion(node.right)) {
          // as of 7.20.0 there's no way to skip checking the right of the ForIn
          // so just don't validate it at all
          return
        }

        if (node.left.type !== 'VariableDeclaration') {
          const firstLeftToken = sourceCode.getFirstToken(node.left, isNotOpeningParenToken)!

          if (
            firstLeftToken.value === 'let'
            && isOpeningBracketToken(
              sourceCode.getTokenAfter(firstLeftToken, isNotClosingParenToken)!,
            )
          ) {
            // ForInStatement#left expression cannot start with `let[`.
            tokensToIgnore.add(firstLeftToken)
          }
        }

        if (hasExcessParens(node.left))
          report(node.left)

        if (hasExcessParens(node.right))
          report(node.right)
      },
      ForOfStatement(node) {
        if (node.left.type !== 'VariableDeclaration') {
          const firstLeftToken = sourceCode.getFirstToken(node.left, isNotOpeningParenToken)!

          if (firstLeftToken.value === 'let') {
            // ForOfStatement#left expression cannot start with `let`.
            tokensToIgnore.add(firstLeftToken)
          }
        }

        if (hasExcessParens(node.left))
          report(node.left)

        if (!isTypeAssertion(node.right) && hasExcessParensWithPrecedence(node.right, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(node.right)
      },
      ForStatement(node) {
        if (node.test && hasExcessParens(node.test) && !isCondAssignException(node) && !isTypeAssertion(node.test))
          report(node.test)

        if (node.update && hasExcessParens(node.update) && !isTypeAssertion(node.update))
          report(node.update)

        if (node.init && !isTypeAssertion(node.init)) {
          if (node.init.type !== 'VariableDeclaration') {
            const firstToken = sourceCode.getFirstToken(node.init, isNotOpeningParenToken)!

            if (
              firstToken.value === 'let'
              && isOpeningBracketToken(
                sourceCode.getTokenAfter(firstToken, isNotClosingParenToken)!,
              )
            ) {
              // ForStatement#init expression cannot start with `let[`.
              tokensToIgnore.add(firstToken)
            }
          }

          startNewReportsBuffering()

          if (hasExcessParens(node.init))
            report(node.init)
        }
      },
      'ForStatement > *.init:exit': function (node: ASTNode) {
        if (isTypeAssertion(node))
          return

        /**
         * Removing parentheses around `in` expressions might change semantics and cause errors.
         *
         * For example, this valid for loop:
         *      for (let a = (b in c); ;);
         * after removing parentheses would be treated as an invalid for-in loop:
         *      for (let a = b in c; ;);
         */

        if (reportsBuffer?.reports.length) {
          reportsBuffer.inExpressionNodes.forEach((inExpressionNode) => {
            const path = pathToDescendant(node, inExpressionNode)
            let nodeToExclude: ASTNode | null = null

            for (let i = 0; i < path.length; i++) {
              const pathNode = path[i]

              if (i < path.length - 1) {
                const nextPathNode = path[i + 1]

                if (isSafelyEnclosingInExpression(pathNode, nextPathNode)) {
                  // The 'in' expression in safely enclosed by the syntax of its ancestor nodes (e.g. by '{}' or '[]').
                  return
                }
              }

              if (isParenthesised(pathNode)) {
                if (isInCurrentReportsBuffer(pathNode)) {
                  // This node was supposed to be reported, but parentheses might be necessary.

                  if (isParenthesisedTwice(pathNode)) {
                    /**
                     * This node is parenthesised twice, it certainly has at least one pair of `extra` parentheses.
                     * If the --fix option is on, the current fixing iteration will remove only one pair of parentheses.
                     * The remaining pair is safely enclosing the 'in' expression.
                     */
                    return
                  }

                  // Exclude the outermost node only.
                  if (!nodeToExclude)
                    nodeToExclude = pathNode

                  // Don't break the loop here, there might be some safe nodes or parentheses that will stay inside.
                }
                else {
                  // This node will stay parenthesised, the 'in' expression in safely enclosed by '()'.
                  return
                }
              }
            }

            if (nodeToExclude)
              // Exclude the node from the list (i.e. treat parentheses as necessary)
              removeFromCurrentReportsBuffer(nodeToExclude)
          })
        }

        endCurrentReportsBuffering()
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
      'LogicalExpression': checkBinaryLogical,
      MemberExpression(node) {
        const shouldAllowWrapOnce = isMemberExpInNewCallee(node)
          && doesMemberExpressionContainCallExpression(node)
        const nodeObjHasExcessParens = shouldAllowWrapOnce
          ? hasDoubleExcessParens(node.object)
          : hasExcessParens(node.object)
            && !(
              isImmediateFunctionPrototypeMethodCall(node.parent)
              && 'callee' in node.parent && node.parent.callee === node
              && IGNORE_FUNCTION_PROTOTYPE_METHODS
            )
            && !isTypeAssertion(node.object)

        if (
          nodeObjHasExcessParens
          && precedence(node.object) >= precedence(node)
          && (
            node.computed
            || !(
              isDecimalInteger(node.object)
              // RegExp literal is allowed to have parens (https://github.com/eslint/eslint/issues/1589)
              || isRegExpLiteral(node.object)
            )
          )
        ) {
          report(node.object)
        }

        if (nodeObjHasExcessParens
          && node.object.type === 'CallExpression'
        ) {
          report(node.object)
        }

        if (nodeObjHasExcessParens
          && !IGNORE_NEW_IN_MEMBER_EXPR
          && node.object.type === 'NewExpression'
          && isNewExpressionWithParens(node.object)) {
          report(node.object)
        }

        if (nodeObjHasExcessParens
          && node.optional
          && node.object.type === 'ChainExpression'
        ) {
          report(node.object)
        }

        if (node.computed && hasExcessParens(node.property))
          report(node.property)
      },
      MethodDefinition(node) {
        if (!node.computed)
          return
        if (hasExcessParensWithPrecedence(node.key, PRECEDENCE_OF_ASSIGNMENT_EXPR))
          report(node.key)
      },
      'NewExpression': checkCallNew,
      ObjectExpression(node) {
        node.properties
          .forEach((property) => {
            if (
              property.type === 'Property'
              && property.value
              && hasExcessParensWithPrecedence(property.value, PRECEDENCE_OF_ASSIGNMENT_EXPR)
            ) {
              report(property.value)
            }
          })
      },
      ObjectPattern(node) {
        node.properties
          .forEach((property) => {
            const value = property.value

            if (value && canBeAssignmentTarget(value) && hasExcessParens(value))
              report(value)
          })
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

        if (
          node.argument
          && returnToken
          && hasExcessParensNoLineTerminator(returnToken, node.argument)
          // RegExp literal is allowed to have parens (https://github.com/eslint/eslint/issues/1589)
          && !isRegExpLiteral(node.argument)
        ) {
          report(node.argument)
        }
      },
      SequenceExpression(node) {
        const precedenceOfNode = precedence(node)

        node.expressions
          .forEach((ele) => {
            if (hasExcessParensWithPrecedence(ele, precedenceOfNode))
              report(ele)
          })
      },
      SpreadElement(node) {
        if (isTypeAssertion(node.argument))
          return

        if (ALLOW_NODES_IN_SPREAD && ALLOW_NODES_IN_SPREAD.has(node.argument.type))
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
          .forEach((ele) => {
            if (hasExcessParens(ele))
              report(ele)
          })
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
      'UnaryExpression': checkArgumentWithPrecedence,
      UpdateExpression(node) {
        if (node.prefix) {
          checkArgumentWithPrecedence(node)
        }
        else {
          const { argument } = node
          const operatorToken = sourceCode.getLastToken(node)!

          if (isTokenOnSameLine(argument, operatorToken)) {
            checkArgumentWithPrecedence(node)
          }
          else {
            if (hasDoubleExcessParens(argument))
              report(argument)
          }
        }
      },
      VariableDeclarator(node) {
        if (
          node.init
          && hasExcessParensWithPrecedence(node.init, PRECEDENCE_OF_ASSIGNMENT_EXPR)
          // RegExp literal is allowed to have parens (https://github.com/eslint/eslint/issues/1589)
          && !isRegExpLiteral(node.init)
        ) {
          report(node.init)
        }
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
      // TODO: more cases like `number`, `boolean`
      TSStringKeyword(node) {
        if (hasExcessParens(node)) {
          report(node)
        }
      },
    }
  },
})
