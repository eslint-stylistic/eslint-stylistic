import { fileURLToPath } from 'node:url'

export { RULE_ALIAS } from '../../rule-alias'

export const ROOT = fileURLToPath(new URL('../..', import.meta.url))

export const GEN_HEADER = `
/* GENERATED, DO NOT EDIT DIRECTLY */
`.trimStart()
