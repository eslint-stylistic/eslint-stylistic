import type { ASTNode, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { isClosingBraceToken, isClosingBracketToken, isOpeningBraceToken, isOpeningBracketToken, isSingleLine } from '#utils/ast'
import { createRule } from '#utils/create-rule'

export default createRule<RuleOptions, MessageIds>({
  name: 'list-style',
  meta: {
    type: 'layout',
    docs: {
      description: 'Having line breaks styles to object, array and named imports',
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
              JSXOpeningElement: { $ref: '#/items/0/$defs/baseConfig' },
              NewExpression: { $ref: '#/items/0/$defs/baseConfig' },
              ObjectExpression: { $ref: '#/items/0/$defs/baseConfig' },
              ObjectPattern: { $ref: '#/items/0/$defs/baseConfig' },
              TSFunctionType: { $ref: '#/items/0/$defs/baseConfig' },
              TSInterfaceDeclaration: { $ref: '#/items/0/$defs/baseConfig' },
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
      shouldWrap: 'Should have line breaks between items, in node {{name}}',
      shouldNotWrap: 'Should not have line breaks between items, in node {{name}}',
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
  }],
  create: (context, [options] = [{}]) => {
    const { sourceCode } = context
    const {
      singleLine,
      // multiline,
      // overrides,
    } = options!

    function checkSingleLine(node: ASTNode, left: Token, right: Token) {
      const shouldSpace = singleLine!.spacing === 'always'

      const firstToken = sourceCode.getTokenAfter(left, { includeComments: true })!
      const firstSpaced = sourceCode.isSpaceBetween!(left, firstToken)
      if (!firstSpaced && shouldSpace) {
        context.report({
          node,
          messageId: 'shouldWrap',
          loc: {
            start: left.loc.end,
            end: firstToken.loc.start,
          },
          fix(fixer) {
            return fixer.insertTextAfter(left, ' ')
          },
        })
      }
      else if (firstSpaced && !shouldSpace) {
        context.report({
          node,
          messageId: 'shouldNotWrap',
          loc: {
            start: left.loc.end,
            end: firstToken.loc.start,
          },
          fix(fixer) {
            return fixer.removeRange([left.range[1], firstToken.range[0]])
          },
        })
      }

      const lastToken = sourceCode.getTokenBefore(right, { includeComments: true })!
      const lastSpaced = sourceCode.isSpaceBetween!(lastToken, right)
      if (!lastSpaced && shouldSpace) {
        context.report({
          node,
          messageId: 'shouldWrap',
          loc: {
            start: lastToken.loc.end,
            end: right.loc.start,
          },
          fix(fixer) {
            return fixer.insertTextBefore(right, ' ')
          },
        })
      }
      else if (lastSpaced && !shouldSpace) {
        context.report({
          node,
          messageId: 'shouldNotWrap',
          loc: {
            start: lastToken.loc.end,
            end: right.loc.start,
          },
          fix(fixer) {
            return fixer.removeRange([lastToken.range[1], right.range[0]])
          },
        })
      }
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    function checkMultiLine(node: ASTNode, left: Token, right: Token) {
      // TODO
    }

    type ParenType = '[]' | '{}'

    const parenMatchers: Record<ParenType, { left: (token: Token) => boolean, right: (token: Token) => boolean }> = {
      '[]': {
        left: isOpeningBracketToken,
        right: isClosingBracketToken,
      },
      '{}': {
        left: isOpeningBraceToken,
        right: isClosingBraceToken,
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

      if (isSingleLine(node))
        checkSingleLine(node, left, right)
      else
        checkMultiLine(node, left, right)
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

      JSONArrayExpression(node: Tree.ArrayExpression) {
        check('[]', node, node.elements)
      },
      JSONObjectExpression(node: Tree.ObjectExpression) {
        check('{}', node, node.properties)
      },
    }
  },
})
