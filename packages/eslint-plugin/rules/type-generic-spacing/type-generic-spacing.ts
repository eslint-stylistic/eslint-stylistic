import type { NodeTypes, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

const IGNORE_BEFORE = new Set<NodeTypes>([
  'TSCallSignatureDeclaration',
  // const foo = <T>(name: T) => name
  //            ^
  // handled by `space-infix-ops`
  'ArrowFunctionExpression',
  // type Foo = <T>(name: T) => name
  //           ^
  // handled by `space-infix-ops`
  'TSFunctionType',
  // type Foo = new <T>(name: T) => name
  //               ^
  // handled by `space-unary-ops`
  'TSConstructorType',
  'FunctionExpression',
  // const foo = class <T> {}
  //                  ^
  // handled by `keyword-spacing`
  'ClassExpression',
])

const IGNORE_AFTER = new Set<NodeTypes>([
  // const foo = class Foo<T> extends Bar<T> {}
  //                                        ^
  // const foo = class Foo<T> {}
  //                         ^
  // handled by `space-before-blocks`
  'ClassExpression',
  // class foo<T> extends bar<T> {}
  //             ^              ^
  // handled by `keyword-spacing` and `space-before-blocks`
  'ClassDeclaration',
  // type Foo<T> = T
  //            ^
  // handled by `space-infix-ops`
  'TSTypeAliasDeclaration',
  // interface Foo<T> {}
  //                 ^
  // handled by `space-before-blocks`
  'TSInterfaceDeclaration',
  'TSTypeReference',
  // type Foo = import('foo')<T> ['Foo']
  //                            ^
  // handled by `no-whitespace-before-property`
  'TSImportType',
])

type SupportNodes = Tree.TSTypeParameterDeclaration | Tree.TSTypeParameterInstantiation

export default createRule<RuleOptions, MessageIds>({
  name: 'type-generic-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforces consistent spacing inside TypeScript type generics',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          before: {
            type: 'boolean',
            default: false,
          },
          after: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      genericSpacingMismatch: 'Generic spaces mismatch',
    },
  },
  defaultOptions: [
    {
      before: false,
      after: false,
    },
  ],
  create: (context) => {
    const sourceCode = context.sourceCode

    function checkBefore(node: SupportNodes) {
      if (IGNORE_BEFORE.has(node.parent.type))
        return

      const preToken = sourceCode.getTokenBefore(node, { includeComments: true })
      if (!preToken)
        return

      const preSpace = sourceCode.isSpaceBetween(preToken, node)

      if (preSpace) {
        context.report({
          node,
          messageId: 'genericSpacingMismatch',
          fix(fixer) {
            return fixer.replaceTextRange([preToken.range[1], node.range[0]], '')
          },
        })
      }
    }

    function checkAfter(node: SupportNodes) {
      if (IGNORE_AFTER.has(node.parent.type))
        return
      const nextToken = sourceCode.getTokenAfter(node, { includeComments: true })
      if (!nextToken)
        return

      if (sourceCode.isSpaceBetween(node, nextToken)) {
        context.report({
          node,
          messageId: 'genericSpacingMismatch',
          fix(fixer) {
            return fixer.replaceTextRange([node.range[1], nextToken.range[0]], '')
          },
        })
      }
    }

    function checkSpacing(node: SupportNodes) {
      checkBefore(node)
      checkAfter(node)
    }

    function removeSpaceBetween(left: Token, right: Token) {
      const textBetween = sourceCode.text.slice(left.range[1], right.range[0])

      // raise error only if there is no newline
      if (/\s/.test(textBetween) && !/^[\r\n]/.test(textBetween)) {
        context.report({
          loc: {
            start: left.loc.end,
            end: right.loc.start,
          },
          messageId: 'genericSpacingMismatch',
          * fix(fixer) {
            yield fixer.replaceTextRange([left.range[1], right.range[0]], '')
          },
        })
      }
    }

    function checkBracketSpacing(openToken: Token | null, closeToken: Token | null) {
      if (openToken) {
        const firstToken = sourceCode.getTokenAfter(openToken)

        if (firstToken) {
          removeSpaceBetween(openToken, firstToken)
        }
      }

      if (closeToken) {
        const lastToken = sourceCode.getTokenBefore(closeToken)

        if (lastToken) {
          removeSpaceBetween(lastToken, closeToken)
        }
      }
    }

    return {
      TSTypeParameterInstantiation: (node) => {
        checkSpacing(node)

        const params = node.params

        if (params.length === 0)
          return

        const openToken = sourceCode.getTokenBefore(params[0])
        const closeToken = sourceCode.getTokenAfter(params[params.length - 1])

        checkBracketSpacing(openToken, closeToken)
      },

      TSTypeParameterDeclaration: (node) => {
        checkSpacing(node)

        const params = node.params

        if (params.length === 0)
          return

        const openToken = sourceCode.getTokenBefore(params[0])
        const closeToken = sourceCode.getTokenAfter(params[params.length - 1])

        checkBracketSpacing(openToken, closeToken)
      },

      // add space around = in type Foo<T = true>
      TSTypeParameter: (node) => {
        if (!node.default)
          return

        const endNode = node.constraint || node.name
        const from = endNode.range[1]
        const to = node.default.range[0]
        const span = sourceCode.text.slice(from, to)

        if (!span.match(/(?:^|[^ ]) = (?:$|[^ ])/)) {
          context.report({
            * fix(fixer) {
              yield fixer.replaceTextRange([from, to], span.replace(/\s*=\s*/, ' = '))
            },
            loc: {
              start: endNode.loc.end,
              end: node.default.loc.start,
            },
            messageId: 'genericSpacingMismatch',
            node,
          })
        }
      },
    }
  },
})
