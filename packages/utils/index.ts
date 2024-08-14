import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { RuleListener, RuleWithMetaAndName } from '@typescript-eslint/utils/eslint-utils'
import type { Rule } from 'eslint'

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
      const optionsWithDefault = context.options.map((options, index) => {
        if (options === undefined)
          return defaultOptions[index]
        if (typeof options !== 'object' || !Array.isArray(options) || options === null)
          return options
        return {
          ...defaultOptions[index] || {},
          ...options || {},
        }
      }) as unknown as TOptions
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
