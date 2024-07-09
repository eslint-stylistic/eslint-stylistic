import type { TSESLint } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'
import { ESLintUtils } from '@typescript-eslint/utils'

export function createRule<MessageIds extends string, RuleOptions extends any[]>(
  rule: Omit<TSESLint.RuleModule<MessageIds, RuleOptions>, 'defaultOptions'>,
) {
  return rule as unknown as Rule.RuleModule
}

export interface RuleModule<
  T extends readonly unknown[],
> extends Rule.RuleModule {
  defaultOptions: T
}

export const createTSRule = ESLintUtils.RuleCreator(
  name => `https://eslint.style/rules/js/${name}`,
)
