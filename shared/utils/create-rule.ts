import type { RuleContext, RuleListener, RuleModule, RuleWithMetaAndName } from '#types'
import type { Rule } from 'eslint'
import { warnDeprecation } from '.'
import { deepMerge, isObjectNotArray } from './merge'

export interface ESLintRuleModule<
  T extends readonly unknown[],
  // eslint-disable-next-line unused-imports/no-unused-vars
  TMessageIds extends string,
> extends Rule.RuleModule {
  defaultOptions: T
}

export interface RuleDocs {
  experimental?: boolean
}

export function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>(
  {
    name,
    create,
    defaultOptions = [] as any,
    meta,
  }: Omit<
    Readonly<RuleWithMetaAndName<TOptions, TMessageIds, RuleDocs>>,
    'defaultOptions',
  > & {
    defaultOptions?: TOptions
  },
): ESLintRuleModule<TOptions, TMessageIds> {
  return {
    create: ((
      context: Readonly<RuleContext<TMessageIds, TOptions>>,
    ): RuleListener => {
      if (meta.deprecated) {
        let insted: string | undefined

        if (typeof meta.deprecated !== 'boolean') {
          const {
            replacedBy,
          } = meta.deprecated

          if (replacedBy) {
            insted = replacedBy
              .map(({ rule, plugin }) => `"${rule?.name}"${plugin?.name ? ` in "${plugin.name}"` : ''}`)
              .join(', ')
          }
        }

        warnDeprecation(`rule("${name}")`, insted)
      }

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
        url: `https://eslint.style/rules/${name}`,
      },
    } as any,
  }
}

export function castRuleModule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>(rule: ESLintRuleModule<TOptions, TMessageIds>): RuleModule<TMessageIds, TOptions> {
  return rule as any
}
