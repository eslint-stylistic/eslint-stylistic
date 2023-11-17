import { createRule } from '../../utils/createRule'
import type { MessageIds, RuleOptions } from './types'

export default createRule<RuleOptions, MessageIds>({
  name: 'no-extra-semi',
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow unnecessary semicolons',
      extendsBaseRule: true,
    },
    fixable: 'whitespace',
    schema: [],
    messages: {},
  },
  defaultOptions: [],
  create(_context) {
    return {}
  },
})
