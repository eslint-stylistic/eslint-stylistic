import { packages } from '@eslint-stylistic/metadata'
import { createEslintRule, createRuleListener } from '../shared'
import type { MigrationOption } from '../shared'

const js = packages.find(p => p.shortId === 'jsx')!

export default createEslintRule<[MigrationOption], 'migrate'>({
  name: 'migrate-jsx',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Migrate JSX stylistic rules from `eslint-plugin-react` to @stylistic/jsx rules',
    },
    fixable: 'code',
    messages: {
      migrate: 'Should migrate stylistic rule \'{{from}}\' to \'{{to}}\'',
    },
    schema: undefined!,
  },
  defaultOptions: [{
    namespaceFrom: 'react',
    namespaceTo: '@stylistic/jsx',
  }],
  create(context, options) {
    return createRuleListener(
      context as any,
      [{
        namespaceFrom: options[0].namespaceFrom,
        namespaceTo: options[0].namespaceTo,
        rules: js.rules,
      }],
    )
  },
})
