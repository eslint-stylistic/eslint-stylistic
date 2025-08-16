const warned = new Set()

export function warnOnce(text: string) {
  if (warned.has(text))
    return

  warned.add(text)
  console.warn(`[@stylistic/eslint-plugin]: ${text}`)
}

export function warnDeprecation(value: string, instead?: string, rule = '') {
  let message = `You are using deprecated ${value}${rule ? ` in "${rule}"` : ''}`
  if (instead)
    message += `, please use ${instead} instead.`

  return warnOnce(message)
}
