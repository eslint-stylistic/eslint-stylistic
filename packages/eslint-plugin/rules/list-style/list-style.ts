import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import {
  hasCommentsBetween,
  isClosingBraceToken,
  isClosingBracketToken,
  isClosingParenToken,
  isNotOpeningParenToken,
  isOpeningBraceToken,
  isOpeningBracketToken,
  isOpeningParenToken,
  isTokenOnSameLine,
} from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'list-style',
  meta: {
    type: 'layout',
    docs: {
      description: 'Having line breaks styles to object, array, named imports and more.',
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
                minimum: 1,
              },
            },
          },
          multiLineConfig: {
            type: 'object',
            additionalProperties: false,
            properties: {
              maxItemsPerLine: {
                type: 'integer',
                minimum: 1,
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
        },
        type: 'object',
        additionalProperties: false,
        properties: {
          singleLine: { $ref: '#/items/0/$defs/singleLineConfig' },
          multiLine: { $ref: '#/items/0/$defs/multiLineConfig' },
          overrides: {
            type: 'object',
            additionalProperties: false,
            properties: {
              ArrayExpression: { $ref: '#/items/0/$defs/baseConfig' },
              ArrayPattern: { $ref: '#/items/0/$defs/baseConfig' },
              ArrowFunctionExpression: { $ref: '#/items/0/$defs/baseConfig' },
              CallExpression: { $ref: '#/items/0/$defs/baseConfig' },
              ExportNamedDeclaration: { $ref: '#/items/0/$defs/baseConfig' },
              FunctionDeclaration: { $ref: '#/items/0/$defs/baseConfig' },
              FunctionExpression: { $ref: '#/items/0/$defs/baseConfig' },
              ImportDeclaration: { $ref: '#/items/0/$defs/baseConfig' },
              NewExpression: { $ref: '#/items/0/$defs/baseConfig' },
              ObjectExpression: { $ref: '#/items/0/$defs/baseConfig' },
              ObjectPattern: { $ref: '#/items/0/$defs/baseConfig' },
              TSFunctionType: { $ref: '#/items/0/$defs/baseConfig' },
              TSInterfaceBody: { $ref: '#/items/0/$defs/baseConfig' },
              TSTupleType: { $ref: '#/items/0/$defs/baseConfig' },
              TSTypeLiteral: { $ref: '#/items/0/$defs/baseConfig' },
              TSTypeParameterDeclaration: { $ref: '#/items/0/$defs/baseConfig' },
              TSTypeParameterInstantiation: { $ref: '#/items/0/$defs/baseConfig' },
              JSONArrayExpression: { $ref: '#/items/0/$defs/baseConfig' },
              JSONObjectExpression: { $ref: '#/items/0/$defs/baseConfig' },
            },
          },
        },
      },
    ],
    messages: {
      shouldSpacing: `Should have space between '{{prev}}' and '{{next}}'`,
      shouldNotSpacing: `Should not have space(s) between '{{prev}}' and '{{next}}'`,
      shouldWrap: `Should have line break between '{{prev}}' and '{{next}}'`,
      shouldNotWrap: 'Should not have line break(s) between items',
    },
  },
  defaultOptions: [{
    singleLine: {
      spacing: 'never',
      maxItems: Number.POSITIVE_INFINITY,
    },
    multiLine: {
      maxItemsPerLine: 1,
    },
    overrides: {
      ObjectExpression: { singleLine: { spacing: 'always' } },
      ObjectPattern: { singleLine: { spacing: 'always' } },
      JSONObjectExpression: { singleLine: { spacing: 'always' } },
    },
  }],
  create: (context, [options] = [{}]) => {
    const { sourceCode } = context
    const {
      singleLine,
      // overrides,
    } = options!

    function checkSpacing(node: ASTNode, prev: Token, next: Token) {
      const shouldSpace = singleLine!.spacing === 'always'
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

    function checkSingleLine(node: ASTNode, left: Token, right: Token) {
      const firstToken = sourceCode.getTokenAfter(left, { includeComments: true })!
      checkSpacing(node, left, firstToken)

      const lastToken = sourceCode.getTokenBefore(right, { includeComments: true })!
      checkSpacing(node, lastToken, right)
    }

    function checkWrap(node: ASTNode, prev: Token, next: Token) {
      if (isTokenOnSameLine(prev, next)) {
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
            if (hasCommentsBetween(sourceCode, prev, next))
              return null

            return fixer.insertTextAfter(
              sourceCode.getTokenBefore(next, token => token === prev || isNotOpeningParenToken(token))!,
              '\n',
            )
          },
        })
      }
    }

    function checkMultiLine(node: ASTNode, items: (ASTNode | null)[], left: Token, right: Token) {
      const len = items.length

      for (let i = 0; i < len; i++) {
        const currentItem = items[i]
        if (!currentItem)
          break

        checkWrap(
          node,
          sourceCode.getTokenBefore(currentItem, { includeComments: false })!,
          sourceCode.getFirstToken(currentItem)!,
        )
      }

      checkWrap(
        node,
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

    function check(type: ParenType, node: ASTNode, items: (ASTNode | null)[]) {
      if (items.length === 0)
        return

      const {
        left: leftMatcher,
        right: rightMatcher,
      } = parenMatchers[type]

      // May not have items[0] or items.at(-1), example:
      // const [, foo, ...bar, ] = arr

      const firstItem = items[0]
      const left = firstItem
        ? sourceCode.getTokenBefore(firstItem, leftMatcher)!
        : sourceCode.getFirstToken(node, leftMatcher)!

      const lastItem = items.at(-1)
      const right = lastItem
        ? sourceCode.getTokenAfter(lastItem, rightMatcher)!
        : sourceCode.getLastToken(node, rightMatcher)!

      const {
        singleLine,
      } = options!

      if (isTokenOnSameLine(left, right) && items.length <= singleLine!.maxItems!)
        checkSingleLine(node, left, right)
      else
        checkMultiLine(node, items, left, right)
    }

    return {
      ArrayExpression(node) {
        check('[]', node, node.elements)
      },
      ArrayPattern(node) {
        check('[]', node, node.elements)
      },
      ObjectExpression(node) {
        check('{}', node, node.properties)
      },
      ObjectPattern(node) {
        check('{}', node, node.properties)
      },
      FunctionDeclaration(node) {
        check('()', node, node.params)
      },
      FunctionExpression(node) {
        check('()', node, node.params)
      },
      ArrowFunctionExpression(node) {
        check('()', node, node.params)
      },
      CallExpression(node) {
        check('()', node, node.arguments)
      },
      NewExpression(node) {
        check('()', node, node.arguments)
      },
      ImportDeclaration(node) {
        check('{}', node, node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier'))

        if (node.attributes)
          check('{}', node, node.attributes)
      },
      ExportNamedDeclaration(node) {
        check('{}', node, node.specifiers)

        if (node.attributes)
          check('{}', node, node.attributes)
      },
      ExportAllDeclaration(node) {
        if (node.attributes)
          check('{}', node, node.attributes)
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
      TSInterfaceBody(node) {
        check('{}', node, node.body)
      },
      TSEnumBody(node) {
        check('{}', node, node.members)
      },
      TSFunctionType(node) {
        check('()', node, node.params)
      },
      TSTypeParameterDeclaration(node) {
        check('<>', node, node.params)
      },
      TSTypeParameterInstantiation(node) {
        check('<>', node, node.params)
      },

      JSONArrayExpression(node: Tree.ArrayExpression) {
        check('[]', node, node.elements)
      },
      JSONObjectExpression(node: Tree.ObjectExpression) {
        check('{}', node, node.properties)
      },
    }
  },
})
