/**
 * Generate sharable configs for all rules in a plugin
 *
 * @param plugin
 * @param name
 * @param flat
 */
export function createAllConfigs<T extends { rules: Record<string, any> }>(
  plugin: T,
  name: string,
  flat: boolean,
  filter?: (name: string, rule: any) => boolean,
) {
  const rules = Object.fromEntries(
    Object
      .entries(plugin.rules)
      .filter(([key, rule]) =>
        // Only include fixable rules
        rule.meta.fixable
        // Only include non-deprecated rules
        && !rule.meta.deprecated
        // Not an alias
        && key === rule.meta.docs.url.split('/').pop()
        // Custom filter
        && (!filter || filter(key, rule)),
      )
      .map(([key]) => [`${name}/${key}`, 2]),
  )

  if (flat) {
    return {
      plugins: {
        [name]: plugin,
      },
      rules,
    }
  }
  else {
    return {
      plugins: [name],
      rules,
    }
  }
}
