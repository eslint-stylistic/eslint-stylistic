import type { ASTNode, RuleFixer, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { getNextLocation } from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { FixTracker } from '#utils/fix-tracker'
import { AST_NODE_TYPES } from '@typescript-eslint/utils'
import { isClosingBraceToken, isSemicolonToken, isTokenOnSameLine } from '@typescript-eslint/utils/ast-utils'

export default createRule<RuleOptions, MessageIds>({
  name: 'semi',
  meta: {
    type: 'layout',
    docs: {
      description: 'Require or disallow semicolons instead of ASI',
      // too opinionated to be recommended
    },
    fixable: 'code',
    schema: {
      anyOf: [
        {
          type: 'array',
          items: [
            {
              type: 'string',
              enum: ['never'],
            },
            {
              type: 'object',
              properties: {
                beforeStatementContinuationChars: {
                  type: 'string',
                  enum: ['always', 'any', 'never'],
                },
              },
              additionalProperties: false,
            },
          ],
          minItems: 0,
          maxItems: 2,
        },
        {
          type: 'array',
          items: [
            {
              type: 'string',
              enum: ['always'],
            },
            {
              type: 'object',
              properties: {
                omitLastInOneLineBlock: { type: 'boolean' },
                omitLastInOneLineClassBody: { type: 'boolean' },
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
      missingSemi: 'Missing semicolon.',
      extraSemi: 'Extra semicolon.',
    },
  },
  defaultOptions: [
    'always',
    {
      omitLastInOneLineBlock: false,
      beforeStatementContinuationChars: 'any',
    },
  ] as unknown as RuleOptions,
  create(context) {
    const OPT_OUT_PATTERN = /^[-[(/+`]/u // One of [(/+-`
    const unsafeClassFieldNames = new Set(['get', 'set', 'static'])
    const unsafeClassFieldFollowers = new Set(['*', 'in', 'instanceof'])
    const options = context.options[1]
    const never = context.options[0] === 'never'
    const exceptOneLine = Boolean(options && 'omitLastInOneLineBlock' in options && options.omitLastInOneLineBlock)
    const exceptOneLineClassBody = Boolean(options && 'omitLastInOneLineClassBody' in options && options.omitLastInOneLineClassBody)
    const beforeStatementContinuationChars = options
      && 'beforeStatementContinuationChars' in options
      && options.beforeStatementContinuationChars || 'any'
    const sourceCode = context.sourceCode

    /**
     * Reports a semicolon error with appropriate location and message.
     * @param node The node with an extra or missing semicolon.
     * @param missing True if the semicolon is missing.
     */
    function report(node: ASTNode, missing = false) {
      const lastToken = sourceCode.getLastToken(node) as Token
      let messageId: 'missingSemi' | 'extraSemi' = 'missingSemi'

      let fix,
        loc

      if (!missing) {
        loc = {
          start: lastToken.loc.end,
          end: getNextLocation(sourceCode, lastToken.loc.end),
        } as Tree.SourceLocation
        fix = function (fixer: RuleFixer) {
          return fixer.insertTextAfter(lastToken, ';')
        }
      }
      else {
        messageId = 'extraSemi'
        loc = lastToken.loc
        fix = function (fixer: RuleFixer) {
          /**
           * Expand the replacement range to include the surrounding
           * tokens to avoid conflicting with no-extra-semi.
           * https://github.com/eslint/eslint/issues/7928
           */
          return new FixTracker(fixer, sourceCode)
            .retainSurroundingTokens(lastToken)
            .remove(lastToken)
        }
      }

      context.report({
        node,
        loc,
        messageId,
        fix,
      })
    }

    /**
     * Check whether a given semicolon token is redundant.
     * @param semiToken A semicolon token to check.
     * @returns `true` if the next token is `;` or `}`.
     */
    function isRedundantSemi(semiToken: Token) {
      const nextToken = sourceCode.getTokenAfter(semiToken)

      return (
        !nextToken
        || isClosingBraceToken(nextToken)
        || isSemicolonToken(nextToken)
      )
    }

    /**
     * Check whether a given token is the closing brace of an arrow function.
     * @param lastToken A token to check.
     * @returns `true` if the token is the closing brace of an arrow function.
     */
    function isEndOfArrowBlock(lastToken: Token) {
      if (!isClosingBraceToken(lastToken))
        return false

      const node = sourceCode.getNodeByRangeIndex(lastToken.range[0]) as ASTNode

      return (
        node.type === 'BlockStatement'
        && node.parent.type === 'ArrowFunctionExpression'
      )
    }

    /**
     * Checks if a given PropertyDefinition node followed by a semicolon
     * can safely remove that semicolon. It is not to safe to remove if
     * the class field name is "get", "set", or "static", or if
     * followed by a generator method.
     * @param node The node to check.
     * @returns `true` if the node cannot have the semicolon
     *      removed.
     */
    function maybeClassFieldAsiHazard(node: ASTNode) {
      if (node.type !== 'PropertyDefinition')
        return false

      /**
       * Computed property names and non-identifiers are always safe
       * as they can be distinguished from keywords easily.
       */
      const needsNameCheck = !node.computed && node.key.type === 'Identifier'

      /**
       * Certain names are problematic unless they also have a
       * a way to distinguish between keywords and property
       * names.
       */
      if (needsNameCheck && 'name' in node.key && unsafeClassFieldNames.has(node.key.name)) {
        /**
         * Special case: If the field name is `static`,
         * it is only valid if the field is marked as static,
         * so "static static" is okay but "static" is not.
         */
        const isStaticStatic = node.static && node.key.name === 'static'

        /**
         * For other unsafe names, we only care if there is no
         * initializer. No initializer = hazard.
         */
        if (!isStaticStatic && !node.value)
          return true
      }

      const followingToken = sourceCode.getTokenAfter(node) as Token

      return unsafeClassFieldFollowers.has(followingToken.value)
    }

    /**
     * Check whether a given node is on the same line with the next token.
     * @param node A statement node to check.
     * @returns `true` if the node is on the same line with the next token.
     */
    function isOnSameLineWithNextToken(node: ASTNode) {
      const prevToken = sourceCode.getLastToken(node, 1)!
      const nextToken = sourceCode.getTokenAfter(node)

      return !!nextToken && isTokenOnSameLine(prevToken, nextToken)
    }

    /**
     * Check whether a given node can connect the next line if the next line is unreliable.
     * @param node A statement node to check.
     * @returns `true` if the node can connect the next line.
     */
    function maybeAsiHazardAfter(node: ASTNode) {
      const t = node.type

      if (t === 'DoWhileStatement'
        || t === 'BreakStatement'
        || t === 'ContinueStatement'
        || t === 'DebuggerStatement'
        || t === 'ImportDeclaration'
        || t === 'ExportAllDeclaration'
      ) {
        return false
      }

      if (t === 'ReturnStatement')
        return Boolean(node.argument)

      if (t === 'ExportNamedDeclaration')
        return Boolean(node.declaration)

      const lastToken = sourceCode.getLastToken(node, 1) as Token
      if (isEndOfArrowBlock(lastToken))
        return false

      return true
    }

    /**
     * Check whether a given token can connect the previous statement.
     * @param token A token to check.
     * @returns `true` if the token is one of `[`, `(`, `/`, `+`, `-`, ```, `++`, and `--`.
     */
    function maybeAsiHazardBefore(token: Token) {
      return (
        Boolean(token)
        && OPT_OUT_PATTERN.test(token.value)
        && token.value !== '++'
        && token.value !== '--'
      )
    }

    /**
     * Check if the semicolon of a given node is unnecessary, only true if:
     *   - next token is a valid statement divider (`;` or `}`).
     *   - next token is on a new line and the node is not connectable to the new line.
     * @param node A statement node to check.
     * @returns whether the semicolon is unnecessary.
     */
    function canRemoveSemicolon(node: ASTNode) {
      const lastToken = sourceCode.getLastToken(node) as Token
      if (isRedundantSemi(lastToken))
        return true // `;;` or `;}`

      if (maybeClassFieldAsiHazard(node))
        return false

      if (isOnSameLineWithNextToken(node))
        return false // One liner.

      // continuation characters should not apply to class fields
      if (
        node.type !== 'PropertyDefinition'
        && beforeStatementContinuationChars === 'never'
        && !maybeAsiHazardAfter(node)
      ) {
        return true
      }

      // ASI works. This statement doesn't connect to the next.

      const nextToken = sourceCode.getTokenAfter(node) as Token
      if (!maybeAsiHazardBefore(nextToken))
        return true // ASI works. The next token doesn't connect to this statement.

      return false
    }

    /**
     * Checks a node to see if it's the last item in a one-liner block.
     * Block is any `BlockStatement` or `StaticBlock` node. Block is a one-liner if its
     * braces (and consequently everything between them) are on the same line.
     * @param node The node to check.
     * @returns whether the node is the last item in a one-liner block.
     */
    function isLastInOneLinerBlock(node: ASTNode) {
      const parent = node.parent as ASTNode
      const nextToken = sourceCode.getTokenAfter(node)

      if (!nextToken || nextToken.value !== '}')
        return false

      if (parent.type === 'BlockStatement')
        return parent.loc.start.line === parent.loc.end.line

      if (parent.type === 'StaticBlock') {
        const openingBrace = sourceCode.getFirstToken(parent, { skip: 1 }) as Token

        return openingBrace.loc.start.line === parent.loc.end.line
      }

      return false
    }

    /**
     * Checks a node to see if it's the last item in a one-liner `ClassBody` node.
     * ClassBody is a one-liner if its braces (and consequently everything between them) are on the same line.
     * @param node The node to check.
     * @returns whether the node is the last item in a one-liner ClassBody.
     */
    function isLastInOneLinerClassBody(node: ASTNode) {
      const parent = node.parent as ASTNode
      const nextToken = sourceCode.getTokenAfter(node)

      if (!nextToken || nextToken.value !== '}')
        return false

      if (parent.type === 'ClassBody')
        return parent.loc.start.line === parent.loc.end.line

      return false
    }

    /**
     * Checks a node to see if it's followed by a semicolon.
     * @param node The node to check.
     */
    function checkForSemicolon(node: ASTNode) {
      const lastToken = sourceCode.getLastToken(node) as Token
      const isSemi = isSemicolonToken(lastToken)

      if (never) {
        const nextToken = sourceCode.getTokenAfter(node) as Token

        if (isSemi && canRemoveSemicolon(node)) {
          report(node, true)
        }

        else if (
          !isSemi && beforeStatementContinuationChars === 'always'
          && node.type !== 'PropertyDefinition'
          && maybeAsiHazardBefore(nextToken)
        ) {
          report(node)
        }
      }
      else {
        const oneLinerBlock = (exceptOneLine && isLastInOneLinerBlock(node))
        const oneLinerClassBody = (exceptOneLineClassBody && isLastInOneLinerClassBody(node))
        const oneLinerBlockOrClassBody = oneLinerBlock || oneLinerClassBody

        if (isSemi && oneLinerBlockOrClassBody)
          report(node, true)
        else if (!isSemi && !oneLinerBlockOrClassBody)
          report(node)
      }
    }

    // The following nodes are handled by the member-delimiter-style rule
    // AST_NODE_TYPES.TSCallSignatureDeclaration,
    // AST_NODE_TYPES.TSConstructSignatureDeclaration,
    // AST_NODE_TYPES.TSIndexSignature,
    // AST_NODE_TYPES.TSMethodSignature,
    // AST_NODE_TYPES.TSPropertySignature,
    return {
      VariableDeclaration(node) {
        const parent = node.parent

        if ((parent.type !== 'ForStatement' || parent.init !== node)
          && (!/^For(?:In|Of)Statement/u.test(parent.type) || (parent as Tree.ForInStatement).left !== node)
        ) {
          checkForSemicolon(node)
        }
      },
      ExpressionStatement: checkForSemicolon,
      ReturnStatement: checkForSemicolon,
      ThrowStatement: checkForSemicolon,
      DoWhileStatement: checkForSemicolon,
      DebuggerStatement: checkForSemicolon,
      BreakStatement: checkForSemicolon,
      ContinueStatement: checkForSemicolon,
      ImportDeclaration: checkForSemicolon,
      ExportAllDeclaration: checkForSemicolon,
      ExportNamedDeclaration(node) {
        if (!node.declaration)
          checkForSemicolon(node)
      },
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === AST_NODE_TYPES.TSInterfaceDeclaration)
          return

        if (!/(?:Class|Function)Declaration/u.test(node.declaration.type))
          checkForSemicolon(node)
      },
      PropertyDefinition: checkForSemicolon,
      TSAbstractPropertyDefinition: checkForSemicolon,
      TSDeclareFunction: checkForSemicolon,
      TSExportAssignment: checkForSemicolon,
      TSImportEqualsDeclaration: checkForSemicolon,
      TSTypeAliasDeclaration: checkForSemicolon,
      TSEmptyBodyFunctionExpression: checkForSemicolon,
    }
  },
})
