import { ESLintUtils } from '@typescript-eslint/utils'
import { version } from 'eslint/package.json'
import * as semver from 'semver'

// @ts-expect-error no types
import jsRules from '@stylistic/eslint-plugin-js'
import type { Rule } from 'eslint'

const isESLintV8 = semver.major(version) >= 8

export const getESLintCoreRule: (ruleId: string) => Rule.RuleModule = (ruleId) => {
  if (ruleId in jsRules.rules)
    return jsRules.rules[ruleId]()

  // TODO: remove this as we may not need to depens on any rules from eslint
  return isESLintV8
    ? ESLintUtils.nullThrows(require('eslint/use-at-your-own-risk').builtinRules.get(ruleId), `ESLint's core rule '${ruleId}' not found.`)
    : require(`eslint/lib/rules/${ruleId}`)
}
