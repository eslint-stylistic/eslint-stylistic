import js from '@stylistic/eslint-plugin-js'
import ts from '@stylistic/eslint-plugin-ts'

export default {
  rules: {
    ...js.rules,
    ...ts.rules,
  },
}
