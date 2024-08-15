import type { Rule } from 'eslint'
import { deepMerge, isObjectNotArray } from './merge'
import type { RuleContext, RuleListener, RuleWithMetaAndName } from '#types'

export interface RuleModule<
  T extends readonly unknown[],
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
): RuleModule<TOptions> {
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
