import { ESLintUtils } from '@typescript-eslint/utils'
import type { RuleContext, RuleListener } from '@typescript-eslint/utils/ts-eslint'
import type { RuleInfo } from '@eslint-stylistic/metadata'

export const createEslintRule = ESLintUtils.RuleCreator(
  ruleName => ruleName,
)

export interface MigrationOption {
  namespaceFrom?: string
  namespaceTo?: string
}

export interface MigrateSet extends MigrationOption {
  rules: readonly RuleInfo[]
}
export function createRuleListener(
  context: Readonly<RuleContext<'migrate', []>>,
  sets: readonly MigrateSet[],
): RuleListener {
  let parentNode: any

  function findRule(fromName: string) {
    for (const set of sets) {
      const {
        namespaceFrom,
        namespaceTo,
        rules,
      } = set
      const ruleName = namespaceFrom
        ? fromName?.startsWith(`${namespaceFrom}/`)
          ? fromName.slice(namespaceFrom.length + 1)
          : null
        : fromName

      if (!ruleName)
        continue

      const rule = rules.find(r => r.name === ruleName)
      if (!rule)
        continue

      const toName = namespaceTo
        ? `${namespaceTo}/${ruleName}`
        : ruleName

      return {
        rule,
        fromName,
        toName,
      }
    }
  }

  return {
    Property(node) {
      if (((node.key.type === 'Identifier' && node.key.name === 'rules') || (node.key.type === 'Literal' && node.key.value === 'rules')) && node.value.type === 'ObjectExpression') {
        parentNode = node.value
        return
      }
      if (!parentNode || parentNode !== node.parent)
        return

      const fromName = node.key.type === 'Literal'
        ? node.key.value
        : node.key.type === 'Identifier'
          ? node.key.name
          : null

      if (!(typeof fromName === 'string'))
        return

      const match = findRule(fromName)
      if (!match)
        return

      const { toName } = match

      context.report({
        node: node.key,
        messageId: 'migrate',
        data: {
          from: fromName,
          to: toName,
        },
        fix: (fixer) => {
          if (node.key.type === 'Literal')
            return fixer.replaceText(node.key, node.key.raw[0] + toName + node.key.raw[0])
          else
            return fixer.replaceText(node.key, `'${toName}'`)
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

      const fromName = node.key.value
      const match = findRule(fromName)
      if (!match)
        return

      const { toName } = match

      context.report({
        node: node.key,
        messageId: 'migrate',
        data: {
          from: fromName,
          to: toName,
        },
        fix: (fixer) => {
          return fixer.replaceText(node.key, `"${toName}"`)
        },
      })
    },
  }
}

export const includeGlobs = [
  '**/.eslintrc.js',
  '**/.eslintrc.cjs',
  '**/.eslintrc.json',
  '**/eslintrc.js',
  '**/eslintrc.cjs',
  '**/eslintrc.json',
  '**/eslint.config.js',
  '**/eslint.config.ts',
  '**/eslint-config-*/index.js',
  '**/eslint-config-*/src/index.js',
  '**/eslint-config-*/src/index.ts',
  '**/eslint-config/index.js',
  '**/eslint-config/src/index.js',
  '**/eslint-config/src/index.ts',
]
