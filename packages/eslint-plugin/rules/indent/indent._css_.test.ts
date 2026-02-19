import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './indent'

run<RuleOptions, MessageIds>({
  lang: 'css',
  name: 'indent',
  rule,
  valid: [
    {
      code: 'a { color: red; }',
    },
  ],
})
