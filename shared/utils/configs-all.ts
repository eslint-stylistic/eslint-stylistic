import type { Linter } from 'eslint'

/**
 * Generate sharable configs for all rules in a plugin
 *
 * @param plugin
 * @param name
 * @param filter
 */
export function createAllConfigs<T extends { rules: Record<string, any> }>(
  plugin: T,
  name: string,
  filter?: (name: string, rule: any) => boolean,
): Linter.Config {
  const rules = Object.fromEntries(
    Object
      .entries(plugin.rules)
      .filter(
        ([key, rule]) =>
        // Only include fixable rules
          rule.meta.fixable
          // Only include non-deprecated and non-experimental rules
          && !rule.meta.deprecated
          && !rule.meta.experimental
          // Not an alias
          && key === rule.meta.docs.url.split('/').pop()
          // Custom filter
          && (!filter || filter(key, rule)),
      )
      .map(([key]) => [`${name}/${key}`, 2]),
  ) as Linter.Config['rules']

  return {
    plugins: {
      [name]: plugin,
    },
    rules,
  }
}
