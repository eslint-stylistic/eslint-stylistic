import type { RuleContext, RuleListener, RuleWithMetaAndName } from '#types'
import type { Rule } from 'eslint'
import { warnDeprecation } from '.'
import { deepMerge, isObjectNotArray } from './merge'

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
    meta,
  }: Omit<
    Readonly<RuleWithMetaAndName<TOptions, TMessageIds, RuleDocs>>,
    'defaultOptions'
  >,
): Rule.RuleModule {
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

      const { defaultOptions = [] } = meta
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
    meta: {
      ...meta,
      docs: {
        ...meta.docs,
        url: `https://eslint.style/rules/${name}`,
      },
    } as any,
  }
}
