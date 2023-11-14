import { packages } from '@eslint-stylistic/metadata'
import type { MigrationOption } from '../shared'
import { createEslintRule, createRuleListener } from '../shared'

const ts = packages.find(p => p.shortId === 'ts')!

export default createEslintRule<[MigrationOption], 'migrate'>({
  name: 'migrate-ts',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Migrate `@typescript-eslint` stylistic rules to `@stylistic/ts` rules',
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
          namespaceFrom: {
            type: 'string',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{
    namespaceFrom: '@typescript-eslint',
    namespaceTo: '@stylistic/ts',
  }],
  create(context, options) {
    return createRuleListener(
      context as any,
      [{
        namespaceFrom: options[0].namespaceFrom,
        namespaceTo: options[0].namespaceTo,
        rules: ts.rules,
      }],
    )
  },
})
