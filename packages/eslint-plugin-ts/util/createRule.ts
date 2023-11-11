import { ESLintUtils } from '@typescript-eslint/utils'
import type { RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils'
import type { Rule } from 'eslint'

export interface RuleModule<
  T extends readonly unknown[],
> extends Rule.RuleModule {
  defaultOptions: T
}

export const createRule = ESLintUtils.RuleCreator(
  name => `https://eslint.style/rules/ts/${name}`,
) as any as <TOptions extends readonly unknown[], TMessageIds extends string>({ name, meta, ...rule }: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions>
