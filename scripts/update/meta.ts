import { fileURLToPath } from 'node:url'

export { RULE_ALIAS } from '../../rule-alias'

export const ROOT = fileURLToPath(new URL('../..', import.meta.url))

export const GEN_HEADER = `
/* GENERATED, DO NOT EDIT DIRECTLY */
`.trimStart()

export const RULE_ORIGINAL_ID_MAP: Record<string, string> = {
  'function-call-spacing': 'func-call-spacing',
  '@typescript-eslint/function-call-spacing': '@typescript-eslint/func-call-spacing',
}
