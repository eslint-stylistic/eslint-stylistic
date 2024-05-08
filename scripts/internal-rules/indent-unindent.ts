import { unindent } from '@antfu/utils'
import { createRule } from '../../packages/eslint-plugin-ts/utils'

type MessageIds = 'indent-unindent'

export default createRule<[], MessageIds>({
  name: 'indent-unindent',
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce consistent indentation',
    },
    fixable: 'code',
    schema: [],
    messages: {
      'indent-unindent': 'Indentation must be consistent',
    },
  },
  defaultOptions: [],
  create(context) {
    const tags = ['$', 'unindent', 'unIndent']
    const indent = 2
    return {
      TaggedTemplateExpression(node) {
        const id = node.tag
        if (!id || id.type !== 'Identifier')
          return
        if (!tags.includes(id.name))
          return
        if (node.quasi.quasis.length !== 1)
          return
        const quasi = node.quasi.quasis[0]
        const value = quasi.value.cooked
        const lineStartIndex = context.sourceCode.getIndexFromLoc({
          line: node.loc.start.line,
          column: 0,
        })
        const baseIndent = context.sourceCode.text.slice(lineStartIndex).match(/^\s*/)?.[0] ?? ''
        const targetIndent = baseIndent + ' '.repeat(indent)
        const pure = unindent([value] as any)
        let final = pure
          .split('\n')
          .map(line => targetIndent + line)
          .join('\n')

        final = `\n${final}\n${baseIndent}`

        const escaped = final.replace(/`/g, '\\`')
        if (final !== value) {
          context.report({
            node: quasi,
            messageId: 'indent-unindent',
            fix: fixer => fixer.replaceText(quasi, `\`${escaped}\``),
          })
        }
      },
    }
  },
})
