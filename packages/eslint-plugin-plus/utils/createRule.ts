import { ESLintUtils } from '@typescript-eslint/utils'

export const createRule = ESLintUtils.RuleCreator(
  name => `https://eslint.style/rules/ts/${name}`,
)
