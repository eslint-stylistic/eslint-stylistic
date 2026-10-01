import type { Rule } from 'eslint'
import type { RuleContext, RuleListener, RuleWithMetaAndName } from '#types'
import { warnDeprecation } from '.'
import { deepMerge, isObjectNotArray } from './merge'

const DEFAULT_LANGUAGES = ['js/*']

export interface RuleDocs {
  experimental?: boolean
}

type RuleDefinition<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
> = RuleWithMetaAndName<TOptions, TMessageIds, RuleDocs>

type RuleDefinitionWithLanguages<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
> = Omit<RuleDefinition<TOptions, TMessageIds>, 'meta'> & {
  meta: RuleDefinition<TOptions, TMessageIds>['meta'] & {
    languages?: string[]
  }
}

export function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>({ name, create, meta }: Readonly<RuleDefinitionWithLanguages<TOptions, TMessageIds>>): Rule.RuleModule {
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
      languages: DEFAULT_LANGUAGES,
      ...meta,
      docs: {
        ...meta.docs,
        url: `https://eslint.style/rules/${name}`,
      },
    } as any,
  }
}
