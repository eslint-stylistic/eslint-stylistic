import { createRule } from '../../utils'
import { getJsRule } from '../../utils/get-js-rule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getJsRule('object-curly-newline')

const defaultOptionValue = { multiline: false, minProperties: Number.POSITIVE_INFINITY, consistent: true }

export default createRule<RuleOptions, MessageIds>({
  name: 'object-curly-newline',
  package: 'ts',
  meta: {
    ...baseRule.meta,
    docs: {
      description: 'Enforce consistent line breaks after opening and before closing braces',
    },
  },
  defaultOptions: [
    {
      ObjectExpression: defaultOptionValue,
      ObjectPattern: defaultOptionValue,
      ImportDeclaration: defaultOptionValue,
      ExportDeclaration: defaultOptionValue,
      TSTypeLiteral: defaultOptionValue,
      TSInterfaceBody: defaultOptionValue,
    },
  ],

  create(context) {
    const rules = baseRule.create(context)

    return rules
  },
})
