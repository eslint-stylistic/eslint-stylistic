import type { Arrayable } from '../types'
import { env } from 'node:process'

const warned = new Set()

export function warnOnce(text: string) {
  if (env.TEST || warned.has(text))
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

export function warnDeprecatedOptions<T extends Record<string, any>>(options: T | undefined, keys: Arrayable<keyof T>, instead?: keyof T, rule = '') {
  if (!Array.isArray(keys))
    keys = [keys]
  keys.forEach((key) => {
    if (options && Object.hasOwn(options, key))
      warnDeprecation(`option("${key.toString()}")`, instead ? `"${instead.toString()}"` : undefined, rule)
  })
}
