import type { Token } from '#types'
import type { MessageIds, RuleOptions } from './types'
import { createRule } from '#utils/create-rule'

const PRESERVE_PREFIX_SPACE_BEFORE_GENERIC = new Set([
  'TSCallSignatureDeclaration',
  'ArrowFunctionExpression',
  'TSFunctionType',
  'FunctionExpression',
])

export default createRule<RuleOptions, MessageIds>({
  name: 'type-generic-spacing',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforces consistent spacing inside TypeScript type generics',
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      genericSpacingMismatch: 'Generic spaces mismatch',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.sourceCode

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
        const params = node.params

        if (params.length === 0)
          return

        const openToken = sourceCode.getTokenBefore(params[0])
        const closeToken = sourceCode.getTokenAfter(params[params.length - 1])

        checkBracketSpacing(openToken, closeToken)
      },

      TSTypeParameterDeclaration: (node) => {
        if (!PRESERVE_PREFIX_SPACE_BEFORE_GENERIC.has(node.parent.type)) {
          const pre = sourceCode.text.slice(0, node.range[0])
          const preSpace = pre.match(/(\s+)$/)?.[0]

          // strip space before <T>
          if (preSpace && preSpace.length) {
            context.report({
              node,
              messageId: 'genericSpacingMismatch',
              * fix(fixer) {
                yield fixer.replaceTextRange([node.range[0] - preSpace.length, node.range[0]], '')
              },
            })
          }
        }

        const params = node.params

        if (params.length === 0)
          return

        const openToken = sourceCode.getTokenBefore(params[0])
        const closeToken = sourceCode.getTokenAfter(params[params.length - 1])

        checkBracketSpacing(openToken, closeToken)

        // add space between <T,K>
        for (let i = 1; i < params.length; i++) {
          const prev = params[i - 1]
          const current = params[i]
          const from = prev.range[1]
          const to = current.range[0]
          const span = sourceCode.text.slice(from, to)
          if (span !== ', ' && !span.match(/,\s*\n/)) {
            context.report({
              * fix(fixer) {
                yield fixer.replaceTextRange([from, to], ', ')
              },
              loc: {
                start: prev.loc.end,
                end: current.loc.start,
              },
              messageId: 'genericSpacingMismatch',
              node,
            })
          }
        }
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
