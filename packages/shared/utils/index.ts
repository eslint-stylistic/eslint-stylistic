const warned = new Set()

export function warnOnce(text: string) {
  if (warned.has(text))
    return

  warned.add(text)
  console.warn(`[@stylistic/eslint-plugin]: ${text}`)
}

export function warnDeprecated(value: string, instead: string, rule = '') {
  return warnOnce(`You are using deprecated ${value}${rule ? ` in "${rule}"` : ''}, please use ${instead} instead.`)
}
