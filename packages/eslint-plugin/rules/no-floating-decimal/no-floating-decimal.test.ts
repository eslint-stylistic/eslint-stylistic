/**
 * @fileoverview Tests for no-floating-decimal rule.
 * @author James Allardice
 */

import type { TestCaseError } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './no-floating-decimal'

const leadingError: TestCaseError<MessageIds> = { messageId: 'leading', type: 'Literal' }
const trailingError: TestCaseError<MessageIds> = { messageId: 'trailing', type: 'Literal' }

run<RuleOptions, MessageIds>({
  name: 'no-floating-decimal',
  rule,
  valid: [
    'var x = 2.5;',
    'var x = "2.5";',
  ],
  invalid: [
    {
      code: 'var x = .5;',
      output: 'var x = 0.5;',
      errors: [leadingError],
    },
    {
      code: 'var x = -.5;',
      output: 'var x = -0.5;',
      errors: [leadingError],
    },
    {
      code: 'var x = 2.;',
      output: 'var x = 2.0;',
      errors: [trailingError],
    },
    {
      code: 'var x = -2.;',
      output: 'var x = -2.0;',
      errors: [trailingError],
    },
    {
      code: 'typeof.2',
      output: 'typeof 0.2',
      errors: [leadingError],
    },
    {
      code: 'for(foo of.2);',
      output: 'for(foo of 0.2);',
      parserOptions: { ecmaVersion: 2015 },
      errors: [leadingError],
    },
  ],
})
