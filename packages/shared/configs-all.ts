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
) {
  const rules = Object.fromEntries(
    Object
      .entries(plugin.rules)
      .filter(([key, { meta }]) =>
        // Not an alias
        key === meta.docs.url.split('/').pop()
        // Only include fixable rules
        && meta.fixable
        // Only include non-deprecated rules
        && !meta.deprecated
        && !key.startsWith('jsx-'),
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
