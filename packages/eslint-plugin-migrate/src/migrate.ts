import { rules } from '@eslint-stylistic/metadata'
import { ESLintUtils } from '@typescript-eslint/utils'

export const createEslintRule = ESLintUtils.RuleCreator(
  ruleName => ruleName,
)

export default createEslintRule({
  name: 'rules',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Migrate built-in stylistic rules to @stylistic rules',
    },
    fixable: 'code',
    messages: {
      migrate: 'Should migrate stylistic rule \'{{from}}\' to \'{{to}}\'',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    let parentNode: any
    return {
      Property(node) {
        if (((node.key.type === 'Identifier' && node.key.name === 'rules') || (node.key.type === 'Literal' && node.key.value === 'rules')) && node.value.type === 'ObjectExpression') {
          parentNode = node.value
          return
        }
        if (!parentNode || parentNode !== node.parent)
          return

        const name = node.key.type === 'Literal'
          ? node.key.value
          : node.key.type === 'Identifier'
            ? node.key.name
            : null

        const rule = rules.find(r => r.originalId === name)
        if (!rule)
          return

        context.report({
          node: node.key,
          messageId: 'migrate',
          data: {
            from: name,
            to: rule.ruleId,
          },
          fix: (fixer) => {
            if (node.key.type === 'Literal')
              return fixer.replaceText(node.key, node.key.raw[0] + rule.ruleId + node.key.raw[0])
            else
              return fixer.replaceText(node.key, `'${rule.ruleId}'`)
          },
        })
      },

      JSONProperty(node: any) {
        if (node.key.type === 'JSONLiteral' && node.key.value === 'rules' && node.value.type === 'JSONObjectExpression') {
          parentNode = node.value
          return
        }
        if (!parentNode || parentNode !== node.parent)
          return

        const name = node.key.value
        const rule = rules.find(r => r.originalId === name)
        if (!rule)
          return

        context.report({
          node: node.key,
          messageId: 'migrate',
          data: {
            from: name,
            to: rule.ruleId,
          },
          fix: (fixer) => {
            return fixer.replaceText(node.key, `"${rule.ruleId}"`)
          },
        })
      },
    }
  },
})
