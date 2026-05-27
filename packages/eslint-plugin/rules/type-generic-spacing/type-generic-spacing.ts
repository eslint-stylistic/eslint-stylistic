import type { NodeTypes, Token, Tree } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

const SKIP_BEFORE_CHECK = new Set<NodeTypes>([
  // interface A {
  //   <T>(a: number): A
  // }
  'TSCallSignatureDeclaration',
  // interface A {
  //   new <T>(a: number): A
  //      ^
  // handled by `space-unary-ops`
  // }
  'TSConstructSignatureDeclaration',
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
])

function shouldSkipBeforeCheck(node: SupportNodes) {
  if (SKIP_BEFORE_CHECK.has(node.parent.type))
    return true

  // const foo = function <T>() {}
  //                     ^
  // handled by `space-before-function-paren`
  //
  // const foo = class <T> {}
  //                  ^
  // handled by `keyword-spacing`
  if (node.parent.type === 'FunctionExpression' || node.parent.type === 'ClassExpression')
    return node.parent.id == null

  return false
}

const SHOULD_CHECK_AFTER = new Set<NodeTypes>([
  // const foo = callback<T> ()
  //                        ^
  'CallExpression',
  // const foo = new Foo<T> ()
  //                        ^
  'NewExpression',
  // const foo = tag<T> `template`
  //                   ^
  'TaggedTemplateExpression',
  // interface A {
  //   <T> (): A
  //      ^
  // }
  'TSCallSignatureDeclaration',
  // interface A {
  //   new<T> (): A
  //         ^
  // }
  'TSConstructSignatureDeclaration',
  // interface A {
  //   foo<T> (): A
  //        ^
  // }
  'TSMethodSignature',
  // type Foo = <T> () => void
  //              ^
  'TSFunctionType',
  // type Foo = new<T> () => void
  //                  ^
  'TSConstructorType',
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
          },
          after: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        before: false,
        after: false,
      },
    ],
    messages: {
      genericSpacingMismatch: 'Generic spaces mismatch',
    },
  },
  create: (context, [options]) => {
    const sourceCode = context.sourceCode
    const { before, after } = options!

    function checkBefore(node: SupportNodes) {
      if (shouldSkipBeforeCheck(node))
        return

      const preToken = sourceCode.getTokenBefore(node, { includeComments: true })!
      const hasSpace = sourceCode.isSpaceBetween(preToken, node)

      if (before !== hasSpace) {
        context.report({
          loc: {
            start: preToken.loc.end,
            end: node.loc.start,
          },
          messageId: 'genericSpacingMismatch',
          fix(fixer) {
            return before
              ? fixer.insertTextBefore(node, ' ')
              : fixer.replaceTextRange([preToken.range[1], node.range[0]], '')
          },
        })
      }
    }

    function checkAfter(node: SupportNodes) {
      if (!SHOULD_CHECK_AFTER.has(node.parent.type))
        return
      const nextToken = sourceCode.getTokenAfter(node, { includeComments: true })!
      const hasSpace = sourceCode.isSpaceBetween(node, nextToken)

      if (after !== hasSpace) {
        context.report({
          loc: {
            start: node.loc.end,
            end: nextToken.loc.start,
          },
          messageId: 'genericSpacingMismatch',
          fix(fixer) {
            return after
              ? fixer.insertTextAfter(node, ' ')
              : fixer.replaceTextRange([node.range[1], nextToken.range[0]], '')
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

        const openToken = sourceCode.getTokenBefore(node.params[0])
        const closeToken = sourceCode.getTokenAfter(node.params.at(-1)!)

        checkBracketSpacing(openToken, closeToken)
      },

      TSTypeParameterDeclaration: (node) => {
        checkSpacing(node)

        const openToken = sourceCode.getTokenBefore(node.params[0])
        const closeToken = sourceCode.getTokenAfter(node.params.at(-1)!)

        checkBracketSpacing(openToken, closeToken)
      },
    }
  },
})
