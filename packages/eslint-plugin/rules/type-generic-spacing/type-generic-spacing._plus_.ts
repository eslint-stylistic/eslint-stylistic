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
  package: 'plus',
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

    return {
      TSTypeParameterInstantiation: (node) => {
        const params = node.params

        const openToken = sourceCode.getTokenBefore(params[0])
        const firstToken = openToken ? sourceCode.getTokenAfter(openToken) : null

        const closeToken = sourceCode.getTokenAfter(params[params.length - 1])
        const lastToken = closeToken ? sourceCode.getTokenBefore(closeToken) : null

        // remove spaces between "<" and the first type parameter
        if (openToken && firstToken) {
          const textBetween = sourceCode.text.slice(openToken.range[1], firstToken.range[0])

          // raise error only if there is no newline
          if (/\s/.test(textBetween) && !/^[\r\n]/.test(textBetween)) {
            context.report({
              node,
              messageId: 'genericSpacingMismatch',
              * fix(fixer) {
                yield fixer.replaceTextRange([openToken.range[1], firstToken.range[0]], '')
              },
            })
          }
        }

        // remove spaces between the last type parameter and ">"
        if (closeToken && lastToken) {
          const textBetween = sourceCode.text.slice(lastToken.range[1], closeToken.range[0])

          // raise error only if there is no newline
          if (/\s/.test(textBetween) && !/^[\r\n]/.test(textBetween)) {
            context.report({
              node,
              messageId: 'genericSpacingMismatch',
              * fix(fixer) {
                yield fixer.replaceTextRange([lastToken.range[1], closeToken.range[0]], '')
              },
            })
          }
        }
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

        const openToken = sourceCode.getTokenBefore(params[0])
        const firstToken = openToken ? sourceCode.getTokenAfter(openToken) : null

        const closeToken = sourceCode.getTokenAfter(params[params.length - 1])
        const lastToken = closeToken ? sourceCode.getTokenBefore(closeToken) : null

        // remove spaces between "<" and the first type parameter
        if (openToken && firstToken) {
          const textBetween = sourceCode.text.slice(openToken.range[1], firstToken.range[0])

          // raise error only if there is no newline
          if (/\s/.test(textBetween) && !/^[\r\n]/.test(textBetween)) {
            context.report({
              node,
              messageId: 'genericSpacingMismatch',
              * fix(fixer) {
                yield fixer.replaceTextRange([openToken.range[1], firstToken.range[0]], '')
              },
            })
          }
        }

        // remove spaces between the last type parameter and ">"
        if (closeToken && lastToken) {
          const textBetween = sourceCode.text.slice(lastToken.range[1], closeToken.range[0])

          // raise error only if there is no newline
          if (/\s/.test(textBetween) && !/^[\r\n]/.test(textBetween)) {
            context.report({
              node,
              messageId: 'genericSpacingMismatch',
              * fix(fixer) {
                yield fixer.replaceTextRange([lastToken.range[1], closeToken.range[0]], '')
              },
            })
          }
        }

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
