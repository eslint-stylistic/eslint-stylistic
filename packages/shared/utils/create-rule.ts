import type { Rule } from 'eslint'
import { deepMerge, isObjectNotArray } from './merge'
import type { RuleContext, RuleListener, RuleModule, RuleWithMetaAndName } from '#types'

export interface ESLintRuleModule<
  T extends readonly unknown[],
  // eslint-disable-next-line unused-imports/no-unused-vars
  TMessageIds extends string,
> extends Rule.RuleModule {
  defaultOptions: T
}

export function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>(
  {
    name,
    package: pkg,
    create,
    defaultOptions = [] as any,
    meta,
  }: Omit<
    Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>,
    'defaultOptions'
  > & {
    package: 'js' | 'ts' | 'jsx' | 'plus'
    defaultOptions?: TOptions
  },
): ESLintRuleModule<TOptions, TMessageIds> {
  return {
    create: ((
      context: Readonly<RuleContext<TMessageIds, TOptions>>,
    ): RuleListener => {
      const optionsCount = Math.max(context.options.length, defaultOptions.length)
      const optionsWithDefault = Array.from(
        { length: optionsCount },
        (_, i) => {
          if (isObjectNotArray(context.options[i]) && isObjectNotArray(defaultOptions[i])) {
            return deepMerge(defaultOptions[i], context.options[i])
          }
          return context.options[i] ?? defaultOptions[i]
        },
      ) as unknown as TOptions
      return create(context, optionsWithDefault)
    }) as any,
    defaultOptions,
    meta: {
      ...meta,
      docs: {
        ...meta.docs,
        url: `https://eslint.style/rules/${pkg}/${name}`,
      },
    },
  }
}

export function castRuleModule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>(rule: ESLintRuleModule<TOptions, TMessageIds>): RuleModule<TMessageIds, TOptions> {
  return rule as any
}
