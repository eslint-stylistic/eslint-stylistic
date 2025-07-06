const warned = new Set()

export function warnOnce(text: string) {
  if (warned.has(text))
    return

  warned.add(text)
  console.warn(text)
}

export function warnDeprecated(value: string, instead: string, rule = '') {
  return warnOnce(`You are using deprecated ${value} in "@stylistic/eslint-plugin${rule ? `/rules/${rule}` : ''}", please use "${instead}" instead.`)
}
