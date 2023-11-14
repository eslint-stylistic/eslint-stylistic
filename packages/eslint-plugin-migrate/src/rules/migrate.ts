import { packages } from '@eslint-stylistic/metadata'
import type { MigrationOption } from '../shared'
import { createEslintRule, createRuleListener } from '../shared'

const ts = packages.find(p => p.shortId === 'ts')!
const js = packages.find(p => p.shortId === 'js')!
const jsx = packages.find(p => p.shortId === 'jsx')!

export default createEslintRule<[Pick<MigrationOption, 'namespaceTo'>], 'migrate'>({
  name: 'migrate',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Migrate builtin and `@typescript-eslint` stylistic rules to `@stylistic` rules',
    },
    fixable: 'code',
    messages: {
      migrate: 'Should migrate stylistic rule \'{{from}}\' to \'{{to}}\'',
    },
    schema: [
      {
        type: 'object',
        properties: {
          namespaceTo: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{
    namespaceTo: '@stylistic',
  }],
  create(context, options) {
    return createRuleListener(
      context as any,
      [
        {
          namespaceFrom: '',
          namespaceTo: options[0].namespaceTo,
          rules: js.rules,
        },
        {
          namespaceFrom: '@typescript-eslint',
          namespaceTo: options[0].namespaceTo,
          rules: ts.rules,
        },
        {
          namespaceFrom: 'react',
          namespaceTo: options[0].namespaceTo,
          rules: jsx.rules,
        },
      ],
    )
  },
})
