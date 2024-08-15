import { createRule } from '../../utils'
import { getESLintCoreRule } from '../../utils/getESLintCoreRule'
import type { MessageIds, RuleOptions } from './types'

const baseRule = getESLintCoreRule('object-curly-newline')

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
