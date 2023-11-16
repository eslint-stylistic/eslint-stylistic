import js from '@stylistic/eslint-plugin-js'
import jsx from '@stylistic/eslint-plugin-jsx'
import ts from '@stylistic/eslint-plugin-ts'
import extra from '@stylistic/eslint-plugin-extra'
import { configs } from '../configs'

export type * from '../dts'

export default {
  rules: {
    ...js.rules,
    ...jsx.rules,
    ...ts.rules,
    ...extra.rules,
  },
  configs,
}
