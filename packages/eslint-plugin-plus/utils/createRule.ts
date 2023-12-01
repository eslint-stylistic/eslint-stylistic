import { ESLintUtils } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'

export interface RuleModule<
  T extends readonly unknown[],
> extends Rule.RuleModule {
  defaultOptions: T
}

export const createRule = ESLintUtils.RuleCreator(
  name => `https://eslint.style/rules/plus/${name}`,
)
