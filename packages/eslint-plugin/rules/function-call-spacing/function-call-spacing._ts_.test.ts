// this rule tests the spacing, which prettier will want to fix and break the tests
/* /plugin-test-formatting": ["error", { formatWithPrettier: false }] */

import type { ValidTestCase } from '#test'
import type { MessageIds, RuleOptions } from './types'
import { run } from '#test'
import rule from './function-call-spacing'

run<RuleOptions, MessageIds>({
  name: 'function-call-spacing',
  rule,
  valid: [
    // default ("never")
    'f<a>()',
    'f<a>(b, b)',
    'f.b<a>(b, b)',
    '(function<T>() {}<a>())',
    '((function<T>() {})<a>())',
    '( f )<a>( 0 )',
    '( (f) )<a>( (0) )',
    '( f()() )<a>(0)',

    // optional call
    'f?.<a>()',
    'f?.<a>(b, b)',
    'f.b?.<a>(b, b)',
    'f?.b<a>(b, b)',
    'f?.b?.<a>(b, b)',
    '(function<T>() {}?.<a>())',
    '((function<T>() {})<a>())',
    '( f )?.<a>( 0 )',
    '( (f) )?.<a>( (0) )',
    '( f()() )?.<a>(0)',

    ...[
      'f<a> ()',
      'f<a> (b, b)',
      'f.b<a> (b, b)',
      '(function<T>() {}<a> ())',
      '((function<T>() {})<a> ())',
      '( f )<a> ( 0 )',
      '( (f) )<a> ( (0) )',
      '( f () )<a> (0)',

      // optional call
      'f?.b<a> (b, b)',
    ].map<ValidTestCase<RuleOptions>>(code => ({
      code,
      options: ['always'],
    })),
  ],
  invalid: [
  ],
})
