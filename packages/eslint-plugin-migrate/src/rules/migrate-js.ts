import { packages } from '@eslint-stylistic/metadata'
import { createEslintRule, createRuleListener } from '../shared'
import type { MigrationOption } from '../shared'

const js = packages.find(p => p.shortId === 'js')!

export default createEslintRule<[MigrationOption], 'migrate'>({
  name: 'migrate-js',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Migrate built-in stylistic rules to @stylistic/js rules',
    },
    fixable: 'code',
    messages: {
      migrate: 'Should migrate stylistic rule \'{{from}}\' to \'{{to}}\'',
    },
    schema: undefined!,
  },
  defaultOptions: [{
    namespaceFrom: '',
    namespaceTo: '@stylistic/js',
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
