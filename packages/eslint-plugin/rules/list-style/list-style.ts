import type { ASTNode, Token, Tree } from '#types'
import type { BaseConfig, MessageIds, OverrideConfig, RuleOptions } from './types'
import {
  AST_NODE_TYPES,
  isClosingBraceToken,
  isClosingBracketToken,
  isClosingParenToken,
  isNotCommaToken,
  isNotOpeningParenToken,
  isOpeningBraceToken,
  isOpeningBracketToken,
  isOpeningParenToken,
  isSingleLine,
  isTokenOnSameLine,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'
import { safeReplaceTextBetween } from '#utils/fix'

export default createRule<RuleOptions, MessageIds>({
  name: 'list-style',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent spacing and line break styles inside brackets.',
      experimental: true,
    },
    fixable: 'whitespace',
    schema: [
      {
        $defs: {
          singleLineConfig: {
            type: 'object',
            additionalProperties: false,
            properties: {
              spacing: {
                type: 'string',
                enum: ['always', 'never'],
              },
              maxItems: {
                type: 'integer',
                minimum: 0,
              },
            },
          },
          multiLineConfig: {
            type: 'object',
            additionalProperties: false,
            properties: {
              minItems: {
                type: 'integer',
                minimum: 0,
              },
            },
          },
          baseConfig: {
            type: 'object',
            additionalProperties: false,
            properties: {
              singleLine: { $ref: '#/items/0/$defs/singleLineConfig' },
              multiline: { $ref: '#/items/0/$defs/multiLineConfig' },
            },
          },
          overrideConfig: {
            oneOf: [
              { $ref: '#/items/0/$defs/baseConfig' },
              { type: 'string', enum: ['off'] },
            ],
          },
        },
        type: 'object',
        additionalProperties: false,
        properties: {
          singleLine: { $ref: '#/items/0/$defs/singleLineConfig' },
          multiLine: { $ref: '#/items/0/$defs/multiLineConfig' },
          overrides: {
            type: 'object',
            additionalProperties: false,
            /// keep-sorted
            properties: {
              '()': { $ref: '#/items/0/$defs/overrideConfig' },
              '[]': { $ref: '#/items/0/$defs/overrideConfig' },
              '{}': { $ref: '#/items/0/$defs/overrideConfig' },
              '<>': { $ref: '#/items/0/$defs/overrideConfig' },

              'ArrayExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'ArrayPattern': { $ref: '#/items/0/$defs/overrideConfig' },
              'ArrowFunctionExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'CallExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'ExportNamedDeclaration': { $ref: '#/items/0/$defs/overrideConfig' },
              'FunctionDeclaration': { $ref: '#/items/0/$defs/overrideConfig' },
              'FunctionExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'IfStatement': { $ref: '#/items/0/$defs/overrideConfig' },
              'ImportAttributes': { $ref: '#/items/0/$defs/overrideConfig' },
              'ImportDeclaration': { $ref: '#/items/0/$defs/overrideConfig' },
              'JSONArrayExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'JSONObjectExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'NewExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'ObjectExpression': { $ref: '#/items/0/$defs/overrideConfig' },
              'ObjectPattern': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSDeclareFunction': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSEnumBody': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSFunctionType': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSInterfaceBody': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSTupleType': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSTypeLiteral': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSTypeParameterDeclaration': { $ref: '#/items/0/$defs/overrideConfig' },
              'TSTypeParameterInstantiation': { $ref: '#/items/0/$defs/overrideConfig' },
            },
          },
        },
      },
    ],
    // #region defaultOptions
    defaultOptions: [{
      singleLine: {
        spacing: 'never',
        maxItems: Number.POSITIVE_INFINITY,
      },
      multiLine: {
        minItems: 0,
      },
      overrides: {
        '{}': { singleLine: { spacing: 'always' } },
      },
    }],
    // #endregion defaultOptions
    messages: {
      shouldSpacing: `Should have space between '{{prev}}' and '{{next}}'`,
      shouldNotSpacing: `Should not have space(s) between '{{prev}}' and '{{next}}'`,
      shouldWrap: `Should have line break between '{{prev}}' and '{{next}}'`,
      shouldNotWrap: `Should not have line break(s) between '{{prev}}' and '{{next}}'`,
    },
  },
  create: (context, [options]) => {
    const { sourceCode } = context
    const {
      singleLine,
      multiLine,
      overrides,
    } = options!

    type OverrideKey = keyof NonNullable<typeof overrides>

    const _resolvedOptions = new Map<OverrideKey, Required<OverrideConfig>>()

    function resolveOption(parenType: ParenType, nodeType: OverrideKey): Required<OverrideConfig> {
      if (_resolvedOptions.has(nodeType))
        return _resolvedOptions.get(nodeType)!

      let overridesByParen = overrides?.[parenType]
      let overridesByNode = overrides?.[nodeType]

      let resolved: Required<OverrideConfig>
      if (overridesByNode === 'off' || (overridesByNode === undefined && overridesByParen === 'off')) {
        resolved = 'off'
      }
      else {
        overridesByParen = typeof overridesByParen === 'object' ? overridesByParen : {}
        overridesByNode ??= {}

        resolved = {
          singleLine: {
            ...singleLine,
            ...overridesByParen.singleLine,
            ...overridesByNode.singleLine,
          },
          multiline: {
            ...multiLine,
            ...overridesByParen.multiline,
            ...overridesByNode.multiline,
          },
        }
      }

      _resolvedOptions.set(nodeType, resolved)
      return resolved
    }

    function getDelimiter(root: ASTNode, current: Token): string | undefined {
      if (root.type !== 'TSInterfaceBody' && root.type !== 'TSTypeLiteral')
        return

      return current.value.match(/(?:,|;)$/) ? undefined : ','
    }

    function checkSpacing(node: ASTNode, left: Token, right: Token, config: BaseConfig) {
      const shouldSpace = config.singleLine!.spacing === 'always'
      const firstToken = sourceCode.getTokenAfter(left, { includeComments: true })!
      const lastToken = sourceCode.getTokenBefore(right, { includeComments: true })!

      function doCheck(prev: Token, next: Token) {
        const spaced = sourceCode.isSpaceBetween(prev, next)

        if (!spaced && shouldSpace) {
          context.report({
            node,
            messageId: 'shouldSpacing',
            loc: {
              start: prev.loc.end,
              end: next.loc.start,
            },
            data: {
              prev: prev.value,
              next: next.value,
            },
            fix(fixer) {
              return fixer.insertTextAfter(prev, ' ')
            },
          })
        }
        else if (spaced && !shouldSpace) {
          context.report({
            node,
            messageId: 'shouldNotSpacing',
            loc: {
              start: prev.loc.end,
              end: next.loc.start,
            },
            data: {
              prev: prev.value,
              next: next.value,
            },
            fix(fixer) {
              return fixer.removeRange([prev.range[1], next.range[0]])
            },
          })
        }
      }

      doCheck(left, firstToken)
      doCheck(lastToken, right)
    }

    function checkWrap(node: ASTNode, items: (ASTNode | null)[], left: Token, right: Token, config: BaseConfig) {
      const len = items.length

      const needWrap = (
        isSingleLine(node)
          ? len > config.singleLine!.maxItems!
          : len >= config.multiline!.minItems! && !isTokenOnSameLine(left, items[0] ?? sourceCode.getTokenAfter(left)!)
      )

      function doCheck(prev: Token, next: Token) {
        if (isTokenOnSameLine(prev, next)) {
          if (!needWrap)
            return

          context.report({
            node,
            messageId: 'shouldWrap',
            loc: {
              start: prev.loc.end,
              end: next.loc.start,
            },
            data: {
              prev: prev.value,
              next: next.value,
            },
            fix(fixer) {
              if (sourceCode.commentsExistBetween(prev, next))
                return null

              return fixer.insertTextBefore(
                next,
                '\n',
              )
            },
          })
        }
        else {
          if (needWrap)
            return

          context.report({
            node,
            messageId: 'shouldNotWrap',
            loc: {
              start: prev.loc.end,
              end: next.loc.start,
            },
            data: {
              prev: prev.value,
              next: next.value,
            },
            fix: safeReplaceTextBetween(sourceCode, prev, next, () => items.length === 1 ? '' : getDelimiter(node, prev) ?? ''),
          })
        }
      }

      const tokenAfterLeft = sourceCode.getTokenAfter(left, { includeComments: false })!

      doCheck(left, tokenAfterLeft)

      for (let i = 0; i < len; i++) {
        const currentItem = items[i]
        if (!currentItem)
          continue

        const currentFirstToken = sourceCode.getFirstToken(currentItem)!

        if (i === 0 && tokenAfterLeft === currentFirstToken)
          continue

        const tokenBeforeItem = sourceCode.getTokenBefore(currentItem, {
          filter: token => isNotOpeningParenToken(token) || token === left,
          includeComments: false,
        })!

        doCheck(tokenBeforeItem, currentFirstToken)
      }

      doCheck(
        sourceCode.getTokenBefore(right, { includeComments: false })!,
        right,
      )
    }

    type ParenType = '[]' | '{}' | '()' | '<>'

    const parenMatchers: Record<ParenType, { left: (token: Token) => boolean, right: (token: Token) => boolean }> = {
      '[]': {
        left: isOpeningBracketToken,
        right: isClosingBracketToken,
      },
      '{}': {
        left: isOpeningBraceToken,
        right: isClosingBraceToken,
      },
      '()': {
        left: isOpeningParenToken,
        right: isClosingParenToken,
      },
      '<>': {
        left: token => token.value === '<',
        right: token => token.value === '>',
      },
    }

    function getLeftParen(node: ASTNode, items: (ASTNode | null)[], type: ParenType) {
      switch (node.type) {
        // fun?.()
        // fun<T>()
        // new Foo<T>()
        case AST_NODE_TYPES.CallExpression:
        case AST_NODE_TYPES.NewExpression:
          return sourceCode.getTokenAfter(node.typeArguments ?? node.callee, isOpeningParenToken)

        // const foo = [, a]
        // const [, a] = foo
        case AST_NODE_TYPES.ArrayExpression:
        case AST_NODE_TYPES.ArrayPattern:
          return sourceCode.getFirstToken(node)

        default: {
          const maybeLeft = sourceCode.getTokenBefore(items[0]!)
          // foo => bar
          const { left: matcher } = parenMatchers[type]
          return maybeLeft && matcher(maybeLeft) ? maybeLeft : null
        }
      }
    }

    function getRightParen(node: ASTNode, items: (ASTNode | null)[], type: ParenType) {
      switch (node.type) {
        // const foo = [a, ]
        // const [a, ] = foo
        case AST_NODE_TYPES.ArrayExpression:
        case AST_NODE_TYPES.ArrayPattern:
          return sourceCode.getLastToken(node)

        default:{
          const maybeRight = sourceCode.getTokenAfter(items.at(-1)!, isNotCommaToken)
          // foo => bar
          const { right: matcher } = parenMatchers[type]
          return maybeRight && matcher(maybeRight) ? maybeRight : null
        }
      }
    }

    function check(parenType: ParenType, node: ASTNode, items: (ASTNode | null)[]) {
      if (items.length === 0)
        return

      const left = getLeftParen(node, items, parenType)
      const right = getRightParen(node, items, parenType)

      if (!left || !right)
        return

      const nodeType = items[0]?.type === 'ImportAttribute' ? 'ImportAttributes' : node.type as OverrideKey

      const config = resolveOption(parenType, nodeType)

      if (config === 'off')
        return

      if (isTokenOnSameLine(left, right) && items.length <= config.singleLine.maxItems!) {
        checkSpacing(node, left, right, config)
      }
      else {
        checkWrap(node, items, left, right, config)
      }
    }

    /// keep-sorted
    return {
      ArrayExpression(node) {
        check('[]', node, node.elements)
      },
      ArrayPattern(node) {
        check('[]', node, node.elements)
      },
      ArrowFunctionExpression(node) {
        check('()', node, node.params)
      },
      CallExpression(node) {
        check('()', node, node.arguments)
      },
      ExportAllDeclaration(node) {
        if (node.attributes)
          check('{}', node, node.attributes)
      },
      ExportNamedDeclaration(node) {
        check('{}', node, node.specifiers)

        if (node.attributes)
          check('{}', node, node.attributes)
      },
      FunctionDeclaration(node) {
        check('()', node, node.params)
      },
      FunctionExpression(node) {
        check('()', node, node.params)
      },
      IfStatement: (node) => {
        check('()', node, [node.test])
      },
      ImportDeclaration(node) {
        check('{}', node, node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier'))

        if (node.attributes)
          check('{}', node, node.attributes)
      },
      JSONArrayExpression(node: Tree.ArrayExpression) {
        check('[]', node, node.elements)
      },
      JSONObjectExpression(node: Tree.ObjectExpression) {
        check('{}', node, node.properties)
      },
      NewExpression(node) {
        check('()', node, node.arguments)
      },
      ObjectExpression(node) {
        check('{}', node, node.properties)
      },
      ObjectPattern(node) {
        check('{}', node, node.properties)
      },
      TSDeclareFunction(node) {
        check('()', node, node.params)
      },
      TSEnumBody(node) {
        check('{}', node, node.members)
      },
      TSFunctionType(node) {
        check('()', node, node.params)
      },
      TSInterfaceBody(node) {
        check('{}', node, node.body)
      },
      // TSMappedType(node) {
      //   check('[]', node, )
      // },
      TSTupleType(node) {
        check('[]', node, node.elementTypes)
      },
      TSTypeLiteral(node) {
        check('{}', node, node.members)
      },
      TSTypeParameterDeclaration(node) {
        check('<>', node, node.params)
      },
      TSTypeParameterInstantiation(node) {
        check('<>', node, node.params)
      },
    }
  },
})
